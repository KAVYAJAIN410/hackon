const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'reloop-hackathon-uploads';

/**
 * Upload a file buffer to S3
 * @param {Buffer} buffer - File buffer
 * @param {string} mimeType - MIME type (e.g., 'image/jpeg')
 * @param {string} folder - S3 folder prefix (e.g., 'returns/ret-001')
 * @returns {string} Public URL of the uploaded file
 */
async function uploadToS3(buffer, mimeType, folder) {
  const ext = mimeType.split('/')[1] || 'jpg';
  const key = `${folder}/${uuidv4()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  });

  await s3Client.send(command);

  const region = process.env.AWS_REGION || 'ap-south-1';
  return `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`;
}

module.exports = { uploadToS3 };
