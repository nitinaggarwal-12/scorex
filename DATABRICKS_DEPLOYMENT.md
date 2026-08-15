# Databricks Git Deployment Guide

Complete guide for deploying the Technical Maturity Assessment Platform to Databricks Repos.

## 📋 Prerequisites

- Databricks workspace access
- GitHub repository access: https://github.com/nitinaggarwal-databricks/technical-maturity-assessment
- Databricks personal access token (for CLI/API methods)

## 🚀 Deployment Methods

### Method 1: Web UI (Easiest)

**Step-by-step:**

1. **Log into Databricks**
   - Navigate to your Databricks workspace
   - URL format: `https://your-workspace.cloud.databricks.com`

2. **Access Repos**
   - Click **"Repos"** in the left sidebar
   - Or navigate to: `https://your-workspace.cloud.databricks.com/#workspace/repos`

3. **Add Repository**
   - Click **"Add Repo"** button (top right)
   - Fill in the form:
     ```
     Git repository URL: https://github.com/nitinaggarwal-databricks/technical-maturity-assessment
     Git provider: GitHub
     Repository name: technical-maturity-assessment
     ```
   - Click **"Create Repo"**

4. **Verify**
   - Repository should appear under `/Repos/[your-email]/technical-maturity-assessment`
   - All files should be visible in the Databricks file browser

### Method 2: Databricks CLI (Automated)

**Prerequisites:**
```bash
# Install Databricks CLI
pip install databricks-cli

# Configure authentication
databricks configure --token
# Enter:
# - Databricks Host: https://your-workspace.cloud.databricks.com
# - Token: [your personal access token]
```

**Deploy:**
```bash
# Run the deployment script
./deploy-to-databricks-repos.sh
```

**Or manually:**
```bash
databricks repos create \
  --url https://github.com/nitinaggarwal-databricks/technical-maturity-assessment \
  --provider gitHub \
  --path /Repos/$USER/technical-maturity-assessment
```

### Method 3: REST API (Advanced)

**Using the provided script:**
```bash
# Set environment variables
export DATABRICKS_HOST="https://your-workspace.cloud.databricks.com"
export DATABRICKS_TOKEN="your-personal-access-token"
export DATABRICKS_USER="your-email@company.com"

# Run deployment
./deploy-to-databricks-api.sh
```

**Or use curl directly:**
```bash
curl -X POST \
  -H "Authorization: Bearer $DATABRICKS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://github.com/nitinaggarwal-databricks/technical-maturity-assessment",
    "provider": "gitHub",
    "path": "/Repos/your-email@company.com/technical-maturity-assessment"
  }' \
  "$DATABRICKS_HOST/api/2.0/repos"
```

## 🔄 Updating the Repository

### Via Web UI
1. Navigate to the repo in Databricks
2. Click the branch dropdown (top right)
3. Click **"Pull"** to get latest changes

### Via CLI
```bash
databricks repos update \
  --path /Repos/$USER/technical-maturity-assessment \
  --branch main
```

### Via API
```bash
# Get repo ID first
REPO_ID=$(curl -s \
  -H "Authorization: Bearer $DATABRICKS_TOKEN" \
  "$DATABRICKS_HOST/api/2.0/repos?path_prefix=/Repos/$USER/technical-maturity-assessment" | \
  jq -r '.repos[0].id')

# Update to latest
curl -X PATCH \
  -H "Authorization: Bearer $DATABRICKS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"branch": "main"}' \
  "$DATABRICKS_HOST/api/2.0/repos/$REPO_ID"
```

## 📂 Repository Structure in Databricks

After deployment, you'll see:

```
/Repos/your-email@company.com/technical-maturity-assessment/
├── client/                 # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/                # Node.js backend
│   ├── routes/
│   ├── services/
│   ├── db/
│   └── index.js
├── data/                  # Assessment data
├── README.md             # Documentation
├── package.json          # Dependencies
└── railway.json          # Deployment config
```

## ⚙️ Post-Deployment Configuration

### 1. Set Up Environment Variables

Create a notebook in Databricks to store secrets:

```python
# Store secrets in Databricks Secrets
dbutils.secrets.put(scope="maturity-assessment", key="DATABASE_URL", string_value="postgresql://...")
dbutils.secrets.put(scope="maturity-assessment", key="OPENAI_API_KEY", string_value="sk-...")
```

### 2. Install Dependencies

Create a cluster with:
- **Runtime:** 13.3 LTS or higher
- **Node.js:** Install via init script or cluster libraries

```bash
# In a notebook
%sh
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Initialize Database

```bash
%sh
cd /Workspace/Repos/$USER/technical-maturity-assessment
npm install
node server/db/migrate.js
```

### 4. Run the Application

```python
# In a notebook
import subprocess
import os

os.chdir('/Workspace/Repos/$USER/technical-maturity-assessment')

# Start backend
subprocess.Popen(['node', 'server/index.js'])

# Build frontend
subprocess.run(['npm', 'run', 'build'], cwd='client')
```

## 🔐 Authentication Setup

### Create Personal Access Token

1. **In Databricks:**
   - Click your profile icon (top right)
   - Select **"User Settings"**
   - Go to **"Access Tokens"** tab
   - Click **"Generate New Token"**
   - Copy the token (you won't see it again!)

2. **Configure locally:**
   ```bash
   databricks configure --token
   ```

## 🔗 Integration with Databricks Features

### Using Databricks SQL

```python
# In the application
from databricks import sql

connection = sql.connect(
    server_hostname=os.getenv("DATABRICKS_SERVER_HOSTNAME"),
    http_path=os.getenv("DATABRICKS_HTTP_PATH"),
    access_token=os.getenv("DATABRICKS_TOKEN")
)
```

### Using Unity Catalog

```sql
-- Store assessment data in Unity Catalog
CREATE SCHEMA IF NOT EXISTS maturity_assessment;

CREATE TABLE maturity_assessment.assessments (
  assessment_id STRING,
  user_id STRING,
  pillar STRING,
  maturity_score INT,
  created_at TIMESTAMP
);
```

### Using Databricks Workflows

Create a job to run assessments:

```json
{
  "name": "Maturity Assessment Runner",
  "tasks": [
    {
      "task_key": "run_assessment",
      "notebook_task": {
        "notebook_path": "/Repos/$USER/technical-maturity-assessment/notebooks/run_assessment",
        "base_parameters": {}
      }
    }
  ]
}
```

## 📊 Monitoring

### View Logs

```bash
# In Databricks notebook
%sh
cd /Workspace/Repos/$USER/technical-maturity-assessment
tail -f logs/application.log
```

### Check Health

```python
import requests

response = requests.get('http://localhost:5001/api/health')
print(response.json())
```

## 🐛 Troubleshooting

### Repository Not Appearing

**Check:**
- GitHub repository is public or you have access
- Databricks has GitHub integration enabled
- Your user has permission to create repos

**Fix:**
```bash
# Verify CLI configuration
databricks repos list

# Check permissions
databricks workspace ls /Repos
```

### Authentication Errors

**Error:** `Invalid token`

**Fix:**
1. Regenerate personal access token
2. Update configuration:
   ```bash
   databricks configure --token
   ```

### Cannot Pull Latest Changes

**Error:** `Local changes would be overwritten`

**Fix:**
```bash
# Via CLI - reset to remote
databricks repos update \
  --path /Repos/$USER/technical-maturity-assessment \
  --branch main
```

## 📚 Additional Resources

- [Databricks Repos Documentation](https://docs.databricks.com/repos/index.html)
- [Databricks CLI Reference](https://docs.databricks.com/dev-tools/cli/index.html)
- [Databricks REST API](https://docs.databricks.com/api/workspace/repos)
- [GitHub Repository](https://github.com/nitinaggarwal-databricks/technical-maturity-assessment)

## 🆘 Support

For issues:
1. Check the [GitHub Issues](https://github.com/nitinaggarwal-databricks/technical-maturity-assessment/issues)
2. Contact: nitin.aggarwal@databricks.com
3. Databricks Support Portal

---

**Last Updated:** November 24, 2025  
**Version:** 1.0.0


