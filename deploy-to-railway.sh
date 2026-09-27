#!/bin/bash

# 🚂 Quick Railway Deployment Script
# This script automates Railway deployment

set -e  # Exit on error

echo "🚂 ============================================="
echo "   DATABRICKS MATURITY ASSESSMENT"
echo "   Railway Deployment Script"
echo "============================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}⚠️  Railway CLI not found. Installing...${NC}"
    npm install -g @railway/cli
    echo -e "${GREEN}✅ Railway CLI installed${NC}"
else
    echo -e "${GREEN}✅ Railway CLI found${NC}"
fi

# Check if logged in
echo ""
echo -e "${BLUE}🔐 Checking Railway authentication...${NC}"
if ! railway whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Railway${NC}"
    echo "Please log in to Railway:"
    railway login
else
    echo -e "${GREEN}✅ Already logged in to Railway${NC}"
fi

# Check if project is linked
echo ""
echo -e "${BLUE}🔗 Checking project linkage...${NC}"
if ! railway status &> /dev/null; then
    echo -e "${YELLOW}⚠️  No Railway project linked${NC}"
    echo "Initializing new Railway project..."
    railway init
else
    echo -e "${GREEN}✅ Project already linked${NC}"
fi

# Set essential environment variables
echo ""
echo -e "${BLUE}⚙️  Setting environment variables...${NC}"
railway variables set NODE_ENV=production 2>/dev/null || echo "NODE_ENV already set"
railway variables set DATA_DIR=/app/data 2>/dev/null || echo "DATA_DIR already set"
railway variables set PORT=5000 2>/dev/null || echo "PORT already set"
echo -e "${GREEN}✅ Environment variables configured${NC}"

# Deploy
echo ""
echo -e "${BLUE}🚀 Deploying to Railway...${NC}"
echo "This may take 3-5 minutes..."
echo ""
railway up

# Get deployment URL
echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo -e "${BLUE}📊 Getting deployment info...${NC}"
railway status

echo ""
echo -e "${GREEN}============================================="
echo "   🎉 DEPLOYMENT SUCCESSFUL!"
echo "=============================================${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Open your app: ${GREEN}railway open${NC}"
echo "2. View logs: ${GREEN}railway logs${NC}"
echo "3. Check status: ${GREEN}railway status${NC}"
echo ""
echo -e "${YELLOW}⚠️  Remember to:${NC}"
echo "- Add PostgreSQL database for production"
echo "- Configure persistent storage (Volume)"
echo "- Set up custom domain if needed"
echo "- Add OPENAI_API_KEY if using AI features"
echo ""
echo "See RAILWAY_DEPLOYMENT_GUIDE.md for details"
echo ""

