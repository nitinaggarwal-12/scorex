# Lakebase (PostgreSQL) Setup for Technical Maturity Assessment

This guide shows how to set up and use Databricks Lakebase (managed PostgreSQL) for the Technical Maturity Assessment application.

## Overview

Lakebase is a fully managed PostgreSQL OLTP database integrated into Databricks. It provides:
- Native PostgreSQL compatibility
- Unity Catalog integration
- High availability
- Point-in-time recovery
- Data synchronization with Delta tables

## Prerequisites

- Databricks workspace in a supported region: `us-east-1`, `us-west-2`, `eu-west-1`, `ap-southeast-1`, `ap-southeast-2`, `eu-central-1`, `us-east-2`, `ap-south-1`
- Lakebase is in Public Preview

## Step 1: Create a Lakebase Database Instance

### Using Databricks UI

1. **Navigate to Lakebase**
   - Go to your Databricks workspace
   - Click **"Compute"** → **"Lakebase"** (or **"OLTP databases"**)

2. **Create Database Instance**
   - Click **"Create Database Instance"**
   - Configure:
     ```
     Name: maturity-assessment-db
     Size: Small (or Medium for production)
     High Availability: Enabled (recommended for production)
     Restore Window: 7 days (default)
     ```

3. **Wait for Provisioning**
   - Database instance will be created in 5-10 minutes
   - Status will change to "Running"

### Using Databricks CLI

```bash
# Create a Lakebase instance
databricks lakebase create \
  --name maturity-assessment-db \
  --size small \
  --high-availability true
```

## Step 2: Get Connection Details

### Get Database Credentials

1. **In Databricks UI:**
   - Go to your database instance
   - Click **"Connect"**
   - Copy the connection string

2. **Connection String Format:**
   ```
   postgresql://[username]:[password]@[host]:[port]/[database]
   ```

3. **Example:**
   ```
   postgresql://admin:your-password@lakebase-123.cloud.databricks.com:5432/maturity_assessment
   ```

### Using Databricks CLI

```bash
# Get connection details
databricks lakebase get-connection-string --name maturity-assessment-db
```

## Step 3: Update App Configuration

### Update `app.yaml`

```yaml
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
    value: "{{secrets/LAKEBASE_DATABASE_URL}}"
  - name: SESSION_SECRET
    value: "{{secrets/SESSION_SECRET}}"
  - name: OPENAI_API_KEY
    value: "{{secrets/OPENAI_API_KEY}}"
```

### Store Connection String as Secret

```bash
# Create secrets scope (if not exists)
databricks secrets create-scope maturity-assessment

# Store Lakebase connection string
databricks secrets put-secret \
  --scope maturity-assessment \
  --key LAKEBASE_DATABASE_URL \
  --string-value "postgresql://admin:password@lakebase-host:5432/maturity_assessment"

# Store session secret
databricks secrets put-secret \
  --scope maturity-assessment \
  --key SESSION_SECRET \
  --string-value "your-secret-key-here"
```

## Step 4: Initialize Database Schema

### Option 1: Run Migrations from Databricks Notebook

Create a notebook in Databricks:

```python
# Install psycopg2
%pip install psycopg2-binary

# Connect to Lakebase
import psycopg2

# Get connection string from secrets
connection_string = dbutils.secrets.get(scope="maturity-assessment", key="LAKEBASE_DATABASE_URL")

# Connect
conn = psycopg2.connect(connection_string)
cursor = conn.cursor()

# Run migrations
with open('/Workspace/Users/nitin.aggarwal@databricks.com/tma/server/db/schema.sql', 'r') as f:
    schema_sql = f.read()
    cursor.execute(schema_sql)

conn.commit()
cursor.close()
conn.close()

print("✅ Database schema initialized successfully!")
```

### Option 2: Run from Local Machine

```bash
# Set environment variable
export DATABASE_URL="postgresql://admin:password@lakebase-host:5432/maturity_assessment"

# Run migrations
cd /Users/nitin.aggarwal/BMAD-METHOD/databricks-maturity-assessment
node server/db/migrate.js
```

### Option 3: Run from Databricks App

The app will automatically run migrations on startup if the database is empty.

## Step 5: Deploy Updated App

```bash
# Sync updated app.yaml
databricks sync . /Workspace/Users/nitin.aggarwal@databricks.com/tma

# Deploy app
databricks apps deploy tma
```

## Step 6: Verify Connection

### Check App Logs

```bash
# View app logs
databricks apps logs tma
```

Look for:
```
✅ Connected to PostgreSQL database
📊 Assessment framework loaded with 6 areas
🚀 Databricks Maturity Assessment API running on port 8080
```

### Test Database Connection

Create a test notebook:

```python
import psycopg2

connection_string = dbutils.secrets.get(scope="maturity-assessment", key="LAKEBASE_DATABASE_URL")
conn = psycopg2.connect(connection_string)
cursor = conn.cursor()

# Test query
cursor.execute("SELECT COUNT(*) FROM assessments")
count = cursor.fetchone()[0]
print(f"✅ Database connected! Total assessments: {count}")

cursor.close()
conn.close()
```

## Advanced Features

### 1. Register with Unity Catalog

Register your Lakebase database as a Unity Catalog catalog for federated queries:

```sql
CREATE CATALOG maturity_assessment_catalog
  USING CONNECTION lakebase_connection
  OPTIONS (
    host 'lakebase-host',
    port '5432',
    database 'maturity_assessment',
    user 'admin'
  );
```

### 2. Sync Data from Unity Catalog

Create synced tables that automatically sync from Delta tables:

```sql
-- In Lakebase
CREATE SYNCED TABLE assessments_sync
  FROM CATALOG main.default.assessments;
```

### 3. Create Child Instance for Development

```bash
# Create a point-in-time copy for development
databricks lakebase create-child \
  --parent maturity-assessment-db \
  --name maturity-assessment-dev \
  --point-in-time "2025-12-01T12:00:00Z"
```

### 4. Enable High Availability

```bash
# Update instance to enable HA
databricks lakebase update \
  --name maturity-assessment-db \
  --high-availability true
```

### 5. Monitor Database

View metrics in Databricks UI:
- CPU usage
- Memory usage
- Connection count
- Query performance
- Storage usage

## Troubleshooting

### Connection Timeout

If you get connection timeouts:

1. **Check instance status:**
   ```bash
   databricks lakebase get --name maturity-assessment-db
   ```

2. **Verify network connectivity:**
   - Lakebase instances are accessible within Databricks workspace
   - External access may require VPC peering or PrivateLink

### Authentication Errors

If you get authentication errors:

1. **Verify credentials:**
   ```bash
   databricks secrets get --scope maturity-assessment --key LAKEBASE_DATABASE_URL
   ```

2. **Check user permissions:**
   ```sql
   -- In Lakebase
   SELECT * FROM pg_roles WHERE rolname = 'your-username';
   ```

### Migration Errors

If migrations fail:

1. **Check if tables already exist:**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

2. **Drop and recreate if needed:**
   ```sql
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   ```

## Cost Optimization

1. **Right-size your instance:**
   - Start with Small for development
   - Use Medium/Large for production based on load

2. **Use child instances for dev/test:**
   - Create point-in-time copies instead of separate instances
   - Child instances are cheaper

3. **Monitor usage:**
   - Review metrics regularly
   - Scale down during off-hours if possible

## Security Best Practices

1. **Use Databricks Secrets:**
   - Never hardcode credentials
   - Store all sensitive data in secrets

2. **Enable High Availability:**
   - Critical for production workloads
   - Automatic failover

3. **Configure Restore Window:**
   - Set appropriate backup retention
   - Default is 7 days

4. **Use Role-Based Access:**
   - Create separate roles for different access levels
   - Follow principle of least privilege

## Migration from External PostgreSQL

If you're migrating from an external PostgreSQL database:

1. **Export data from external DB:**
   ```bash
   pg_dump -h external-host -U user -d maturity_assessment > backup.sql
   ```

2. **Import to Lakebase:**
   ```bash
   psql -h lakebase-host -U admin -d maturity_assessment < backup.sql
   ```

3. **Update connection string:**
   - Update secrets with new Lakebase connection string
   - Redeploy app

## Next Steps

1. ✅ Create Lakebase instance
2. ✅ Store connection string in secrets
3. ✅ Update app.yaml
4. ✅ Run database migrations
5. ✅ Deploy app
6. ✅ Verify connection
7. ✅ Test application
8. ✅ Enable monitoring
9. ✅ Configure backups
10. ✅ Set up high availability

## Resources

- [Lakebase Documentation](https://docs.databricks.com/aws/en/oltp/instances/)
- [Create Database Instance](https://docs.databricks.com/aws/en/oltp/instances/create/)
- [Connect to Database](https://docs.databricks.com/aws/en/oltp/instances/authentication)
- [Unity Catalog Integration](https://docs.databricks.com/aws/en/oltp/instances/register-uc)
- [High Availability](https://docs.databricks.com/aws/en/oltp/instances/create/high-availability)

---

**Last Updated:** December 1, 2025  
**Version:** 1.0.0


