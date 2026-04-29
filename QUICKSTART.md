# MyUniMate - Quick Start Guide

## 🚀 5-Minute Quick Start

### Prerequisites
- Node.js v14+ installed
- npm installed

### Installation (1 minute)

```bash
# Navigate to project
cd MyUniMate

# Install dependencies
npm install

# Start server
npm start
```

### First Run (Instant)

Open your browser and visit:
```
http://localhost:3000
```

That's it! MyUniMate is now running.

## 📋 What You Get

11 fully functional productivity tools:

| Tool | Status | Feature |
|------|--------|---------|
| 📊 Dashboard | ✅ Live | All tools at a glance |
| 🌐 Translator | ✅ Live | 13+ language translation |
| 🧮 Calculator | ✅ Live | Basic arithmetic |
| ☁️ Storage | ✅ Ready | File upload/download |
| ✓ To-Do | ✅ Live | Task management |
| 📝 Notes | ✅ Live | Auto-save notes |
| 📏 Converter | ✅ Live | Unit conversions |
| ⏱️ Pomodoro | ✅ Live | Focus timer |
| 📄 Counter | ✅ Live | Text statistics |
| 📕 PDF | ✅ Ready | Extract PDF text |
| ⚙️ Settings | ✅ Live | Dark mode + more |

## 🎯 Try These Features Now

### 1. Calculator (30 seconds)
- Click "Calculator" in sidebar
- Click: 5 + 3 = 
- Result: 8 ✅

### 2. To-Do List (30 seconds)
- Click "To-Do List" in sidebar
- Type: "Study for exam"
- Click "Add Task"
- Check the box to complete ✅

### 3. Word Counter (30 seconds)
- Click "Word Counter" in sidebar
- Paste any text
- Watch real-time stats update ✅

### 4. Unit Converter (30 seconds)
- Click "Unit Converter" in sidebar
- Enter: 5
- Select units and watch instant conversion ✅

### 5. Dark Mode (15 seconds)
- Click theme toggle (🌙) top-left
- Watch the interface transform ✅

## 🔧 Configure Azure Services (Optional)

For cloud features (Translator, Storage), you need Azure credentials:

### Step 1: Get Keys
1. Create Azure Translator resource → Get API key
2. Create Azure Storage account → Get access key

### Step 2: Configure
```bash
# Create .env file
cp .env.example .env

# Edit .env with your keys:
AZURE_TRANSLATOR_KEY=your_key
AZURE_TRANSLATOR_ENDPOINT=your_endpoint
AZURE_STORAGE_ACCOUNT_NAME=your_account
AZURE_STORAGE_ACCOUNT_KEY=your_key
```

### Step 3: Restart
```bash
npm start
```

Now cloud features are enabled!

## 🌐 Deploy to Azure (5 minutes)

```bash
# Login to Azure
az login

# Deploy
az webapp up --name myunimate-app --resource-group myunimate-rg

# View at:
# https://myunimate-app.azurewebsites.net
```

See `DEPLOYMENT.md` for detailed instructions.

## 📁 Project Structure

```
MyUniMate/
├── server.js          ← Node.js server
├── package.json       ← Dependencies
├── .env.example       ← Config template
├── public/
│   ├── index.html     ← Main interface
│   ├── app.js         ← Logic
│   └── styles.css     ← Styling
└── routes/
    ├── calculator.js
    ├── translator.js
    ├── storage.js
    ├── pdf.js
    └── tools.js
```

## 🆘 Troubleshooting

### "Port 3000 already in use"
```bash
# Use different port
PORT=3001 npm start

# Visit http://localhost:3001
```

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
npm start
```

### Translator not working
- Check `.env` has Azure keys
- Verify key format is correct
- Restart server after config changes

### Files won't upload
- Verify Azure Storage credentials
- Check container name in `.env`
- Ensure storage account allows uploads

## 💡 Tips & Tricks

✨ **Keyboard Shortcuts**
- Enter in To-Do input = Add task
- Any tool with Enter = Submit

✨ **Data Persistence**
- To-Do, Notes, Settings save to browser
- Uses localStorage (no server needed)
- Clear in Settings → Clear All Data

✨ **Performance**
- Tool switching is instant (no page reload)
- Local tools are instant
- Cloud tools are ~500-800ms

✨ **Mobile**
- Full responsive design
- Sidebar collapses on small screens
- Touch-friendly buttons

## 📚 Learn More

- `README.md` - Complete documentation
- `DEPLOYMENT.md` - Azure deployment guide
- `IMPLEMENTATION_SUMMARY.md` - Technical details

## 🎓 Course Info

**Course**: CS23633 Cloud Computing  
**Project**: MyUniMate Student Productivity Platform  
**Status**: Complete & Production Ready

## ✅ Checklist

- [ ] Installation complete
- [ ] Server running on localhost:3000
- [ ] Dashboard loads
- [ ] Calculator working
- [ ] To-Do list working
- [ ] Dark mode toggle working
- [ ] All 11 tools accessible

## 🚀 Next Steps

1. **Explore Tools** - Try each feature
2. **Configure Azure** - Enable cloud services
3. **Deploy** - Host on Azure App Service
4. **Customize** - Add your own tools
5. **Share** - Show it off!

---

**Questions?** Check the documentation files or the README.

**Ready to deploy?** See DEPLOYMENT.md for step-by-step Azure setup.

Happy studying! 🎓
