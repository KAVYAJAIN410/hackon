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
-If gread differ by more than two level mark it as F grade and in description you can mention about its chances of being fraudulents
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

module.exports = { gradeProduct, generateFinalGrading, generateResellQuestions, gradeResellProduct };

// ───────────────────────────────────────────────────────────────────────────
// RESELL FLOW (Outgrown It) — question generation + condition grading
// ───────────────────────────────────────────────────────────────────────────

// Fallback question bank by category — used if Gemini fails
const FALLBACK_QUESTIONS = {
  Electronics: [
    { id: 'q1', question: 'Does the device power on and function normally?', options: ['Yes, works perfectly', 'Works with minor issues', 'Does not work'] },
    { id: 'q2', question: 'What is the condition of the screen/body?', options: ['Flawless', 'Minor scratches', 'Visible dents or cracks'] },
    { id: 'q3', question: 'Do you have the original box and accessories?', options: ['Yes, everything', 'Partial', 'None'] },
    { id: 'q4', question: 'Is the product still under warranty?', options: ['Yes', 'No', 'Not sure'] },
    { id: 'q5', question: 'How often was it used?', options: ['Rarely', 'Moderately', 'Heavily'] },
  ],
  Fashion: [
    { id: 'q1', question: 'How many times has this been worn?', options: ['Never (tags intact)', '1-5 times', 'Many times'] },
    { id: 'q2', question: 'Are there any stains, tears, or damage?', options: ['None', 'Minor', 'Significant'] },
    { id: 'q3', question: 'Has the item been washed or dry-cleaned?', options: ['Never', 'Once or twice', 'Multiple times'] },
    { id: 'q4', question: 'Is the original packaging/tags available?', options: ['Yes', 'No'] },
    { id: 'q5', question: 'How would you rate the overall fabric condition?', options: ['Like new', 'Good', 'Worn out'] },
  ],
  default: [
    { id: 'q1', question: 'What is the overall condition of the product?', options: ['Like new', 'Good', 'Fair', 'Poor'] },
    { id: 'q2', question: 'Is the product fully functional?', options: ['Yes', 'Partially', 'No'] },
    { id: 'q3', question: 'Are there any visible signs of wear or damage?', options: ['None', 'Minor', 'Significant'] },
    { id: 'q4', question: 'Do you have the original packaging and accessories?', options: ['Yes, all', 'Some', 'None'] },
    { id: 'q5', question: 'How frequently was the product used?', options: ['Rarely', 'Moderately', 'Heavily'] },
  ],
};

function getFallbackQuestions(category) {
  return FALLBACK_QUESTIONS[category] || FALLBACK_QUESTIONS.default;
}

/**
 * Generate 5 condition-assessment questions tailored to a product using its description.
 * Falls back to a category-based question bank if Gemini fails.
 */
async function generateResellQuestions(productName, category, description, ageMonths) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert resale condition assessor (like Cashify). Generate exactly 5 condition-assessment questions for a customer who wants to resell their used product.

Product: ${productName}
Category: ${category}
Description: ${description || 'N/A'}
Product age: ${ageMonths} months

The questions must:
- Be specific to THIS product type and help assess its resale condition/value
- Each have 2-4 multiple-choice options ordered from best condition to worst
- Cover functionality, cosmetic condition, accessories/packaging, and usage

Return ONLY this JSON (no markdown):
{
  "questions": [
    { "id": "q1", "question": "<question text>", "options": ["<best>", "<...>", "<worst>"] },
    { "id": "q2", "question": "...", "options": [...] },
    { "id": "q3", "question": "...", "options": [...] },
    { "id": "q4", "question": "...", "options": [...] },
    { "id": "q5", "question": "...", "options": [...] }
  ]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      throw new Error('Invalid question format from AI');
    }
    return parsed.questions.slice(0, 5);
  } catch (err) {
    console.error('generateResellQuestions failed, using fallback:', err.message);
    return getFallbackQuestions(category);
  }
}

/**
 * Grade a resell product using uploaded images + the customer's answers to the condition questions.
 * Falls back to an answer-derived grade if Gemini fails.
 */
async function gradeResellProduct(images, productName, category, mrp, ageMonths, questionsAndAnswers) {
  const qaText = (questionsAndAnswers || [])
    .map((qa, i) => `${i + 1}. ${qa.question}\n   Customer answer: ${qa.answer}`)
    .join('\n');

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert product condition assessor for a certified-resale marketplace.
Assess this used product a customer wants to resell, using BOTH their answers and the photos.

Product: ${productName}
Category: ${category}
MRP: Rs.${mrp}
Product age: ${ageMonths} months

Customer's condition answers:
${qaText || 'No answers provided'}

Cross-check the photos against the customer's answers. If photos contradict claims, trust the photos.

Return ONLY this JSON (no markdown):
{
  "grade": "A+" | "A" | "B" | "C" | "D" | "F",
  "score": <0-100>,
  "confidence": <0.00-1.00>,
  "functionalNotes": "<assessment string>",
  "defectsFound": [{"type": "scratch|dent|stain|crack|tear|none", "severity": "none|minor|moderate|major|critical", "location": "<where>"}],
  "missingParts": [] or ["<part>"],
  "conditionSummary": "<2-3 sentence summary considering age, answers, and photos>"
}

Grading: A+=like new, A=minimal use, B=minor cosmetic wear, C=noticeable wear, D=damaged, F=broken. Factor in age: a ${ageMonths}-month-old product should rarely be A+ unless barely used.`;

    const imageParts = (images || []).map(img => ({
      inlineData: { data: img.base64 || img.data, mimeType: img.mimeType }
    }));

    const result = await model.generateContent([prompt, ...imageParts]);
    const text = result.response.text();
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('gradeResellProduct failed, using fallback:', err.message);
    // Fallback: derive a grade from the answers (count "worst" answers) + age
    const answers = (questionsAndAnswers || []).map(qa => (qa.answer || '').toLowerCase());
    let penalty = 0;
    answers.forEach(a => {
      if (/(does not|doesn't|broken|significant|heavily|cracked|none|many times|worn out|no)/.test(a)) penalty += 2;
      else if (/(minor|partial|moderate|once|some|good|few)/.test(a)) penalty += 1;
    });
    // Age penalty
    if (ageMonths > 24) penalty += 2;
    else if (ageMonths > 12) penalty += 1;

    let grade, score;
    if (penalty <= 1) { grade = 'A'; score = 88; }
    else if (penalty <= 3) { grade = 'B'; score = 72; }
    else if (penalty <= 5) { grade = 'C'; score = 55; }
    else { grade = 'D'; score = 35; }

    return {
      grade,
      score,
      confidence: 0.6,
      functionalNotes: 'Automated fallback grading based on your answers and product age (AI image analysis unavailable).',
      defectsFound: [],
      missingParts: [],
      conditionSummary: `Based on your responses and a product age of ${ageMonths} months, this item is graded ${grade}. A manual review may refine this assessment.`,
    };
  }
}
