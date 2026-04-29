# MyUniMate - API Documentation

## 🔌 REST API Reference

Base URL: `http://localhost:3000/api`

---

## 📊 Tools Metadata

### GET `/tools/list`

Get list of all available tools.

**Response:**
```json
{
  "tools": [
    {
      "id": "dashboard",
      "name": "Dashboard",
      "icon": "📊",
      "description": "Welcome & tool overview"
    },
    {
      "id": "translator",
      "name": "Translator",
      "icon": "🌐",
      "description": "Multi-language translation"
    },
    // ... 9 more tools
  ]
}
```

---

## 🧮 Calculator API

### POST `/calculator/calculate`

Evaluate a mathematical expression safely.

**Request:**
```json
{
  "expression": "5+3*2"
}
```

**Response:**
```json
{
  "expression": "5+3*2",
  "result": 11
}
```

**Error Response:**
```json
{
  "error": "Invalid mathematical expression"
}
```

**Supported Operations:**
- Addition: `+`
- Subtraction: `-`
- Multiplication: `*`
- Division: `/`
- Modulo: `%`
- Parentheses: `()`
- Decimals: `.`

---

### GET `/calculator/operations`

Get list of supported operations.

**Response:**
```json
{
  "basic": ["+", "-", "*", "/", "%"],
  "functions": [
    "Math.sqrt()",
    "Math.pow()",
    "Math.abs()",
    "Math.sin()",
    "Math.cos()",
    "Math.tan()"
  ]
}
```

---

## 🌐 Translator API

### POST `/translator/translate`

Translate text to target language.

**Request:**
```json
{
  "text": "Hello world",
  "targetLanguage": "es",
  "sourceLanguage": "auto"
}
```

**Response:**
```json
{
  "translatedText": "Hola mundo",
  "sourceLanguage": "auto",
  "targetLanguage": "es"
}
```

**Error Response:**
```json
{
  "error": "Translation service not configured",
  "details": "Missing AZURE_TRANSLATOR_KEY"
}
```

**Required Environment Variables:**
- `AZURE_TRANSLATOR_KEY`
- `AZURE_TRANSLATOR_ENDPOINT`
- `AZURE_TRANSLATOR_REGION`

**Supported Languages:**
```
en - English
es - Spanish
fr - French
de - German
it - Italian
pt - Portuguese
ru - Russian
ja - Japanese
ko - Korean
zh-Hans - Chinese (Simplified)
ar - Arabic
hi - Hindi
```

---

### GET `/translator/languages`

Get list of supported languages.

**Response:**
```json
{
  "en": "English",
  "es": "Spanish",
  "fr": "French",
  // ... more languages
}
```

---

## ☁️ Cloud Storage API

### POST `/storage/upload`

Upload file to Azure Blob Storage.

**Request:**
```
Content-Type: multipart/form-data

{
  "file": <binary file data>
}
```

**Response:**
```json
{
  "success": true,
  "fileName": "document.pdf",
  "size": 2048576
}
```

**Error Response:**
```json
{
  "error": "Storage service not configured",
  "details": "Missing Azure credentials"
}
```

**Required Environment Variables:**
- `AZURE_STORAGE_ACCOUNT_NAME`
- `AZURE_STORAGE_ACCOUNT_KEY`
- `AZURE_STORAGE_CONTAINER`

---

### GET `/storage/files`

List all uploaded files.

**Response:**
```json
{
  "files": [
    {
      "name": "document.pdf",
      "size": 2048576,
      "createdAt": "2026-04-25T18:00:00.000Z"
    },
    {
      "name": "image.jpg",
      "size": 1024000,
      "createdAt": "2026-04-25T17:30:00.000Z"
    }
  ]
}
```

**Error Response:**
```json
{
  "error": "Failed to list files",
  "details": "Connection timeout"
}
```

---

### GET `/storage/download/:fileName`

Get download URL for a file.

**Parameters:**
- `fileName` (string) - Name of file to download

**Response:**
```json
{
  "downloadUrl": "https://storage.blob.core.windows.net/myunimate-files/document.pdf?sv=2021..."
}
```

**Error Response:**
```json
{
  "error": "Download failed",
  "details": "File not found"
}
```

---

### DELETE `/storage/files/:fileName`

Delete a file from storage.

**Parameters:**
- `fileName` (string) - Name of file to delete

**Response:**
```json
{
  "success": true,
  "message": "File deleted"
}
```

**Error Response:**
```json
{
  "error": "Delete failed",
  "details": "Access denied"
}
```

---

## 📕 PDF Extraction API

### POST `/pdf/extract`

Extract text from PDF file.

**Request:**
```
Content-Type: multipart/form-data

{
  "pdf": <binary PDF data>
}
```

**Response:**
```json
{
  "pages": 5,
  "text": "Extracted text content from all pages...",
  "version": "1.10.100"
}
```

**Error Response:**
```json
{
  "error": "PDF extraction failed",
  "details": "Invalid PDF format"
}
```

**Constraints:**
- Maximum file size: Based on server memory
- Supported format: PDF files only
- MIME type: `application/pdf`

---

## 🔒 Error Handling

All endpoints return standard error responses:

```json
{
  "error": "Error title",
  "details": "Detailed error message"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad request (validation error)
- `404` - Not found
- `500` - Server error
- `503` - Service unavailable

---

## 🔑 Environment Configuration

Create `.env` file with:

```bash
# Server
PORT=3000
NODE_ENV=development

# Azure Translator
AZURE_TRANSLATOR_KEY=your_key
AZURE_TRANSLATOR_ENDPOINT=https://api.cognitive.microsofttranslator.com
AZURE_TRANSLATOR_REGION=eastus

# Azure Storage
AZURE_STORAGE_ACCOUNT_NAME=your_account
AZURE_STORAGE_ACCOUNT_KEY=your_key
AZURE_STORAGE_CONTAINER=myunimate-files
```

---

## 📡 CORS Configuration

- **Origin:** All (*)
- **Methods:** GET, POST, DELETE, OPTIONS
- **Headers:** Content-Type, Accept
- **Credentials:** Not required

---

## 🚀 Rate Limiting

No rate limiting currently implemented. For production:

```javascript
// Recommended additions:
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 🔍 Request/Response Examples

### Example 1: Calculator

**Request:**
```bash
curl -X POST http://localhost:3000/api/calculator/calculate \
  -H "Content-Type: application/json" \
  -d '{"expression":"10*5+25"}'
```

**Response:**
```json
{
  "expression": "10*5+25",
  "result": 75
}
```

---

### Example 2: Translation

**Request:**
```bash
curl -X POST http://localhost:3000/api/translator/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Good morning",
    "targetLanguage": "fr",
    "sourceLanguage": "en"
  }'
```

**Response:**
```json
{
  "translatedText": "Bonjour",
  "sourceLanguage": "en",
  "targetLanguage": "fr"
}
```

---

### Example 3: File Upload

**Request:**
```bash
curl -X POST http://localhost:3000/api/storage/upload \
  -F "file=@document.pdf"
```

**Response:**
```json
{
  "success": true,
  "fileName": "document.pdf",
  "size": 2048576
}
```

---

### Example 4: List Files

**Request:**
```bash
curl http://localhost:3000/api/storage/files
```

**Response:**
```json
{
  "files": [
    {
      "name": "document.pdf",
      "size": 2048576,
      "createdAt": "2026-04-25T18:00:00.000Z"
    }
  ]
}
```

---

## 📚 Client-Side Usage

### JavaScript Fetch Examples

**Calculator:**
```javascript
const response = await fetch('/api/calculator/calculate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ expression: '5+3' })
});
const data = await response.json();
console.log(data.result); // 8
```

**Translator:**
```javascript
const response = await fetch('/api/translator/translate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Hello',
    targetLanguage: 'es'
  })
});
const data = await response.json();
console.log(data.translatedText); // "Hola"
```

**File Upload:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/api/storage/upload', {
  method: 'POST',
  body: formData
});
const data = await response.json();
```

---

## 🔧 Troubleshooting

**"Translation service not configured"**
- Verify `AZURE_TRANSLATOR_KEY` in .env
- Check `AZURE_TRANSLATOR_ENDPOINT` format
- Ensure `AZURE_TRANSLATOR_REGION` is set

**"Storage service not configured"**
- Verify storage account credentials
- Check container name matches `.env`
- Ensure storage account has upload permissions

**"File extraction failed"**
- Verify file is valid PDF
- Check file size limits
- Ensure MIME type is correct

---

## 📖 Additional Resources

- [Azure Translator API Docs](https://learn.microsoft.com/en-us/azure/ai-services/translator/)
- [Azure Blob Storage Docs](https://learn.microsoft.com/en-us/azure/storage/blobs/)
- [Express.js Guide](https://expressjs.com/)
- [REST API Best Practices](https://restfulapi.net/)

---

## 🎯 API Versioning

Current API Version: **v1.0.0**

No versioning prefix required (yet). All endpoints use base path `/api`.

Future versions may use: `/api/v2/`

---

## 📝 Changelog

### v1.0.0 (2026-04-25)
- Initial release
- 5 API endpoints
- Azure integration
- Full documentation
