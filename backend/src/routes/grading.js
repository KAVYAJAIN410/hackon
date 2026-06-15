const router = require('express').Router();
const multer = require('multer');
const { prisma } = require('../lib/db');
const { decideRoute, getDemandSignal } = require('../lib/routing');
const { calculateDeliveryCost } = require('../lib/costing');
const { GREEN_CREDITS, GRADE_CONFIG, getTierForCredits } = require('../lib/constants');
const { authenticate } = require('../middleware/auth');

// Multer setup — memory storage (buffer stays in RAM for S3 + Gemini)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// POST /api/grading — AI grade product + auto-decide route
// This is the expanded endpoint: grades → decides route → awards credits
router.post('/', authenticate, upload.array('images', 5), async (req, res) => {
  // Track S3 uploads so we can clean up orphans if the DB commit fails (saga/compensating action)
  let uploadedS3Urls = [];
  try {
    const { returnId } = req.body;

    if (!returnId) {
      return res.status(400).json({ error: 'returnId is required' });
    }

    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: 'At least 2 images are required' });
    }

    // Fetch return with order + product details (supports both original & marketplace orders)
    const returnRecord = await prisma.return.findUnique({
      where: { id: returnId },
      include: {
        order: { include: { product: true } },
        marketplaceOrder: { include: { inventoryItem: { include: { product: true } } } },
        user: { include: { nearestDc: true } },
      },
    });

    if (!returnRecord) {
      return res.status(404).json({ error: 'Return not found' });
    }

    // Check existing grading with same label — override if exists
    const gradedBy = req.user.role === 'DELIVERY_PARTNER' ? 'DELIVERY_ASSOCIATE' : 'USER';
    const existingGrading = await prisma.aiGrading.findFirst({
      where: { returnId, gradedBy },
    });

    // If grading exists with same label, delete it (will be replaced with new one)
    if (existingGrading) {
      await prisma.aiGrading.delete({ where: { id: existingGrading.id } });
    }

    // Resolve product from either original order or refurbished (marketplace) order
    const product = returnRecord.order?.product || returnRecord.marketplaceOrder?.inventoryItem?.product;
    if (!product) {
      return res.status(400).json({ error: 'Could not resolve product for this return' });
    }

    // Step 1: Convert images to base64 for Gemini
    const images = req.files.map(file => ({
      data: file.buffer.toString('base64'),
      mimeType: file.mimetype,
    }));

    // Step 2: Call Gemini AI for grading
    let gradingResult;
    try {
      const { gradeProduct } = require('../lib/gemini');
      gradingResult = await gradeProduct(
        images,
        product.category,
        returnRecord.reason,
        product.name,
        parseFloat(product.mrp)
      );
    } catch (aiError) {
      console.error('Gemini AI error:', aiError);
      // Fallback grading if AI fails
      gradingResult = {
        grade: 'B',
        score: 65,
        confidence: 70.0,
        conditionSummary: 'AI grading unavailable — default grade assigned. Manual review recommended.',
        defectsFound: [],
        missingParts: [],
        functionalNotes: 'Automated fallback grading applied.',
        estimatedResaleValue: parseFloat(product.mrp) * 0.65,
      };
    }

    // Step 3: Upload images to S3
    let imageUrls = [];
    try {
      const { uploadToS3 } = require('../lib/s3');
      imageUrls = await Promise.all(
        req.files.map(file =>
          uploadToS3(file.buffer, file.mimetype, `returns/${returnId}`)
        )
      );
      // Record real (http) URLs so we can delete them if the DB commit fails later
      uploadedS3Urls = imageUrls.filter(u => u.startsWith('http'));
    } catch (s3Error) {
      console.error('S3 upload error (non-fatal):', s3Error);
      // Continue without S3 — images won't have URLs but grading still works
      imageUrls = req.files.map((_, i) => `placeholder://return-${returnId}-image-${i}`);
    }

    // Step 4: Decide route automatically (Amazon decides, NOT the user)
    const gradeConfig = GRADE_CONFIG[gradingResult.grade] || GRADE_CONFIG['D'];
    const dcRoutes = await prisma.dcRoute.findMany();
    const userDcId = returnRecord.user.nearestDcId;

    // Use local shipping cost for viability check
    const localShipping = calculateDeliveryCost(userDcId, userDcId, dcRoutes);
    const demandSignal = await getDemandSignal(product.id, userDcId, prisma);

    const routeResult = decideRoute(
      gradingResult.grade,
      parseFloat(product.mrp),
      localShipping.totalShipping,
      demandSignal > 0
    );

    // Step 5: No green credits for returns — only trade-in and buying refurbished earn credits
    const creditsAwarded = 0;

    // Step 6: Save everything in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Save AI grading
      const grading = await tx.aiGrading.create({
        data: {
          returnId,
          grade: gradingResult.grade,
          score: gradingResult.score,
          confidence: gradingResult.confidence,
          conditionSummary: gradingResult.conditionSummary,
          defectsFound: gradingResult.defectsFound || [],
          missingParts: gradingResult.missingParts || [],
          functionalNotes: gradingResult.functionalNotes,
          estimatedResaleValue: gradingResult.estimatedResaleValue,
          gradeDiscountPct: gradeConfig.discountPct,
          routeDecision: routeResult.chosenRoute,
          gradedBy: req.user.role === 'DELIVERY_PARTNER' ? 'DELIVERY_ASSOCIATE' : 'USER',
        },
      });

      // Save return images
      if (imageUrls.length > 0) {
        await tx.returnImage.createMany({
          data: imageUrls.map(url => ({
            returnId,
            imageUrl: url,
          })),
        });
      }

      // Update return record with route decision + status
      const updatedReturn = await tx.return.update({
        where: { id: returnId },
        data: {
          status: 'GRADED',
          routeDecision: routeResult.chosenRoute,
          returnMethod: routeResult.chosenRoute,
        },
      });

      // NOTE: Inventory item (marketplace listing) is NOT created here.
      // It's only created after the delivery associate grades AND final grading is computed.
      // This ensures products only appear on marketplace after physical pickup + verification.
      let inventoryItem = null;

      const updatedUser = await tx.user.findUnique({ where: { id: returnRecord.userId } });

      return { grading, updatedReturn, inventoryItem, updatedUser };
    });

    // Step 7: If delivery associate just graded, generate final combined grading
    let finalGrading = null;
    if (gradedBy === 'DELIVERY_ASSOCIATE') {
      // Check if user grading also exists
      const allGradings = await prisma.aiGrading.findMany({ where: { returnId } });
      const userGrading = allGradings.find(g => g.gradedBy === 'USER');
      const daGrading = allGradings.find(g => g.gradedBy === 'DELIVERY_ASSOCIATE');

      if (userGrading && daGrading) {
        let finalResult;
        try {
          const { generateFinalGrading } = require('../lib/gemini');
          finalResult = await generateFinalGrading(
            userGrading, daGrading,
            product.name, product.category, parseFloat(product.mrp)
          );
        } catch (finalErr) {
          console.error('Final grading Gemini call failed, using fallback:', finalErr.message);
          // Fallback: lean on delivery associate grading (more reliable — in-person inspection)
          // Average the scores, take the worse (more conservative) grade
          const gradeOrder = ['A+', 'A', 'B', 'C', 'D', 'F'];
          const worseGrade = gradeOrder.indexOf(userGrading.grade) > gradeOrder.indexOf(daGrading.grade)
            ? userGrading.grade
            : daGrading.grade;
          // Weight: 60% delivery associate, 40% user
          const blendedScore = Math.round(
            parseFloat(daGrading.score) * 0.6 + parseFloat(userGrading.score) * 0.4
          );
          const blendedConfidence = parseFloat(
            (parseFloat(daGrading.confidence) * 0.6 + parseFloat(userGrading.confidence) * 0.4).toFixed(2)
          );
          // Merge defects from both
          const mergedDefects = [
            ...(Array.isArray(daGrading.defectsFound) ? daGrading.defectsFound : []),
            ...(Array.isArray(userGrading.defectsFound) ? userGrading.defectsFound : []),
          ];
          const mergedMissing = [
            ...(Array.isArray(daGrading.missingParts) ? daGrading.missingParts : []),
            ...(Array.isArray(userGrading.missingParts) ? userGrading.missingParts : []),
          ];

          finalResult = {
            grade: worseGrade,
            score: blendedScore,
            confidence: blendedConfidence,
            conditionSummary: `Combined assessment (automated fallback): Based on customer grade ${userGrading.grade} and delivery associate grade ${daGrading.grade}. Final grade ${worseGrade} assigned with delivery associate inspection weighted higher.`,
            defectsFound: mergedDefects,
            missingParts: mergedMissing,
            functionalNotes: daGrading.functionalNotes || userGrading.functionalNotes || 'Combined from both gradings.',
          };
        }

        try {
          const finalGradeConfig = GRADE_CONFIG[finalResult.grade] || GRADE_CONFIG['B'];
          const estimatedResaleValue = Math.round(parseFloat(product.mrp) * (1 - finalGradeConfig.discountPct / 100));

          // Re-decide route based on FINAL grade
          const finalLocalShipping = calculateDeliveryCost(userDcId, userDcId, dcRoutes);
          const finalDemand = await getDemandSignal(product.id, userDcId, prisma);
          const finalRoute = decideRoute(
            finalResult.grade,
            parseFloat(product.mrp),
            finalLocalShipping.totalShipping,
            finalDemand > 0
          );

          // Delete existing final grading if any
          await prisma.finalGrading.deleteMany({ where: { returnId } });

          finalGrading = await prisma.finalGrading.create({
            data: {
              returnId,
              grade: finalResult.grade,
              score: finalResult.score,
              confidence: finalResult.confidence,
              conditionSummary: finalResult.conditionSummary,
              defectsFound: finalResult.defectsFound || [],
              missingParts: finalResult.missingParts || [],
              functionalNotes: finalResult.functionalNotes,
              estimatedResaleValue,
              gradeDiscountPct: finalGradeConfig.discountPct,
              routeDecision: finalRoute.chosenRoute,
            },
          });

          // Update the return's route decision to the final route
          await prisma.return.update({
            where: { id: returnId },
            data: { routeDecision: finalRoute.chosenRoute, status: 'GRADED' },
          });

          // ─── NOW list on marketplace (only after delivery pickup + final grading) ───
          // Remove any stale inventory item first
          await prisma.inventoryItem.deleteMany({ where: { returnId } });

          if (finalRoute.chosenRoute === 'RESELL') {
            const sellingPrice = Math.round(parseFloat(product.mrp) * (1 - finalGradeConfig.discountPct / 100));
            await prisma.inventoryItem.create({
              data: {
                returnId,
                productId: product.id,
                currentDcId: userDcId,
                status: 'AVAILABLE',
                grade: finalResult.grade,
                basePrice: parseFloat(product.mrp),
                sellingPrice,
                source: 'RETURN',
              },
            });
            console.log(`Product listed on marketplace for return ${returnId}: Grade ${finalResult.grade} @ Rs.${sellingPrice}`);
          }

          console.log(`Final grading stored for return ${returnId}: ${finalResult.grade} (${finalResult.score}/100) → ${finalRoute.chosenRoute}`);
        } catch (dbErr) {
          console.error('Failed to store final grading (non-fatal):', dbErr.message);
        }
      }
    }

    res.status(201).json({
      grading: {
        id: result.grading.id,
        grade: result.grading.grade,
        score: result.grading.score,
        confidence: parseFloat(result.grading.confidence),
        conditionSummary: result.grading.conditionSummary,
        defectsFound: result.grading.defectsFound,
        missingParts: result.grading.missingParts,
        functionalNotes: result.grading.functionalNotes,
        gradeDiscountPct: result.grading.gradeDiscountPct,
      },
      finalGrading: finalGrading ? {
        id: finalGrading.id,
        grade: finalGrading.grade,
        score: finalGrading.score,
        confidence: parseFloat(finalGrading.confidence),
        conditionSummary: finalGrading.conditionSummary,
      } : null,
      routing: {
        chosenRoute: routeResult.chosenRoute,
        reason: routeResult.reason,
        alternatives: routeResult.alternatives,
      },
      creditsAwarded,
      inventoryItem: result.inventoryItem,
      imageUrls,
      message: `Product graded ${result.grading.grade}. Amazon has routed this to: ${routeResult.chosenRoute}.`,
    });
  } catch (error) {
    console.error('Error in grading:', error);
    // Compensating action: delete any S3 objects uploaded before the failure
    // to prevent orphaned blobs from accumulating in the bucket.
    if (uploadedS3Urls.length > 0) {
      const { deleteFromS3 } = require('../lib/s3');
      await deleteFromS3(uploadedS3Urls);
      console.log(`🧹 Cleaned up ${uploadedS3Urls.length} orphaned S3 object(s) after failed grading commit`);
    }
    res.status(500).json({ error: 'Failed to grade product' });
  }
});

module.exports = router;
