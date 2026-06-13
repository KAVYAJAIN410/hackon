require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { gradeProduct } = require('./src/lib/gemini');

async function main() {
  // Create a simple test image (1x1 white pixel PNG) if no real image available
  // You can replace this path with any real product image for better results
  const testImagePath = path.join(__dirname, 'test-image.jpg');

  let base64;
  let mimeType = 'image/jpeg';

  if (fs.existsSync(testImagePath)) {
    base64 = fs.readFileSync(testImagePath).toString('base64');
    console.log('✓ Loaded local test image');
  } else {
    // Create a minimal 1x1 white PNG as fallback
    // (Gemini will still respond with a grade based on the prompt context)
    const minimalPng = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
      'base64'
    );
    base64 = minimalPng.toString('base64');
    mimeType = 'image/png';
    console.log('⚠ No test-image.jpg found — using minimal placeholder');
    console.log('  (Place a real product image at backend/test-image.jpg for better results)');
  }

  const images = [{ base64, mimeType }];

  console.log('\n📸 Calling Gemini AI grading...\n');

  try {
    const result = await gradeProduct(
      images,
      'Fashion',
      'Size doesn\'t fit, shoes are unused',
      'Bata Comfit Women\'s Walking Shoes (Size 6, Grey)',
      499
    );

    console.log('═══ GRADING RESULT ═══');
    console.log(JSON.stringify(result, null, 2));

    // Verify required fields
    console.log('\n═══ FIELD VERIFICATION ═══');
    const requiredFields = ['grade', 'score', 'confidence', 'exteriorScore', 'functionalNotes', 'defectsFound', 'missingParts', 'conditionSummary'];

    let allPresent = true;
    for (const field of requiredFields) {
      const present = result[field] !== undefined;
      console.log(`  ${present ? '✅' : '❌'} ${field}: ${present ? JSON.stringify(result[field]).slice(0, 60) : 'MISSING'}`);
      if (!present) allPresent = false;
    }

    console.log(`\n${allPresent ? '✅ All fields present!' : '❌ Some fields missing'}`);
  } catch (err) {
    console.error('❌ Grading failed:', err.message);
    if (err.message.includes('API_KEY')) {
      console.error('   → Check GEMINI_API_KEY in backend/.env');
    }
    process.exit(1);
  }
}

main();
