#!/bin/bash
set -e

echo "🔨 Starting build process..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install

# Build React app
echo "⚛️  Building React application..."
npm run build

# Verify build was successful
if [ ! -f "build/index.html" ]; then
    echo "❌ ERROR: Build failed - index.html not found!"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📂 Build directory contents:"
ls -lh build/

cd ..
echo "🎉 Ready for deployment!"

