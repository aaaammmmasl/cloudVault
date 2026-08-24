const fs = require("fs/promises");
const path = require("path");

const dataFile =
  process.env.DATA_FILE || path.join(__dirname, "../data/files.json");

async function readStore() {
  try {
    const raw = await fs.readFile(dataFile, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") {
      return { files: [] };
    }

    throw error;
  }
}

async function writeStore(data) {
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), "utf-8");
}

module.exports = {
  readStore,
  writeStore,
};
