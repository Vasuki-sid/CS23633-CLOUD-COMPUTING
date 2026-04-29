# MyUniMate Deployment Guide

## Azure Deployment Steps

### Step 1: Set Up Azure Resources

#### 1.1 Create Resource Group
```bash
az group create --name myunimate-rg --location eastus
```

#### 1.2 Create App Service Plan
```bash
az appservice plan create \
  --name myunimate-plan \
  --resource-group myunimate-rg \
  --sku B1 \
  --is-linux
```

#### 1.3 Create Web App
```bash
az webapp create \
  --resource-group myunimate-rg \
  --plan myunimate-plan \
  --name myunimate-app \
  --runtime "node|18-lts"
```

### Step 2: Set Up Azure Translator

1. Go to Azure Portal → Create Resource → Translator
2. Fill in the form:
   - Resource Group: `myunimate-rg`
   - Region: `East US`
   - Name: `myunimate-translator`
   - Pricing Tier: `Free (2M chars/month)` or `Standard`
3. Go to Keys and Endpoint and copy:
   - Key 1
   - Endpoint

### Step 3: Set Up Azure Blob Storage

1. Go to Azure Portal → Storage Accounts → Create
2. Fill in the form:
   - Resource Group: `myunimate-rg`
   - Storage Account Name: `myunimatestorage` (must be unique)
   - Region: `East US`
   - Performance: `Standard`
   - Redundancy: `LRS`
3. Create container:
   - Name: `myunimate-files`
   - Public Access: `Private`
4. Go to Access Keys and copy:
   - Storage account name
   - Key 1

### Step 4: Configure App Settings

1. Go to App Service in Portal
2. Navigate to Configuration → Application Settings
3. Add the following:

```
AZURE_TRANSLATOR_KEY = <your_translator_key>
AZURE_TRANSLATOR_ENDPOINT = https://api.cognitive.microsofttranslator.com
AZURE_TRANSLATOR_REGION = eastus
AZURE_STORAGE_ACCOUNT_NAME = <your_storage_account_name>
AZURE_STORAGE_ACCOUNT_KEY = <your_storage_key>
AZURE_STORAGE_CONTAINER = myunimate-files
NODE_ENV = production
PORT = 80
```

4. Click Save

### Step 5: Deploy from GitHub

#### Option A: Using GitHub Actions (Recommended)

1. Go to App Service → Deployment Center
2. Select GitHub as source
3. Authorize and select your repository
4. Select branch (main)
5. Click Save

GitHub Actions workflow will be automatically created.

#### Option B: Local Deployment

```bash
# Install Azure CLI
npm install -g azure-cli

# Login
az login

# Deploy
az webapp up \
  --resource-group myunimate-rg \
  --name myunimate-app \
  --plan myunimate-plan
```

### Step 6: Verify Deployment

1. Navigate to: `https://myunimate-app.azurewebsites.net`
2. Test each feature:
   - Dashboard loads
   - Calculator works
   - To-Do list functions
   - Settings accessible

## Local Development

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your Azure keys

# Start server
npm start
# Visit http://localhost:3000
```

## Cost Estimation (Monthly)

- **App Service (B1)**: ~$15
- **Translator API (Free)**: Free (2M chars/month)
- **Blob Storage**: ~$0.50-2.00 (depends on usage)

**Total**: ~$15-17/month

## Monitoring

1. Go to App Service → Insights
2. Monitor metrics:
   - CPU Percentage
   - Memory Percentage
   - HTTP Server Errors
   - Response Time

## Troubleshooting

### 503 Service Unavailable
- Check Application Insights logs
- Verify all Azure credentials in App Settings

### Translation API 403
- Verify Translator API key is correct
- Check subscription status

### File Upload Fails
- Verify storage account name
- Check storage account key
- Ensure container exists

### High Response Times
- Scale up App Service (B2 or higher)
- Check database queries if used
- Enable Application Insights

## Next Steps

1. **Domain Setup**: Configure custom domain in App Service
2. **SSL/TLS**: Enable HTTPS (automatic with custom domain)
3. **Backup**: Set up automated backups
4. **Monitoring**: Configure alerts for errors
5. **Database**: Integrate Azure Cosmos DB for persistent data

## Support

For issues:
1. Check Application Insights
2. Review Azure resource status
3. Check logs in App Service
