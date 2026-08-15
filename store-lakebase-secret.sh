#!/bin/bash
# Store Lakebase connection string

HOST="instance-ee2a221d-960d-4811-b669-190fcf608365.database.cloud.databricks.com"
USER="nitin.aggarwal@databricks.com"
DATABASE="databricks_postgres"
PORT="5432"

# For Lakebase, we use OAuth token authentication
# The password is the Databricks OAuth token (1 hour lifetime)
CONNECTION_STRING="postgresql://${USER}:\${PGPASSWORD}@${HOST}:${PORT}/${DATABASE}?sslmode=require"

echo "Storing Lakebase connection string..."
echo "$CONNECTION_STRING" | databricks secrets put-secret \
  --scope maturity-assessment \
  --key LAKEBASE_DATABASE_URL

echo "✅ Connection string stored!"
