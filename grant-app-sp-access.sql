-- Grant the Databricks App service principal access to Lakebase
-- The app service principal ID: 2dd066d2-2717-4694-85be-968a1407fd53

-- Create role for the service principal
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '2dd066d2-2717-4694-85be-968a1407fd53') THEN
    CREATE ROLE "2dd066d2-2717-4694-85be-968a1407fd53" WITH LOGIN;
  END IF;
END
$$;

-- Grant all privileges on database
GRANT ALL PRIVILEGES ON DATABASE databricks_postgres TO "2dd066d2-2717-4694-85be-968a1407fd53";

-- Grant all privileges on all tables in public schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "2dd066d2-2717-4694-85be-968a1407fd53";

-- Grant all privileges on all sequences in public schema
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "2dd066d2-2717-4694-85be-968a1407fd53";

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO "2dd066d2-2717-4694-85be-968a1407fd53";

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "2dd066d2-2717-4694-85be-968a1407fd53";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "2dd066d2-2717-4694-85be-968a1407fd53";

