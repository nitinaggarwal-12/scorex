#!/bin/bash
# Simple Lakebase Setup for Databricks Apps
# This script will help you get and set your OAuth token

echo "======================================================================"
echo "  Lakebase Token Setup for Databricks Apps"
echo "======================================================================"
echo ""
echo "You need YOUR user OAuth token (not service principal)"
echo "Database user: nitin.aggarwal@databricks.com"
echo ""
echo "HOW TO GET YOUR TOKEN:"
echo "----------------------"
echo "1. Open: https://e2-demo-field-eng.cloud.databricks.com/"
echo ""
echo "2. Go to: Compute → SQL Warehouses"
echo ""
echo "3. Select ANY warehouse → Connection details tab"
echo ""
echo "4. Click 'Get OAuth Token' button"
echo ""
echo "5. Copy the token (starts with eyJ...)"
echo ""
echo "======================================================================"
echo ""
read -p "Paste your OAuth token here: " TOKEN
echo ""

if [ -z "$TOKEN" ]; then
    echo "❌ No token provided"
    exit 1
fi

echo "✅ Token received"
echo ""

# Update app.yaml
echo "Updating app.yaml..."
if grep -q "LAKEBASE_PASSWORD" app.yaml; then
    # Replace existing token
    sed -i.bak "/LAKEBASE_PASSWORD/,/value:/{s|value:.*|value: $TOKEN|;}" app.yaml
else
    # Add LAKEBASE_PASSWORD after LAKEBASE_USER
    sed -i.bak "/LAKEBASE_USER/a\\
  - name: LAKEBASE_PASSWORD\\
    value: $TOKEN" app.yaml
fi

# Also remove service principal creds (not needed)
sed -i.bak '/DATABRICKS_CLIENT_ID/,+2d' app.yaml

echo "✅ app.yaml updated"
echo ""
echo "Deploying to Databricks Apps..."
databricks sync . /Workspace/Users/nitin.aggarwal@databricks.com/tma
databricks apps deploy tma

echo ""
echo "======================================================================"
echo "  ✅ DEPLOYED!"
echo "======================================================================"
echo ""
echo "🌐 https://tma-1444828305810485.aws.databricksapps.com"
echo ""
echo "⏰ Token expires in 1 hour. Run this script again to refresh."
echo ""


