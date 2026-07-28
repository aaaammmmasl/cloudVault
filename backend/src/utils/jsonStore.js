const fs = require("fs");
const path = require("path");

function readJSON(filePath) {
  if (!fs.existsSync(filePath)) {
    return { files: [] };
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  if (!raw.trim()) return { files: [] };

  return JSON.parse(raw);
}

function writeJSON(filePath, data) {
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tempPath, filePath);
}

module.exports = { readJSON, writeJSON };
