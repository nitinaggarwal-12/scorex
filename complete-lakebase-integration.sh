#!/bin/bash

# Complete Lakebase Integration Script
# This script stores the Lakebase connection string and deploys the app

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔗 Completing Lakebase Integration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Lakebase connection details
HOST="instance-ee2a221d-960d-4811-b669-190fcf608365.database.cloud.databricks.com"
USER="nitin.aggarwal@databricks.com"
DATABASE="databricks_postgres"
PORT="5432"
SSLMODE="require"

echo "📋 Lakebase Instance Details:"
echo "   Host: $HOST"
echo "   User: $USER"
echo "   Database: $DATABASE"
echo "   Port: $PORT"
echo "   SSL Mode: $SSLMODE"
echo ""

# Get OAuth token
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 Step 1: Get OAuth Token"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "In the Databricks UI (Connection details tab):"
echo "1. Click 'Get OAuth Token' button"
echo "2. Copy the token (valid for 1 hour)"
echo ""
read -sp "Paste the OAuth token here: " OAUTH_TOKEN
echo ""
echo ""

if [ -z "$OAUTH_TOKEN" ]; then
    echo "❌ No token provided. Exiting."
    exit 1
fi

echo "✅ Token received"
echo ""

# Build connection string
CONNECTION_STRING="postgresql://${USER}:${OAUTH_TOKEN}@${HOST}:${PORT}/${DATABASE}?sslmode=${SSLMODE}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 Step 2: Store Connection String as Secret"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Store as secret
echo "Storing connection string in Databricks secrets..."
echo "$CONNECTION_STRING" | databricks secrets put-secret \
  --scope maturity-assessment \
  --key LAKEBASE_DATABASE_URL

if [ $? -eq 0 ]; then
    echo "✅ Connection string stored as secret"
else
    echo "❌ Failed to store secret"
    exit 1
fi

echo ""

# Store session secret
echo "Storing session secret..."
SESSION_SECRET=$(openssl rand -base64 32)
echo "$SESSION_SECRET" | databricks secrets put-secret \
  --scope maturity-assessment \
  --key SESSION_SECRET

if [ $? -eq 0 ]; then
    echo "✅ Session secret stored"
else
    echo "⚠️  Failed to store session secret (may already exist)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 Step 3: Update app.yaml"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Update app.yaml
cat > app.yaml << 'EOF'
command:
  - "sh"
  - "-c"
  - "npm install && cd client && npm install && npm run build && cd .. && npm start"

env:
  - name: NODE_ENV
    value: production
  - name: PORT
    value: "8080"
  - name: DATABASE_URL
    value: "{{secrets/maturity-assessment/LAKEBASE_DATABASE_URL}}"
  - name: SESSION_SECRET
    value: "{{secrets/maturity-assessment/SESSION_SECRET}}"
EOF

echo "✅ app.yaml updated with Lakebase configuration"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📤 Step 4: Sync to Databricks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

databricks sync . /Workspace/Users/nitin.aggarwal@databricks.com/tma

if [ $? -eq 0 ]; then
    echo "✅ Files synced to Databricks"
else
    echo "❌ Failed to sync files"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Step 5: Deploy App"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

databricks apps deploy tma

if [ $? -eq 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ LAKEBASE INTEGRATION COMPLETE!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🎉 Your app is now using Lakebase PostgreSQL!"
    echo ""
    echo "🔗 App URL: https://tma-144482830581048s.aws.databricksapps.com"
    echo ""
    echo "📊 The app will automatically:"
    echo "   ✅ Connect to Lakebase"
    echo "   ✅ Run database migrations"
    echo "   ✅ Initialize schema"
    echo "   ✅ Start serving requests"
    echo ""
    echo "💡 Check logs:"
    echo "   databricks apps logs tma"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
    echo "❌ Deployment failed"
    exit 1
fi


