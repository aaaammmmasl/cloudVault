const express = require('express');
const multer = require('multer');
const { Readable } = require('stream');
const fileService = require('../services/fileService');

const router = express.Router();
const upload = multer();

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const file = await fileService.createFileRecord({ file: req.file });
    return res.status(201).json(file);
  } catch (error) {
    return res.status(500).json({
      message: 'Upload failed',
      error: error.message,
    });
  }
});


router.get('/', async (_req, res) => {
  try {
    const files = await fileService.listFiles();
    return res.json(files);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to list files' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const file = await fileService.getFileById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    return res.json(file);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to get file info' });
  }
});

const { getObjectStream } = require('../services/s3Service');

router.get('/:id/download', async (req, res) => {
  try {
    const file = await fileService.getFileById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const bodyStream = await getObjectStream(file.s3Key);

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(file.originalName)}"`
    );

    bodyStream.pipe(res);
  } catch (error) {
    return res.status(500).json({
      message: 'Download failed',
      error: error.message,
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const removed = await fileService.removeFile(req.params.id);

    if (!removed) {
      return res.status(404).json({ message: 'File not found' });
    }

    return res.json({ message: 'File deleted', file: removed });
  } catch (error) {
    return res.status(500).json({
      message: 'Delete failed',
      error: error.message,
    });
  }
});

router.patch('/:id/rename', async (req, res) => {
  try {
    const { newName } = req.body;

    if (!newName || typeof newName !== 'string') {
      return res.status(400).json({ message: 'newName is required' });
    }

    const updated = await fileService.renameFile(req.params.id, newName);

    if (!updated) {
      return res.status(404).json({ message: 'File not found' });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({
      message: 'Rename failed',
      error: error.message,
    });
  }
});

module.exports = router;