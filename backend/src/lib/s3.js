const { S3Client, PutObjectCommand, DeleteObjectsCommand } = require('@aws-sdk/client-s3');
const { randomUUID } = require('crypto');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

function getBucket() {
  return process.env.S3_BUCKET_NAME || process.env.S3_BUCKET;
}

async function uploadToS3(buffer, mimeType, folder = 'returns') {
  const bucket = getBucket();
  const region = process.env.AWS_REGION;
  const ext = mimeType.split('/')[1];
  const key = `${folder}/${randomUUID()}.${ext}`;
  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  }));
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

// Extract the S3 object key from a full public URL
function keyFromUrl(url) {
  try {
    // https://<bucket>.s3.<region>.amazonaws.com/<key>
    const u = new URL(url);
    return decodeURIComponent(u.pathname.replace(/^\//, ''));
  } catch {
    return null;
  }
}

/**
 * Delete one or more S3 objects (compensating action for failed DB commits).
 * Accepts an array of full public URLs. Non-fatal — logs and swallows errors.
 */
async function deleteFromS3(urls = []) {
  const keys = urls.map(keyFromUrl).filter(Boolean);
  if (keys.length === 0) return;
  try {
    await s3.send(new DeleteObjectsCommand({
      Bucket: getBucket(),
      Delete: { Objects: keys.map(Key => ({ Key })) },
    }));
  } catch (err) {
    console.error('S3 cleanup failed (orphaned objects may remain):', err.message);
  }
}

module.exports = { uploadToS3, deleteFromS3 };
