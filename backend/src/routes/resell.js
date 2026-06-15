const router = require('express').Router();
const multer = require('multer');
const { prisma } = require('../lib/db');
const { authenticate } = require('../middleware/auth');
const { GREEN_CREDITS, GRADE_CONFIG, getTierForCredits } = require('../lib/constants');
const { getDemandSignal } = require('../lib/routing');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  },
});

// Helper: months between a date and now
function monthsSince(date) {
  if (!date) return 0;
  const diff = Date.now() - new Date(date).getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24 * 30)));
}

// Age-based depreciation factor
function ageFactor(months) {
  if (months <= 6) return 0.75;
  if (months <= 12) return 0.60;
  if (months <= 24) return 0.45;
  return 0.30;
}

// Grade-based multiplier on top of age factor
const GRADE_MULTIPLIER = { 'A+': 1.0, 'A': 0.9, 'B': 0.75, 'C': 0.6, 'D': 0.4, 'F': 0.2 };

// GET /api/resell/:orderId/questions — AI-generated condition questions + product age
router.get('/:orderId/questions', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { product: true },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.userId !== userId) return res.status(403).json({ error: 'Order does not belong to this user' });
    if (order.status !== 'DELIVERED') return res.status(400).json({ error: 'Only delivered orders can be resold' });

    const ageMonths = monthsSince(order.orderedAt);

    const { generateResellQuestions } = require('../lib/gemini');
    const questions = await generateResellQuestions(
      order.product.name,
      order.product.category,
      order.product.description,
      ageMonths
    );

    res.json({
      orderId,
      product: order.product,
      ageMonths,
      ageLabel: ageMonths < 12 ? `${ageMonths} month${ageMonths !== 1 ? 's' : ''} old` : `${(ageMonths / 12).toFixed(1)} years old`,
      mrp: parseFloat(order.product.mrp),
      questions,
    });
  } catch (error) {
    console.error('Error generating resell questions:', error);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

// POST /api/resell/:orderId/list — answers + images → AI grade → list on marketplace
router.post('/:orderId/list', authenticate, upload.array('images', 5), async (req, res) => {
  // Track S3 uploads for compensating cleanup if the DB commit fails
  let uploadedS3Urls = [];
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    // answers comes as JSON string (multipart form)
    let answers = [];
    try {
      answers = JSON.parse(req.body.answers || '[]');
    } catch {
      answers = [];
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { product: true },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.userId !== userId) return res.status(403).json({ error: 'Order does not belong to this user' });
    if (order.status !== 'DELIVERED') return res.status(400).json({ error: 'Only delivered orders can be resold' });

    // Prevent double listing of the same order
    const existing = await prisma.inventoryItem.findFirst({
      where: { sourceOrderId: orderId, source: 'OUTGROWN' },
    });
    if (existing) {
      return res.status(400).json({ error: 'You have already listed this product on the marketplace' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { nearestDc: true },
    });

    const ageMonths = monthsSince(order.orderedAt);
    const product = order.product;

    // Build images array for Gemini
    const images = (req.files || []).map(f => ({
      data: f.buffer.toString('base64'),
      mimeType: f.mimetype,
    }));

    // AI grade (with built-in fallback inside the function)
    const { gradeResellProduct } = require('../lib/gemini');
    const gradingResult = await gradeResellProduct(
      images,
      product.name,
      product.category,
      parseFloat(product.mrp),
      ageMonths,
      answers
    );

    const grade = gradingResult.grade || 'B';
    const gradeConfig = GRADE_CONFIG[grade] || GRADE_CONFIG['B'];

    // Reject D/F — not resellable
    if (['D', 'F'].includes(grade)) {
      return res.status(200).json({
        listed: false,
        grade,
        gradingResult,
        message: `Based on the assessment, this item is grade ${grade} and isn't suitable for resale. Consider donating or recycling it instead.`,
      });
    }

    // Price = MRP × ageFactor × gradeMultiplier
    const factor = ageFactor(ageMonths);
    const gradeMult = GRADE_MULTIPLIER[grade] || 0.6;
    const sellingPrice = Math.round(parseFloat(product.mrp) * factor * gradeMult);

    // Upload health images to S3 (non-fatal)
    let healthImages = [];
    try {
      const { uploadToS3 } = require('../lib/s3');
      healthImages = await Promise.all(
        (req.files || []).map(f => uploadToS3(f.buffer, f.mimetype, `outgrown/${orderId}`))
      );
      uploadedS3Urls = healthImages.filter(u => typeof u === 'string' && u.startsWith('http'));
    } catch (s3Err) {
      console.error('S3 upload failed (non-fatal):', s3Err.message);
      healthImages = [];
    }

    const result = await prisma.$transaction(async (tx) => {
      const inventoryItem = await tx.inventoryItem.create({
        data: {
          productId: order.productId,
          currentDcId: user.nearestDcId,
          status: 'AVAILABLE',
          grade,
          basePrice: parseFloat(product.mrp),
          sellingPrice,
          source: 'OUTGROWN',
          listedByUserId: userId,
          sourceOrderId: orderId,
          ageMonths,
          conditionAnswers: answers,
          gradingData: {
            grade,
            score: gradingResult.score,
            confidence: gradingResult.confidence,
            conditionSummary: gradingResult.conditionSummary,
            defectsFound: gradingResult.defectsFound || [],
            missingParts: gradingResult.missingParts || [],
            functionalNotes: gradingResult.functionalNotes,
          },
          healthImages,
        },
        include: { product: true, currentDc: true },
      });

      // Award green credits for sustainable trade-in
      await tx.greenCreditLedger.create({
        data: {
          userId,
          amount: GREEN_CREDITS.OUTGROWN_LISTING,
          action: 'OUTGROWN_LISTING',
          referenceId: inventoryItem.id,
          description: `Listed ${product.name} (Grade ${grade}) via Trade-In`,
        },
      });

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { greenCredits: { increment: GREEN_CREDITS.OUTGROWN_LISTING } },
      });

      const newTier = getTierForCredits(updatedUser.greenCredits);
      if (newTier !== updatedUser.greenTier) {
        await tx.user.update({ where: { id: userId }, data: { greenTier: newTier } });
      }

      return { inventoryItem, updatedUser };
    });

    const demandCount = await getDemandSignal(order.productId, user.nearestDcId, prisma);

    res.status(201).json({
      listed: true,
      inventoryItem: result.inventoryItem,
      grade,
      gradeLabel: gradeConfig.label,
      sellingPrice,
      ageMonths,
      grading: result.inventoryItem.gradingData,
      demandSignal: demandCount,
      creditsAwarded: GREEN_CREDITS.OUTGROWN_LISTING,
      healthImages,
      message: `${product.name} listed as Grade ${grade} for ₹${sellingPrice.toLocaleString()}! ${demandCount > 0 ? `${demandCount} buyers near ${user.nearestDc?.city || 'you'} are interested.` : 'Buyers will be notified.'}`,
    });
  } catch (error) {
    console.error('Error listing resell product:', error);
    // Compensating action: remove orphaned S3 objects if the DB commit failed
    if (uploadedS3Urls.length > 0) {
      const { deleteFromS3 } = require('../lib/s3');
      await deleteFromS3(uploadedS3Urls);
      console.log(`🧹 Cleaned up ${uploadedS3Urls.length} orphaned S3 object(s) after failed resell listing`);
    }
    res.status(500).json({ error: 'Failed to list product' });
  }
});

module.exports = router;
