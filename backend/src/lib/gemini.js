const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function gradeProduct(images, category, returnReason, productName, mrp) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are an expert product condition assessor for Amazon's reverse logistics team.

Product: ${productName}
Category: ${category}
MRP: Rs.${mrp}
Customer return reason: "${returnReason}"

Analyze the product images and return ONLY this JSON (no markdown):
{
  "grade": "A+" | "A" | "B" | "C" | "D" | "F",
  "score": <0-100>,
  "confidence": <0.00-1.00>,
  "exteriorScore": <0-100>,
  "functionalNotes": "<assessment string>",
  "defectsFound": [{"type": "scratch|dent|stain|crack|tear|none", "severity": "none|minor|moderate|major|critical", "location": "<where>"}],
  "missingParts": [] or ["<part>"],
  "conditionSummary": "<2-3 sentence summary>"
}

Grading: A+=sealed/perfect, A=minimal use, B=minor cosmetic, C=noticeable wear, D=damaged, F=broken/hazard`;

  const imageParts = images.map(img => ({
    inlineData: { data: img.base64 || img.data, mimeType: img.mimeType }
  }));

  const result = await model.generateContent([prompt, ...imageParts]);
  const text = result.response.text();
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

/**
 * Generate a final combined grading from user and delivery associate gradings.
 * Called automatically after delivery associate submits their grading.
 */
async function generateFinalGrading(userGrading, deliveryGrading, productName, category, mrp) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are a senior product condition assessor for Amazon's reverse logistics team.
You have received TWO independent AI gradings for the same returned product — one based on photos uploaded by the CUSTOMER, and one based on photos taken by the DELIVERY ASSOCIATE during pickup.

Your job: Produce a FINAL combined grading that weighs both assessments. The delivery associate grading is generally more reliable (they see the product in person), but the customer grading provides useful context.

Product: ${productName}
Category: ${category}
MRP: Rs.${mrp}

=== CUSTOMER GRADING ===
Grade: ${userGrading.grade} | Score: ${userGrading.score}/100 | Confidence: ${userGrading.confidence}
Condition: ${userGrading.conditionSummary || 'N/A'}
Defects: ${JSON.stringify(userGrading.defectsFound || [])}
Missing Parts: ${JSON.stringify(userGrading.missingParts || [])}
Functional Notes: ${userGrading.functionalNotes || 'N/A'}

=== DELIVERY ASSOCIATE GRADING ===
Grade: ${deliveryGrading.grade} | Score: ${deliveryGrading.score}/100 | Confidence: ${deliveryGrading.confidence}
Condition: ${deliveryGrading.conditionSummary || 'N/A'}
Defects: ${JSON.stringify(deliveryGrading.defectsFound || [])}
Missing Parts: ${JSON.stringify(deliveryGrading.missingParts || [])}
Functional Notes: ${deliveryGrading.functionalNotes || 'N/A'}

=== INSTRUCTIONS ===
- Weight delivery associate grading at 60%, customer grading at 40%
- If grades differ by more than 1 level, lean toward the delivery associate
- Merge defects found from both (union of all defects)
- If either found missing parts, include them
- Generate a combined confidence score

Return ONLY this JSON (no markdown):
{
  "grade": "A+" | "A" | "B" | "C" | "D" | "F",
  "score": <0-100>,
  "confidence": <0.00-1.00>,
  "functionalNotes": "<combined assessment>",
  "defectsFound": [{"type": "...", "severity": "...", "location": "..."}],
  "missingParts": [],
  "conditionSummary": "<2-3 sentence final assessment combining both perspectives>"
}

Grading: A+=sealed/perfect, A=minimal use, B=minor cosmetic, C=noticeable wear, D=damaged, F=broken/hazard`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

module.exports = { gradeProduct, generateFinalGrading };
