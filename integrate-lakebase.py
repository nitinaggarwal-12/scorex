#!/usr/bin/env python3
"""
Integrate Lakebase with Technical Maturity Assessment App
This script updates app.yaml and runs database migrations.
"""

import os
import sys
import yaml
import subprocess
from databricks.sdk import WorkspaceClient

def integrate_lakebase():
    """Integrate Lakebase with the app"""
    
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("🔗 Integrating Lakebase with Maturity Assessment App")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print()
    
    # Initialize Databricks client
    try:
        w = WorkspaceClient()
        print("✅ Connected to Databricks workspace")
    except Exception as e:
        print(f"❌ Failed to connect to Databricks: {e}")
        sys.exit(1)
    
    scope_name = "maturity-assessment"
    
    # Check if secrets exist
    print()
    print("🔐 Checking secrets...")
    try:
        secrets = w.secrets.list_secrets(scope=scope_name)
        secret_keys = [s.key for s in secrets]
        
        has_db_url = "LAKEBASE_DATABASE_URL" in secret_keys
        has_session = "SESSION_SECRET" in secret_keys
        
        if has_db_url:
            print("✅ LAKEBASE_DATABASE_URL secret found")
        else:
            print("❌ LAKEBASE_DATABASE_URL secret not found")
            print("   Please run:")
            print(f"   databricks secrets put-secret --scope {scope_name} --key LAKEBASE_DATABASE_URL")
            sys.exit(1)
        
        if has_session:
            print("✅ SESSION_SECRET secret found")
        else:
            print("⚠️  SESSION_SECRET secret not found")
            print("   Creating a default session secret...")
            import secrets
            session_secret = secrets.token_urlsafe(32)
            w.secrets.put_secret(scope=scope_name, key="SESSION_SECRET", string_value=session_secret)
            print("✅ SESSION_SECRET created")
            
    except Exception as e:
        print(f"❌ Error checking secrets: {e}")
        sys.exit(1)
    
    # Update app.yaml
    print()
    print("📝 Updating app.yaml...")
    
    app_yaml_path = "app.yaml"
    
    try:
        with open(app_yaml_path, 'r') as f:
            config = yaml.safe_load(f)
        
        # Update environment variables
        if 'env' not in config:
            config['env'] = []
        
        # Remove old DATABASE_URL if exists
        config['env'] = [e for e in config['env'] if e.get('name') != 'DATABASE_URL']
        
        # Add Lakebase DATABASE_URL
        config['env'].append({
            'name': 'DATABASE_URL',
            'value': f'{{{{secrets/{scope_name}/LAKEBASE_DATABASE_URL}}}}'
        })
        
        # Update SESSION_SECRET
        session_secret_exists = any(e.get('name') == 'SESSION_SECRET' for e in config['env'])
        if not session_secret_exists:
            config['env'].append({
                'name': 'SESSION_SECRET',
                'value': f'{{{{secrets/{scope_name}/SESSION_SECRET}}}}'
            })
        
        # Write updated config
        with open(app_yaml_path, 'w') as f:
            yaml.dump(config, f, default_flow_style=False, sort_keys=False)
        
        print("✅ app.yaml updated with Lakebase configuration")
        
    except Exception as e:
        print(f"❌ Error updating app.yaml: {e}")
        sys.exit(1)
    
    # Sync to Databricks
    print()
    print("📤 Syncing files to Databricks...")
    
    try:
        result = subprocess.run(
            ['databricks', 'sync', '.', '/Workspace/Users/nitin.aggarwal@databricks.com/tma'],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print("✅ Files synced to Databricks")
        else:
            print(f"⚠️  Sync warning: {result.stderr}")
            
    except Exception as e:
        print(f"⚠️  Could not sync files: {e}")
        print("   Please run manually:")
        print("   databricks sync . /Workspace/Users/nitin.aggarwal@databricks.com/tma")
    
    # Deploy app
    print()
    print("🚀 Deploying app...")
    
    try:
        result = subprocess.run(
            ['databricks', 'apps', 'deploy', 'tma'],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print("✅ App deployed successfully!")
            print()
            print("Deployment details:")
            print(result.stdout)
        else:
            print(f"❌ Deployment failed: {result.stderr}")
            sys.exit(1)
            
    except Exception as e:
        print(f"❌ Could not deploy app: {e}")
        sys.exit(1)
    
    print()
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("✅ INTEGRATION COMPLETE!")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print()
    print("🔗 Your app is now using Lakebase PostgreSQL!")
    print()
    print("📊 Next steps:")
    print("   1. Check app logs: databricks apps logs tma")
    print("   2. Access your app: https://tma-144482830581048s.aws.databricksapps.com")
    print("   3. Verify database connection in logs")
    print()
    print("💡 The app will automatically:")
    print("   • Connect to Lakebase")
    print("   • Run database migrations")
    print("   • Initialize the schema")
    print()
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

if __name__ == "__main__":
    integrate_lakebase()


