# Database Sync Tool

This tool syncs your local PostgreSQL database to Railway.

## Files

- `assessments_export.csv` - Exported assessments from local database
- `users_export.csv` - Exported users from local database  
- `sync-to-railway.js` - Script to import data to Railway

## How to Run

### 1. Get Railway Database URL

Go to Railway dashboard → Your service → **Variables** tab → Copy `DATABASE_URL`

### 2. Run the sync script

```bash
cd /Users/nitin.aggarwal/BMAD-METHOD

# Set Railway database URL
export RAILWAY_DATABASE_URL="postgresql://postgres:PASSWORD@HOST:PORT/railway"

# Run sync
node db-sync/sync-to-railway.js
```

## What it does

1. ✅ Connects to Railway PostgreSQL
2. ✅ Imports all users (skips duplicates)
3. ✅ Imports all 127 assessments (skips duplicates)
4. ✅ Creates `user_assignments` for assessments with `user_id`
5. ✅ Shows final counts

## Safety

- Uses `ON CONFLICT DO NOTHING` - won't overwrite existing data
- Won't break Railway if TrustBank assessment already exists
- Creates assignments only for assessments with `user_id` set

## After Running

Your Railway database will have:
- All 10 users from local
- All 127 assessments from local
- ~93 user_assignments (for assessments with user_id)

Then you can see all your assessments on Railway!
