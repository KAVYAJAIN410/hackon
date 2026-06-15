const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { randomUUID } = require('crypto');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadToS3(buffer, mimeType, folder = 'returns') {
  const bucket = process.env.S3_BUCKET_NAME || process.env.S3_BUCKET;
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

module.exports = { uploadToS3 };
