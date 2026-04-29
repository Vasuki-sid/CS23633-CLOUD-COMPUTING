# MyUniMate - Cloud-Powered Student Productivity Toolbox

A modern, unified dashboard that combines essential academic and productivity tools into one seamless platform for students.

## 🎯 Features

### Core Tools
1. **Dashboard** - Welcome screen with quick access to all tools
2. **Translator** - Multi-language text translation (Azure Translator API)
3. **Calculator** - Basic and scientific arithmetic operations
4. **Cloud Storage** - File upload/download/delete (Azure Blob Storage)
5. **To-Do List** - Task management with local storage
6. **Notes** - Create and auto-save notes
7. **Unit Converter** - Length, weight, temperature, volume conversions
8. **Pomodoro Timer** - 25-minute focus timer with customization
9. **Word Counter** - Real-time text statistics
10. **PDF Extractor** - Extract text from PDF files
11. **Settings** - Dark mode, data management, preferences

## 🛠 Tech Stack

### Frontend
- HTML5, CSS3, Vanilla JavaScript
- Modern minimal dashboard UI
- Responsive design (desktop & mobile)
- Local storage for data persistence

### Backend
- Node.js with Express.js
- REST API architecture
- Modular route structure

### Cloud Services (Azure)
- **Azure Translator API** - Language translation
- **Azure Blob Storage** - File storage and management
- **Azure App Service** - Deployment

### Libraries
- `express` - Web framework
- `multer` - File upload handling
- `pdf-parse` - PDF text extraction
- `@azure/storage-blob` - Azure storage integration
- `axios` - HTTP requests
- `dotenv` - Environment configuration

## 📁 Project Structure

```
MyUniMate/
├── server.js              # Express server configuration
├── package.json           # Dependencies
├── .env.example           # Environment template
├── routes/
│   ├── translator.js      # Translation API
│   ├── calculator.js      # Calculator API
│   ├── storage.js         # Cloud storage API
│   ├── pdf.js             # PDF extraction API
│   └── tools.js           # Tools metadata API
└── public/
    ├── index.html         # Main HTML with templates
    ├── styles.css         # Complete styling
    └── app.js             # Application logic
```

## 🚀 Getting Started

### Prerequisites
- Node.js v14 or higher
- npm or yarn
- Azure account (for cloud services)

### Installation

1. Clone the repository:
```bash
cd MyUniMate
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Azure credentials
```

4. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

5. Open your browser:
```
http://localhost:3000
```

## 🔧 Configuration

### Azure Translator
1. Create an Azure Translator resource
2. Get your API key and endpoint
3. Add to `.env`:
```
AZURE_TRANSLATOR_KEY=your_key
AZURE_TRANSLATOR_ENDPOINT=your_endpoint
```

### Azure Blob Storage
1. Create a storage account
2. Create a container named `myunimate-files`
3. Add to `.env`:
```
AZURE_STORAGE_ACCOUNT_NAME=your_account
AZURE_STORAGE_ACCOUNT_KEY=your_key
AZURE_STORAGE_CONTAINER=myunimate-files
```

## 💡 Usage

### Dashboard
Navigate between tools using the sidebar. Each tool loads independently with a clean, minimal interface.

### Local Storage Tools
- **To-Do List** - Stored in browser localStorage
- **Notes** - Auto-saved to localStorage every 5 seconds
- **Settings** - Dark mode preference saved locally

### Cloud Integration
- **Translator** - Real-time translation with language selection
- **Storage** - Upload/download files directly from Azure
- **PDF Extractor** - Extract text from PDFs on the backend

## 🎨 Design Features

- Modern minimal dashboard aesthetic
- Soft shadows and rounded corners
- Responsive grid layouts
- Dark mode support
- Smooth animations and transitions
- Intuitive sidebar navigation
- Mobile-friendly responsive design

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔒 Security Notes

- Never commit `.env` files with real credentials
- Store sensitive data server-side only
- Validate all user inputs
- Use HTTPS in production

## 📦 Deployment

### Azure App Service

1. Create an App Service instance
2. Connect your GitHub repository
3. Set environment variables in App Settings
4. Deploy through GitHub Actions

### Environment Setup
```bash
# In Azure Portal App Settings, add:
AZURE_TRANSLATOR_KEY
AZURE_TRANSLATOR_ENDPOINT
AZURE_STORAGE_ACCOUNT_NAME
AZURE_STORAGE_ACCOUNT_KEY
AZURE_STORAGE_CONTAINER
PORT=80
NODE_ENV=production
```

## 🐛 Troubleshooting

### PDF extraction not working
- Ensure `pdf-parse` is installed: `npm install pdf-parse`
- Check file size limits in server

### Translation API errors
- Verify Azure Translator key and endpoint
- Check API quota and pricing tier

### File upload failures
- Confirm storage account credentials
- Check container permissions
- Verify file size limits

## 📝 Future Enhancements

- Database integration (Cosmos DB) for persistent notes
- User authentication and accounts
- Collaborative note sharing
- Advanced PDF features (annotation, merging)
- Integration with Google Drive/OneDrive
- Mobile app version
- Voice input for translation

## 📄 License

This project is part of the CS23633 Cloud Computing course at Rajalakshmi Engineering College.

## 👤 Author

**Siddarth Vasuki** - Student ID: 230701314

---

**MyUniMate** - Making student productivity simple and unified. 🎓
