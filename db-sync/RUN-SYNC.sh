#!/bin/bash

echo "🔄 Database Sync Tool"
echo "===================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$RAILWAY_DATABASE_URL" ] && [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: Railway database URL not set!"
    echo ""
    echo "To get your Railway DATABASE_URL:"
    echo "  1. Go to https://railway.app"
    echo "  2. Select your project"
    echo "  3. Click on your 'web' service"
    echo "  4. Go to 'Variables' tab"
    echo "  5. Copy the DATABASE_URL value"
    echo ""
    echo "Then run:"
    echo "  export RAILWAY_DATABASE_URL='your-database-url'"
    echo "  ./RUN-SYNC.sh"
    echo ""
    exit 1
fi

echo "✅ Railway database URL found"
echo ""
echo "This will sync:"
echo "  • 10 users"
echo "  • 127 assessments"  
echo "  • ~93 user assignments"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    node sync-to-railway.js
else
    echo "❌ Cancelled"
    exit 0
fi
