const router = require('express').Router();
const multer = require('multer');
const { prisma } = require('../lib/db');
const { GRADE_CONFIG } = require('../lib/constants');
const { decideRoute } = require('../lib/routing');
const { calculateDeliveryCost } = require('../lib/costing');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// POST /api/seller/batch-grade — batch AI grading for seller dashboard
router.post('/', upload.array('images', 200), async (req, res) => {
  try {
    const { sellerId } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'At least 1 image is required' });
    }

    const results = [];
    const { gradeProduct } = require('../lib/gemini');
    const dcRoutes = await prisma.dcRoute.findMany();

    // Process each file — rate limited (4 second gaps for 15 RPM Gemini free tier)
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];

      try {
        const image = {
          data: file.buffer.toString('base64'),
          mimeType: file.mimetype,
        };

        const gradingResult = await gradeProduct(
          [image],
          'General', // Default category for batch
          'QUALITY',
          file.originalname || `Item ${i + 1}`,
          1000 // Default MRP for batch
        );

        const gradeConfig = GRADE_CONFIG[gradingResult.grade] || GRADE_CONFIG['B'];
        const suggestedPrice = Math.round(1000 * (1 - gradeConfig.discountPct / 100));

        const routeResult = decideRoute(gradingResult.grade, 1000, 65, false);

        results.push({
          filename: file.originalname || `image_${i + 1}`,
          index: i,
          grade: gradingResult.grade,
          score: gradingResult.score,
          confidence: gradingResult.confidence,
          conditionSummary: gradingResult.conditionSummary,
          defectsFound: gradingResult.defectsFound || [],
          route: routeResult.chosenRoute,
          suggestedPrice,
          status: 'SUCCESS',
        });

        // Rate limit: wait 4 seconds between Gemini calls (15 RPM free tier)
        if (i < req.files.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 4000));
        }
      } catch (itemError) {
        console.error(`Error grading item ${i}:`, itemError);
        results.push({
          filename: file.originalname || `image_${i + 1}`,
          index: i,
          grade: 'B',
          score: 65,
          confidence: 50,
          conditionSummary: 'AI grading failed — default grade assigned.',
          defectsFound: [],
          route: 'RESELL',
          suggestedPrice: 650,
          status: 'FALLBACK',
        });
      }
    }

    // Summary stats
    const graded = results.length;
    const resellable = results.filter(r => r.route === 'RESELL').length;
    const totalRecovery = results.reduce((sum, r) => sum + r.suggestedPrice, 0);

    res.json({
      results,
      summary: {
        totalGraded: graded,
        resellable,
        totalRecovery,
        timeSavedHours: Math.round(graded * 3 / 60),
      },
    });
  } catch (error) {
    console.error('Error in batch grading:', error);
    res.status(500).json({ error: 'Failed to batch grade' });
  }
});

module.exports = router;
