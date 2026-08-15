# Lakebase OAuth Token Setup

## The Problem
Lakebase requires a user OAuth token that matches the database user. Currently:
- Database user: `nitin.aggarwal@databricks.com`
- Token needed: OAuth token for nitin.aggarwal@databricks.com (not service principal)

## How to Get Your OAuth Token

### Option 1: From Databricks UI (Easiest)

1. Go to your Databricks workspace:
   https://e2-demo-field-eng.cloud.databricks.com/

2. Navigate to one of:
   - **Compute** → **SQL Warehouses** → Select a warehouse → **Connection details** tab
   - **Data** → **Lakebase** → **maturity-assessment-db** → **Connection** tab

3. Click **"Get OAuth Token"** or **"Generate new token"**

4. Copy the token (it will look like: `eyJraWQiOi...`)

5. Paste it below and save this file

### Your Token (Paste Here)
```
<PASTE_YOUR_TOKEN_HERE>
```

## After Getting the Token

Run these commands:

```bash
cd /Users/nitin.aggarwal/BMAD-METHOD/databricks-maturity-assessment

# Replace <YOUR_TOKEN> with the actual token
export LAKEBASE_TOKEN="<YOUR_TOKEN>"

# Update app.yaml
sed -i.bak "s|value: # REPLACE_WITH_YOUR_TOKEN|value: $LAKEBASE_TOKEN|" app.yaml

# Deploy
databricks sync . /Workspace/Users/nitin.aggarwal@databricks.com/tma
databricks apps deploy tma
```

## Or Use This Quick Update Script

Save your token in a file, then run:

```bash
./update-lakebase-token.sh
```


