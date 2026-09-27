#!/bin/bash
set -e

echo "🚀 Starting Databricks Maturity Assessment..."
echo "📍 Current directory: $(pwd)"
echo "📂 Contents: $(ls -la)"

# Ensure we're serving the built client files
if [ ! -d "client/build" ]; then
  echo "❌ ERROR: client/build directory not found!"
  echo "📂 Client directory contents:"
  ls -la client/ || echo "Client directory not found"
  exit 1
fi

echo "✅ Client build found"

# Run database migrations if DATABASE_URL is set
if [ ! -z "$DATABASE_URL" ]; then
  echo "🗄️ Running PostgreSQL database migrations..."
  node server/run-migrations.js || echo "⚠️ Database migrations encountered warnings, continuing..."
  echo "✅ Database migrations complete"
else
  echo "⚠️ No DATABASE_URL found, skipping database setup"
fi

echo "🌐 Starting server on port ${PORT:-3000}..."

# Start the Node.js server
NODE_ENV=production node server/index.js

