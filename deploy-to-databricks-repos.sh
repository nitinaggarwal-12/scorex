#!/bin/bash

# Databricks Repos Deployment Script
# This script helps deploy the Technical Maturity Assessment to Databricks Repos

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Databricks Repos Deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Repository details
REPO_URL="https://github.com/nitinaggarwal-databricks/technical-maturity-assessment"
REPO_NAME="technical-maturity-assessment"

echo "📦 Repository: $REPO_URL"
echo ""

# Check if Databricks CLI is installed
if ! command -v databricks &> /dev/null; then
    echo "❌ Databricks CLI not found!"
    echo ""
    echo "📥 Installing Databricks CLI..."
    pip install databricks-cli
    echo "✅ Databricks CLI installed"
    echo ""
fi

# Check if configured
if [ ! -f ~/.databrickscfg ]; then
    echo "⚙️  Databricks CLI not configured"
    echo ""
    echo "Please enter your Databricks workspace details:"
    echo ""
    databricks configure --token
    echo ""
    echo "✅ Configuration complete"
    echo ""
fi

# Get current user
CURRENT_USER=$(databricks workspace ls /Users 2>/dev/null | head -1 | awk '{print $1}' | sed 's/\///')
if [ -z "$CURRENT_USER" ]; then
    echo "❌ Could not determine current user. Please check your Databricks configuration."
    exit 1
fi

REPO_PATH="/Repos/$CURRENT_USER/$REPO_NAME"

echo "📍 Target path: $REPO_PATH"
echo ""

# Check if repo already exists
if databricks repos get --path "$REPO_PATH" &> /dev/null; then
    echo "⚠️  Repository already exists at $REPO_PATH"
    echo ""
    read -p "Do you want to update it? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔄 Pulling latest changes..."
        databricks repos update --path "$REPO_PATH" --branch main
        echo "✅ Repository updated!"
    else
        echo "❌ Deployment cancelled"
        exit 0
    fi
else
    echo "📥 Creating new repository..."
    databricks repos create \
        --url "$REPO_URL" \
        --provider gitHub \
        --path "$REPO_PATH"
    echo "✅ Repository created!"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DEPLOYMENT COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📂 Repository Location:"
echo "   $REPO_PATH"
echo ""
echo "🌐 Access in Databricks:"
echo "   1. Open your Databricks workspace"
echo "   2. Click 'Repos' in the left sidebar"
echo "   3. Navigate to: $REPO_PATH"
echo ""
echo "📝 Next Steps:"
echo "   1. Review the README.md in the repo"
echo "   2. Set up environment variables in Databricks"
echo "   3. Configure PostgreSQL connection"
echo "   4. Run database migrations"
echo "   5. Deploy the application"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"


