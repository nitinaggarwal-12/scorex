#!/bin/bash
# Quick script to update Lakebase token

set -e

echo "🔐 Lakebase Token Update"
echo "======================="
echo ""
echo "You need an OAuth token for: nitin.aggarwal@databricks.com"
echo ""
echo "Get it from:"
echo "  https://e2-demo-field-eng.cloud.databricks.com/"
echo "  → Compute → SQL Warehouses → Connection details"
echo "  → Click 'Get OAuth Token'"
echo ""
read -p "Paste your OAuth token here: " TOKEN
echo ""

if [ -z "$TOKEN" ]; then
    echo "❌ No token provided"
    exit 1
fi

echo "✅ Token received"
echo ""
echo "Updating app.yaml..."

# Update app.yaml with the token
sed -i.bak "s|value: # REPLACE_WITH_YOUR_TOKEN|value: $TOKEN|" app.yaml

echo "✅ app.yaml updated"
echo ""
echo "Deploying to Databricks Apps..."

databricks sync . /Workspace/Users/nitin.aggarwal@databricks.com/tma
databricks apps deploy tma

echo ""
echo "✅ Deployed! Your app is now connected to Lakebase."
echo ""
echo "🌐 https://tma-1444828305810485.aws.databricksapps.com"
echo ""
echo "⏰ Note: OAuth tokens expire after 1 hour. Run this script again to refresh."


