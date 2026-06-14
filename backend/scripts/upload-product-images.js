require('dotenv').config();
const https = require('https');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.S3_BUCKET || 'unlabeledhackon';
const REGION = process.env.AWS_REGION || 'eu-north-1';

// Using reliable image sources (Unsplash/Pexels direct links for product categories)
const PRODUCT_IMAGES = {
  'prod-001': 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80', // Samsung phone
  'prod-002': 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80', // Sony headphones
  'prod-003': 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&q=80', // TWS earbuds
  'prod-004': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80', // Bluetooth speaker
  'prod-005': 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&q=80', // AirPods
  'prod-006': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80', // Monitor
  'prod-007': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80', // Power bank
  'prod-008': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', // Nike shoes
  'prod-009': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80', // Jeans
  'prod-010': 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80', // White shirt
  'prod-011': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80', // Backpack
  'prod-012': 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80', // Watch
  'prod-013': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', // T-shirt
  'prod-014': 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80', // Mixer grinder
  'prod-015': 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&q=80', // Oven
  'prod-016': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80', // Flask/bottle
  'prod-017': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80', // Book
  'prod-018': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80', // Keyboard
  'prod-019': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80', // Smart watch
  'prod-020': 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&q=80', // Pen set
  'prod-021': 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80', // Walking shoes
  'prod-022': 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80', // Phone case
  'prod-023': 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&q=80', // Handkerchief/cloth
  'prod-024': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', // Phone accessory
  'prod-025': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80', // Security camera
  'prod-026': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80', // Kurti/dress
  'prod-027': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80', // Dupatta/scarf
};

function downloadImage(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) return reject(new Error('Too many redirects'));
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, maxRedirects - 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function uploadToS3(buffer, key) {
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: 'image/jpeg',
  }));
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
}

async function main() {
  console.log('🖼️  Downloading product images and uploading to S3...\n');
  console.log(`  Bucket: ${BUCKET} | Region: ${REGION}\n`);

  const products = await prisma.product.findMany();
  let success = 0;
  let failed = 0;

  for (const product of products) {
    const imageUrl = PRODUCT_IMAGES[product.id];
    if (!imageUrl) {
      console.log(`  ⚠️  ${product.id}: No image mapped`);
      failed++;
      continue;
    }

    try {
      const buffer = await downloadImage(imageUrl);
      const key = `products/${product.id}.jpg`;
      const s3Url = await uploadToS3(buffer, key);

      await prisma.product.update({
        where: { id: product.id },
        data: { imageUrl: s3Url },
      });

      console.log(`  ✅ ${product.id}: ${product.name.slice(0, 35)}... → uploaded (${Math.round(buffer.length/1024)}KB)`);
      success++;
    } catch (err) {
      console.log(`  ❌ ${product.id}: ${err.message.slice(0, 80)}`);
      failed++;
    }
  }

  console.log(`\n📊 Done: ${success} uploaded, ${failed} failed out of ${products.length}`);
  await prisma.$disconnect();
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
