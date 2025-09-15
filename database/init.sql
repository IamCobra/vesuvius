-- Database initialization script for Vesuvius Restaurant System
-- This script runs when PostgreSQL container starts for the first time

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Basic database setup - tables will be created by Prisma migrations
-- This file only sets up extensions and basic configuration
