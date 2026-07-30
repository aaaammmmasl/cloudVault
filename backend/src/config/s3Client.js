const { S3Client } = require('@aws-sdk/client-s3');

const region = process.env.AWS_REGION;
const bucket = process.env.S3_BUCKET_NAME;

if (!region) {
  throw new Error('AWS_REGION is required');
}

if (!bucket) {
  throw new Error('S3_BUCKET_NAME is required');
}

const s3Client = new S3Client({
  region,
});

module.exports = {
  s3Client,
  bucket,
  prefix: process.env.S3_PREFIX || 'uploads/',
};