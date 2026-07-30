const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
} = require("@aws-sdk/client-s3");

const { s3Client, bucket, prefix } = require("../config/s3Client");

function buildS3Key(storedName) {
  return `${prefix}${storedName}`;
}

async function uploadBuffer({ storedName, buffer, mimeType }) {
  const key = buildS3Key(storedName);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    }),
  );

  return { key };
}

async function getObjectStream(s3Key) {
  const result = await s3Client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: s3Key,
    }),
  );

  return result.Body;
}

async function deleteObject(s3Key) {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: s3Key,
    }),
  );
}

async function renameObject({ oldKey, newKey }) {
  await s3Client.send(
    new CopyObjectCommand({
      Bucket: bucket,
      CopySource: `${bucket}/${encodeURIComponent(oldKey)}`,
      Key: newKey,
    }),
  );

  await deleteObject(oldKey);
}

module.exports = {
  buildS3Key,
  uploadBuffer,
  getObjectStream,
  deleteObject,
  renameObject,
};
