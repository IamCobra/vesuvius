#!/bin/bash
set -e

# Create the vesuvius user and database
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER vesuvius WITH PASSWORD 'password123';
    GRANT ALL PRIVILEGES ON DATABASE vesuvius_db TO vesuvius;
    ALTER USER vesuvius CREATEDB;
EOSQL
