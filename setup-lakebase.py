#!/usr/bin/env python3
"""
Setup Lakebase (PostgreSQL) for Technical Maturity Assessment
This script creates a Lakebase instance and configures the app to use it.
"""

import os
import sys
import time
import json
from databricks.sdk import WorkspaceClient
from databricks.sdk.service import sql

def setup_lakebase():
    """Set up Lakebase instance for the maturity assessment app"""
    
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("🚀 Setting up Lakebase for Technical Maturity Assessment")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print()
    
    # Initialize Databricks client
    try:
        w = WorkspaceClient()
        print("✅ Connected to Databricks workspace")
    except Exception as e:
        print(f"❌ Failed to connect to Databricks: {e}")
        print("💡 Make sure you have configured Databricks CLI:")
        print("   databricks configure --token")
        sys.exit(1)
    
    # Configuration
    instance_name = "maturity-assessment-db"
    database_name = "maturity_assessment"
    
    print()
    print("📋 Configuration:")
    print(f"   Instance Name: {instance_name}")
    print(f"   Database Name: {database_name}")
    print(f"   Size: Small")
    print(f"   High Availability: Enabled")
    print()
    
    # Note: As of now, Lakebase might need to be created via UI
    # The SDK/API support may be limited in preview
    print("⚠️  Note: Lakebase is in Public Preview")
    print("   You may need to create the instance via Databricks UI:")
    print()
    print("   1. Go to Databricks workspace")
    print("   2. Navigate to: Compute → Lakebase (or OLTP databases)")
    print("   3. Click 'Create Database Instance'")
    print("   4. Configure:")
    print(f"      • Name: {instance_name}")
    print("      • Size: Small")
    print("      • High Availability: Enabled")
    print("   5. Wait 5-10 minutes for provisioning")
    print()
    
    # Create secrets scope
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("🔐 Setting up Secrets")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print()
    
    scope_name = "maturity-assessment"
    
    try:
        # Check if scope exists
        scopes = w.secrets.list_scopes()
        scope_exists = any(s.name == scope_name for s in scopes)
        
        if not scope_exists:
            print(f"📝 Creating secrets scope: {scope_name}")
            w.secrets.create_scope(scope=scope_name)
            print(f"✅ Secrets scope '{scope_name}' created")
        else:
            print(f"✅ Secrets scope '{scope_name}' already exists")
    except Exception as e:
        print(f"⚠️  Could not create secrets scope: {e}")
        print("   You may need to create it manually:")
        print(f"   databricks secrets create-scope {scope_name}")
    
    print()
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("📝 Next Steps")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print()
    print("After creating the Lakebase instance:")
    print()
    print("1. Get the connection string from Databricks UI:")
    print("   • Click on your database instance")
    print("   • Click 'Connect'")
    print("   • Copy the connection string")
    print()
    print("2. Store the connection string as a secret:")
    print(f"   databricks secrets put-secret \\")
    print(f"     --scope {scope_name} \\")
    print(f"     --key LAKEBASE_DATABASE_URL \\")
    print(f"     --string-value 'postgresql://admin:password@host:5432/{database_name}'")
    print()
    print("3. Store session secret:")
    print(f"   databricks secrets put-secret \\")
    print(f"     --scope {scope_name} \\")
    print(f"     --key SESSION_SECRET \\")
    print(f"     --string-value 'your-secret-key-here'")
    print()
    print("4. Run the integration script:")
    print("   python integrate-lakebase.py")
    print()
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

if __name__ == "__main__":
    setup_lakebase()


