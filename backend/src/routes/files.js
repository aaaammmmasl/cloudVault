const express = require("express");
const multer = require("multer");
const {
  getAllFiles,
  addFile,
  getFileById,
  deleteFileById,
  renameFileById,
  searchFiles
} = require("../services/fileService");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", (req, res) => {
  const files = getAllFiles();
  res.json({ files });
});

router.get("/search", (req, res) => {
  const q = (req.query.q || "").trim();

  if (!q) {
    return res.status(400).json({ message: "Query parameter q is required" });
  }

  const results = searchFiles(q);
  res.json({ files: results });
});

router.get("/:id", (req, res) => {
  const file = getFileById(req.params.id);

  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  res.json({ file });
});

router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const storedName = `${Date.now()}-${req.file.originalname}`;

  const newFile = addFile({
    originalName: req.file.originalname,
    storedName,
    s3Key: `uploads/${storedName}`,
    size: req.file.size,
    mimeType: req.file.mimetype
  });

  res.status(201).json({
    message: "File metadata saved successfully",
    file: newFile
  });
});

router.delete("/:id", (req, res) => {
  const removed = deleteFileById(req.params.id);

  if (!removed) {
    return res.status(404).json({ message: "File not found" });
  }

  res.json({ message: "File deleted", file: removed });
});

router.patch("/:id/rename", express.json(), (req, res) => {
  const { newName } = req.body;

  if (!newName || !newName.trim()) {
    return res.status(400).json({ message: "newName is required" });
  }

  const updated = renameFileById(req.params.id, newName.trim());

  if (!updated) {
    return res.status(404).json({ message: "File not found" });
  }

  res.json({ message: "File renamed", file: updated });
});

module.exports = router;