#!/bin/bash
set -e

echo "🚀 Starting Databricks Maturity Assessment..."

# Verify build directory exists
if [ ! -d "client/build" ]; then
    echo "❌ ERROR: client/build directory not found!"
    echo "Build may have failed. Please check build logs."
    exit 1
fi

# Verify index.html exists
if [ ! -f "client/build/index.html" ]; then
    echo "❌ ERROR: client/build/index.html not found!"
    echo "Build may have failed. Please check build logs."
    exit 1
fi

echo "✅ Build verification passed"
echo "📂 Build directory:"
ls -lh client/build/

echo "🌐 Starting server..."
export NODE_ENV=production
node server/index.js

