const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Grade a returned product using Gemini AI vision
 * @param {Array<{data: string, mimeType: string}>} images - Base64 encoded images
 * @param {string} category - Product category
 * @param {string} returnReason - Reason for return
 * @param {string} productName - Product name
 * @param {number} mrp - Original MRP
 * @returns {Object} Grading result
 */
async function gradeProduct(images, category, returnReason, productName, mrp) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `You are an expert product quality assessor for Amazon's returns processing system called ReLoop.

Analyze the provided product images and assess the condition of this returned product.

Product Details:
- Name: ${productName}
- Category: ${category}
- Original MRP: ₹${mrp}
- Return Reason: ${returnReason}

Grade the product on a scale and provide your assessment in the following JSON format ONLY (no markdown, no code fences, just raw JSON):

{
  "grade": "A+|A|B|C|D|F",
  "score": <number 0-100>,
  "confidence": <number 0-100>,
  "conditionSummary": "<2-3 sentence summary of product condition>",
  "defectsFound": ["<list of visible defects, empty array if none>"],
  "missingParts": ["<list of missing parts/accessories, empty array if none>"],
  "functionalNotes": "<notes on expected functionality based on visual inspection>",
  "estimatedResaleValue": <number - estimated resale value in INR>
}

Grading Scale:
- A+ (Like New): Product is in perfect/near-perfect condition. Score 90-100. Discount 10% off MRP.
- A (Excellent): Minor cosmetic signs of use only. Score 75-89. Discount 20% off MRP.
- B (Good): Visible wear but fully functional. Score 55-74. Discount 35% off MRP.
- C (Fair): Significant wear, may need minor repair. Score 35-54. Discount 50% off MRP.
- D (Poor): Heavy wear/damage, not suitable for resale. Score 15-34.
- F (Unsalvageable): Broken, hazardous, or missing critical parts. Score 0-14.

Be accurate and conservative in your assessment. The grade determines whether this product is resold, refurbished, donated, or recycled.`;

  // Build image parts
  const imageParts = images.map(img => ({
    inlineData: {
      data: img.data,
      mimeType: img.mimeType,
    },
  }));

  const result = await model.generateContent([prompt, ...imageParts]);
  const responseText = result.response.text();

  // Strip markdown code fences if present
  let cleanText = responseText.trim();
  if (cleanText.startsWith('```json')) {
    cleanText = cleanText.slice(7);
  } else if (cleanText.startsWith('```')) {
    cleanText = cleanText.slice(3);
  }
  if (cleanText.endsWith('```')) {
    cleanText = cleanText.slice(0, -3);
  }
  cleanText = cleanText.trim();

  try {
    const parsed = JSON.parse(cleanText);

    // Validate and normalize the response
    const validGrades = ['A+', 'A', 'B', 'C', 'D', 'F'];
    if (!validGrades.includes(parsed.grade)) {
      parsed.grade = 'B'; // Default if invalid
    }

    return {
      grade: parsed.grade,
      score: Math.min(100, Math.max(0, parseInt(parsed.score) || 65)),
      confidence: Math.min(100, Math.max(0, parseFloat(parsed.confidence) || 70)),
      conditionSummary: parsed.conditionSummary || 'Assessment complete.',
      defectsFound: Array.isArray(parsed.defectsFound) ? parsed.defectsFound : [],
      missingParts: Array.isArray(parsed.missingParts) ? parsed.missingParts : [],
      functionalNotes: parsed.functionalNotes || '',
      estimatedResaleValue: parseFloat(parsed.estimatedResaleValue) || mrp * 0.6,
    };
  } catch (parseError) {
    console.error('Failed to parse Gemini response:', cleanText);
    throw new Error(`Gemini response parse failed: ${parseError.message}`);
  }
}

module.exports = { gradeProduct };
