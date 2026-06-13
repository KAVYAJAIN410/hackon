const router = require('express').Router();
const multer = require('multer');
const { prisma } = require('../lib/db');
const { decideRoute, getDemandSignal } = require('../lib/routing');
const { calculateDeliveryCost } = require('../lib/costing');
const { GREEN_CREDITS, GRADE_CONFIG, getTierForCredits } = require('../lib/constants');

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
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const { returnId } = req.body;

    if (!returnId) {
      return res.status(400).json({ error: 'returnId is required' });
    }

    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: 'At least 2 images are required' });
    }

    // Fetch return with order + product details
    const returnRecord = await prisma.return.findUnique({
      where: { id: returnId },
      include: {
        order: { include: { product: true } },
        user: { include: { nearestDc: true } },
      },
    });

    if (!returnRecord) {
      return res.status(404).json({ error: 'Return not found' });
    }

    // Check if already graded
    const existingGrading = await prisma.aiGrading.findUnique({
      where: { returnId },
    });
    if (existingGrading) {
      return res.status(400).json({ error: 'Return has already been graded' });
    }

    const product = returnRecord.order.product;

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

    // Step 5: Determine green credits based on route
    const creditsMap = {
      RESELL: GREEN_CREDITS.RESELL_ROUTE,
      REFURBISH: GREEN_CREDITS.REFURBISH_ROUTE,
      DONATE: GREEN_CREDITS.DONATE_ROUTE,
      RECYCLE: GREEN_CREDITS.RECYCLE_ROUTE,
    };
    const creditsAwarded = creditsMap[routeResult.chosenRoute] || GREEN_CREDITS.RETURN_COMPLETED;

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
          returnMethod: routeResult.chosenRoute, // System-decided, not user-chosen
        },
      });

      // If route is RESELL, create inventory item
      let inventoryItem = null;
      if (routeResult.chosenRoute === 'RESELL') {
        const sellingPrice = Math.round(parseFloat(product.mrp) * (1 - gradeConfig.discountPct / 100));
        inventoryItem = await tx.inventoryItem.create({
          data: {
            returnId,
            productId: product.id,
            currentDcId: userDcId,
            status: 'AVAILABLE',
            grade: gradingResult.grade,
            basePrice: parseFloat(product.mrp),
            sellingPrice,
            source: 'RETURN',
          },
        });
      }

      // Award green credits
      await tx.greenCreditLedger.create({
        data: {
          userId: returnRecord.userId,
          amount: creditsAwarded,
          action: `RETURN_${routeResult.chosenRoute}`,
          referenceId: returnId,
          description: `Return graded ${gradingResult.grade} — routed to ${routeResult.chosenRoute}. Earned ${creditsAwarded} green credits.`,
        },
      });

      // Update user's green credits + tier
      const updatedUser = await tx.user.update({
        where: { id: returnRecord.userId },
        data: {
          greenCredits: { increment: creditsAwarded },
        },
      });
      const newTier = getTierForCredits(updatedUser.greenCredits);
      if (newTier !== updatedUser.greenTier) {
        await tx.user.update({
          where: { id: returnRecord.userId },
          data: { greenTier: newTier },
        });
      }

      return { grading, updatedReturn, inventoryItem, updatedUser };
    });

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
    res.status(500).json({ error: 'Failed to grade product' });
  }
});

module.exports = router;
