const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { readJSON, writeJSON } = require("../utils/jsonStore");

const DATA_FILE = path.join(__dirname, "..", "data", "files.json");

function getAllFiles() {
  const data = readJSON(DATA_FILE);
  return data.files || [];
}

function saveAllFiles(files) {
  writeJSON(DATA_FILE, { files });
}

function addFile(fileData) {
  const files = getAllFiles();

  const newFile = {
    id: uuidv4(),
    originalName: fileData.originalName,
    storedName: fileData.storedName,
    s3Key: fileData.s3Key,
    size: fileData.size || 0,
    mimeType: fileData.mimeType || "application/octet-stream",
    uploadedAt: new Date().toISOString(),
  };

  files.push(newFile);
  saveAllFiles(files);
  return newFile;
}

function getFileById(id) {
  const files = getAllFiles();
  return files.find((file) => file.id === id);
}

function deleteFileById(id) {
  const files = getAllFiles();
  const index = files.findIndex((file) => file.id === id);

  if (index === -1) return null;

  const removed = files.splice(index, 1)[0];
  saveAllFiles(files);
  return removed;
}

function renameFileById(id, newName) {
  const files = getAllFiles();
  const file = files.find((item) => item.id === id);

  if (!file) return null;

  file.originalName = newName;
  file.updatedAt = new Date().toISOString();

  saveAllFiles(files);
  return file;
}

function searchFiles(query) {
  const files = getAllFiles();
  const q = query.toLowerCase();

  return files.filter(
    (file) =>
      file.originalName.toLowerCase().includes(q) ||
      file.storedName.toLowerCase().includes(q),
  );
}

module.exports = {
  getAllFiles,
  addFile,
  getFileById,
  deleteFileById,
  renameFileById,
  searchFiles,
};
