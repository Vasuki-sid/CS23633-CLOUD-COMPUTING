const express = require('express');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER || 'myunimate-files';

let blobServiceClient;

if (ACCOUNT_NAME && ACCOUNT_KEY) {
  const connectionString = `DefaultEndpointsProtocol=https;AccountName=${ACCOUNT_NAME};AccountKey=${ACCOUNT_KEY};EndpointSuffix=core.windows.net`;
  blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
}

// Upload file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    if (!blobServiceClient) {
      return res.status(500).json({ error: 'Storage service not configured' });
    }

    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    const blobClient = containerClient.getBlockBlobClient(req.file.originalname);

    await blobClient.uploadData(req.file.buffer);

    res.json({ 
      success: true, 
      fileName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
});

// List files
router.get('/files', async (req, res) => {
  try {
    if (!blobServiceClient) {
      return res.json({ files: [] });
    }

    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    const files = [];

    for await (const blob of containerClient.listBlobsFlat()) {
      files.push({
        name: blob.name,
        size: blob.properties.contentLength,
        createdAt: blob.properties.createdOn
      });
    }

    res.json({ files });
  } catch (error) {
    console.error('List error:', error);
    res.status(500).json({ error: 'Failed to list files', details: error.message });
  }
});

// Storage summary
router.get('/summary', async (req, res) => {
  try {
    if (!blobServiceClient) {
      return res.json({ totalFiles: 0, totalSize: 0 });
    }

    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    let totalFiles = 0;
    let totalSize = 0;

    for await (const blob of containerClient.listBlobsFlat()) {
      totalFiles += 1;
      totalSize += blob.properties.contentLength || 0;
    }

    res.json({ totalFiles, totalSize });
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ error: 'Failed to summarize storage', details: error.message });
  }
});

// Delete file
router.delete('/files/:fileName', async (req, res) => {
  try {
    if (!blobServiceClient) {
      return res.status(500).json({ error: 'Storage service not configured' });
    }

    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    const blobClient = containerClient.getBlockBlobClient(req.params.fileName);

    await blobClient.delete();

    res.json({ success: true, message: 'File deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Delete failed', details: error.message });
  }
});

// Download file (returns URL)
router.get('/download/:fileName', (req, res) => {
  try {
    if (!blobServiceClient) {
      return res.status(500).json({ error: 'Storage service not configured' });
    }

    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    const blobClient = containerClient.getBlockBlobClient(req.params.fileName);
    const downloadUrl = blobClient.url;

    res.json({ downloadUrl });
  } catch (error) {
    res.status(500).json({ error: 'Download failed', details: error.message });
  }
});

module.exports = router;