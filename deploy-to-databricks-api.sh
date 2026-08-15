#!/bin/bash

# Databricks Repos Deployment via REST API
# Alternative method using curl

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Databricks Repos Deployment (REST API)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Repository details
REPO_URL="https://github.com/nitinaggarwal-databricks/technical-maturity-assessment"
REPO_NAME="technical-maturity-assessment"

# Prompt for Databricks details if not set
if [ -z "$DATABRICKS_HOST" ]; then
    read -p "Enter Databricks workspace URL (e.g., https://your-workspace.cloud.databricks.com): " DATABRICKS_HOST
fi

if [ -z "$DATABRICKS_TOKEN" ]; then
    read -sp "Enter Databricks personal access token: " DATABRICKS_TOKEN
    echo ""
fi

if [ -z "$DATABRICKS_USER" ]; then
    read -p "Enter your Databricks username/email: " DATABRICKS_USER
fi

# Extract username from email
USER_NAME=$(echo "$DATABRICKS_USER" | cut -d'@' -f1)
REPO_PATH="/Repos/$DATABRICKS_USER/$REPO_NAME"

echo ""
echo "📍 Target path: $REPO_PATH"
echo ""

# Check if repo exists
echo "🔍 Checking if repository exists..."
REPO_CHECK=$(curl -s -w "%{http_code}" -o /dev/null \
    -H "Authorization: Bearer $DATABRICKS_TOKEN" \
    "$DATABRICKS_HOST/api/2.0/repos?path_prefix=$REPO_PATH")

if [ "$REPO_CHECK" == "200" ]; then
    echo "⚠️  Repository already exists"
    echo ""
    read -p "Do you want to update it? (y/n) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔄 Updating repository..."
        
        # Get repo ID
        REPO_ID=$(curl -s \
            -H "Authorization: Bearer $DATABRICKS_TOKEN" \
            "$DATABRICKS_HOST/api/2.0/repos?path_prefix=$REPO_PATH" | \
            jq -r '.repos[0].id')
        
        # Update repo
        curl -s -X PATCH \
            -H "Authorization: Bearer $DATABRICKS_TOKEN" \
            -H "Content-Type: application/json" \
            -d "{\"branch\": \"main\"}" \
            "$DATABRICKS_HOST/api/2.0/repos/$REPO_ID" > /dev/null
        
        echo "✅ Repository updated!"
    else
        echo "❌ Deployment cancelled"
        exit 0
    fi
else
    echo "📥 Creating new repository..."
    
    RESPONSE=$(curl -s -X POST \
        -H "Authorization: Bearer $DATABRICKS_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"url\": \"$REPO_URL\",
            \"provider\": \"gitHub\",
            \"path\": \"$REPO_PATH\"
        }" \
        "$DATABRICKS_HOST/api/2.0/repos")
    
    if echo "$RESPONSE" | jq -e '.id' > /dev/null 2>&1; then
        echo "✅ Repository created successfully!"
        REPO_ID=$(echo "$RESPONSE" | jq -r '.id')
        echo "📝 Repository ID: $REPO_ID"
    else
        echo "❌ Failed to create repository"
        echo "Error: $RESPONSE"
        exit 1
    fi
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
echo "   $DATABRICKS_HOST/#workspace$REPO_PATH"
echo ""
echo "📝 Repository Details:"
echo "   • URL: $REPO_URL"
echo "   • Branch: main"
echo "   • Provider: GitHub"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"


