const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function gradeProduct(images, category, returnReason, productName, mrp) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

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
    inlineData: { data: img.base64, mimeType: img.mimeType }
  }));

  const result = await model.generateContent([prompt, ...imageParts]);
  const text = result.response.text();
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

module.exports = { gradeProduct };
