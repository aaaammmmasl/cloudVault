const { v4: uuidv4 } = require('uuid');
const {
  uploadBuffer,
  deleteObject,
  renameObject,
  buildS3Key,
} = require('./s3Service');
const { readStore, writeStore } = require('../utils/jsonStore');

function makeStoredName(id, originalName) {
  return `${id}-${originalName}`;
}

async function listFiles() {
  const store = await readStore();
  return store.files;
}

async function getFileById(id) {
  const store = await readStore();
  return store.files.find((file) => file.id === id) || null;
}

async function createFileRecord({ file }) {
  const id = uuidv4().slice(0, 6);
  const storedName = makeStoredName(id, file.originalname);
  const s3Key = buildS3Key(storedName);

  await uploadBuffer({
    storedName,
    buffer: file.buffer,
    mimeType: file.mimetype,
  });

  const newFile = {
    id,
    originalName: file.originalname,
    storedName,
    s3Key,
    size: file.size,
    mimeType: file.mimetype,
    uploadedAt: new Date().toISOString(),
  };

  const store = await readStore();
  store.files.push(newFile);
  await writeStore(store);

  return newFile;
}

async function removeFile(id) {
  const store = await readStore();
  const index = store.files.findIndex((file) => file.id === id);

  if (index === -1) return null;

  const file = store.files[index];
  await deleteObject(file.s3Key);

  store.files.splice(index, 1);
  await writeStore(store);

  return file;
}

async function renameFile(id, newOriginalName) {
  const store = await readStore();
  const file = store.files.find((item) => item.id === id);

  if (!file) return null;

  const newStoredName = makeStoredName(id, newOriginalName);
  const newS3Key = buildS3Key(newStoredName);

  await renameObject({
    oldKey: file.s3Key,
    newKey: newS3Key,
  });

  file.originalName = newOriginalName;
  file.storedName = newStoredName;
  file.s3Key = newS3Key;

  await writeStore(store);

  return file;
}

async function searchFiles(query) {
  const store = await readStore();
  const q = (query || '').toLowerCase();

  return store.files.filter((file) => {
    return (
      file.originalName.toLowerCase().includes(q) ||
      file.storedName.toLowerCase().includes(q) ||
      file.mimeType.toLowerCase().includes(q)
    );
  });
}

module.exports = {
  listFiles,
  getFileById,
  createFileRecord,
  removeFile,
  renameFile,
  searchFiles,
};