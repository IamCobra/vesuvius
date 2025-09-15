-- Database initialization script for Vesuvius Restaurant System
-- This script runs when PostgreSQL container starts for the first time

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Create performance indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reservations_slot_times 
ON reservations USING gist (tsrange(slot_start_utc, slot_end_utc, '[)'));

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reserved_tables_times
ON reserved_tables USING gist (table_id, tsrange(start_utc, end_utc, '[)'));

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_customers_email
ON customers (email);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_dining_tables_number
ON dining_tables (table_number);

-- Create constraint to prevent overlapping table reservations
-- This ensures no table can be double-booked
ALTER TABLE reserved_tables 
ADD CONSTRAINT no_table_overlap 
EXCLUDE USING gist (table_id WITH =, tsrange(start_utc, end_utc, '[)') WITH &&);

-- Insert default time slots (optional - mostly for UI reference)
INSERT INTO time_slots (id, start_time, end_time, max_tables) VALUES
('ts_1100', '11:00', '13:00', 25),
('ts_1130', '11:30', '13:30', 25),
('ts_1200', '12:00', '14:00', 25),
('ts_1230', '12:30', '14:30', 25),
('ts_1300', '13:00', '15:00', 25),
('ts_1330', '13:30', '15:30', 25),
('ts_1400', '14:00', '16:00', 25),
('ts_1430', '14:30', '16:30', 25),
('ts_1500', '15:00', '17:00', 25),
('ts_1530', '15:30', '17:30', 25),
('ts_1600', '16:00', '18:00', 25),
('ts_1630', '16:30', '18:30', 25),
('ts_1700', '17:00', '19:00', 25),
('ts_1730', '17:30', '19:30', 25),
('ts_1800', '18:00', '20:00', 25),
('ts_1830', '18:30', '20:30', 25),
('ts_1900', '19:00', '21:00', 25),
('ts_1930', '19:30', '21:30', 25),
('ts_2000', '20:00', '22:00', 25),
('ts_2030', '20:30', '22:30', 25),
('ts_2100', '21:00', '23:00', 25)
ON CONFLICT (id) DO NOTHING;

-- Insert the 25 dining tables (all 2-person tables)
INSERT INTO dining_tables (id, table_number, seats) 
SELECT 
  'table_' || generate_series(1,25)::text,
  generate_series(1,25),
  2
ON CONFLICT (table_number) DO NOTHING;

-- Create default admin user (optional)
INSERT INTO customers (id, first_name, last_name, email, phone) VALUES
('admin_user', 'Admin', 'Vesuvius', 'admin@vesuvius.dk', '+4512345678')
ON CONFLICT (email) DO NOTHING;

-- Helpful queries for monitoring (commented out)
-- SELECT COUNT(*) as total_tables FROM dining_tables;
-- SELECT COUNT(*) as total_reservations FROM reservations;
-- SELECT table_number, COUNT(rt.id) as reservation_count 
-- FROM dining_tables dt 
-- LEFT JOIN reserved_tables rt ON dt.id = rt.table_id 
-- GROUP BY table_number 
-- ORDER BY table_number;