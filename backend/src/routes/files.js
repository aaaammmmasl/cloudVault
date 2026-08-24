const express = require("express");
const multer = require("multer");
const fileService = require("../services/fileService");

const router = express.Router();
const upload = multer({
  limits: {
    fileSize: 20 * 1024 * 1024, //20mb
  },
});

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file provided" });
  }

  const file = await fileService.createFileRecord({ file: req.file });
  return res.status(201).json(file);
});

router.get("/", async (_req, res) => {
  const files = await fileService.listFiles();
  return res.json(files);
});

router.get("/search", async (req, res) => {
  const files = await fileService.searchFiles(req.query.q);
  return res.json(files);
});

router.get("/:id", async (req, res) => {
  const file = await fileService.getFileById(req.params.id);

  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  return res.json(file);
});

const { getObjectStream } = require("../services/s3Service");

router.get("/:id/download", async (req, res) => {
  const file = await fileService.getFileById(req.params.id);

  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  const bodyStream = await getObjectStream(file.s3Key);

  res.setHeader("Content-Type", file.mimeType);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${encodeURIComponent(file.originalName)}"`,
  );

  bodyStream.pipe(res);
});

router.delete("/:id", async (req, res) => {
  const removed = await fileService.removeFile(req.params.id);

  if (!removed) {
    return res.status(404).json({ message: "File not found" });
  }

  return res.json({ message: "File deleted", file: removed });
});

router.patch("/:id/rename", async (req, res) => {
  const { newName } = req.body;

  if (typeof newName !== "string" || newName.trim().length === 0) {
    return res.status(400).json({ message: "newName is required" });
  }

  const updated = await fileService.renameFile(req.params.id, newName.trim());

  if (!updated) {
    return res.status(404).json({ message: "File not found" });
  }

  return res.json(updated);
});

module.exports = router;
