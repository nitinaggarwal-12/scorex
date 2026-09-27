#!/bin/bash
# Start backend server for LOCAL development (file-based storage, no PostgreSQL)

echo "🚀 Starting Databricks Maturity Assessment Backend (LOCAL MODE)"
echo "📁 Using file-based storage (data/assessments.json)"
echo "🔌 PostgreSQL disabled for local development"
echo ""

# Unset DATABASE_URL to force file-based storage
unset DATABASE_URL

# Start the server
PORT=3001 node server/index.js

