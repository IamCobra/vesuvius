-- Create schema directly via SQL
-- Run this with: docker exec -i vesuvius-postgres-1 psql -U postgres -d vesuvius_db < create-schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Category table
CREATE TABLE IF NOT EXISTS "Category" (
    id TEXT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create MenuItem table
CREATE TABLE IF NOT EXISTS "MenuItem" (
    id TEXT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id TEXT NOT NULL REFERENCES "Category"(id) ON DELETE CASCADE,
    image_url TEXT,
    allergens TEXT[],
    is_available BOOLEAN DEFAULT true,
    is_vegetarian BOOLEAN DEFAULT false,
    is_vegan BOOLEAN DEFAULT false,
    is_gluten_free BOOLEAN DEFAULT false,
    preparation_time INTEGER DEFAULT 15,
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create Customer table
CREATE TABLE IF NOT EXISTS "Customer" (
    id TEXT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create DiningTable table
CREATE TABLE IF NOT EXISTS "DiningTable" (
    id TEXT PRIMARY KEY,
    table_number INTEGER UNIQUE NOT NULL,
    seats INTEGER NOT NULL DEFAULT 2,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create TimeSlot table
CREATE TABLE IF NOT EXISTS "TimeSlot" (
    id TEXT PRIMARY KEY,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_tables INTEGER DEFAULT 25,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create Reservation table
CREATE TABLE IF NOT EXISTS "Reservation" (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL REFERENCES "Customer"(id) ON DELETE CASCADE,
    time_slot_id TEXT NOT NULL REFERENCES "TimeSlot"(id) ON DELETE CASCADE,
    party_size INTEGER NOT NULL,
    reservation_date DATE NOT NULL,
    slot_start_utc TIMESTAMP(3) NOT NULL,
    slot_end_utc TIMESTAMP(3) NOT NULL,
    special_requests TEXT,
    status VARCHAR(20) DEFAULT 'confirmed',
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create ReservedTable table
CREATE TABLE IF NOT EXISTS "ReservedTable" (
    id TEXT PRIMARY KEY,
    reservation_id TEXT NOT NULL REFERENCES "Reservation"(id) ON DELETE CASCADE,
    table_id TEXT NOT NULL REFERENCES "DiningTable"(id) ON DELETE CASCADE,
    start_utc TIMESTAMP(3) NOT NULL,
    end_utc TIMESTAMP(3) NOT NULL,
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO "Category" (id, name, description, icon, display_order) VALUES
('cat_appetizers', 'Appetizers', 'Start your meal with these delicious appetizers', '🥗', 1),
('cat_mains', 'Main Courses', 'Hearty main dishes to satisfy your appetite', '🍽️', 2),
('cat_desserts', 'Desserts', 'Sweet endings to your perfect meal', '🍰', 3),
('cat_beverages', 'Beverages', 'Refreshing drinks and beverages', '🍷', 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO "MenuItem" (id, name, description, price, category_id, is_vegetarian, preparation_time) VALUES
('item_bruschetta', 'Classic Bruschetta', 'Toasted bread with fresh tomatoes, basil, and garlic', 12.50, 'cat_appetizers', true, 10),
('item_pasta_carbonara', 'Pasta Carbonara', 'Traditional Italian pasta with eggs, cheese, and pancetta', 18.90, 'cat_mains', false, 20),
('item_tiramisu', 'Tiramisu', 'Classic Italian dessert with coffee and mascarpone', 8.50, 'cat_desserts', true, 5),
('item_house_wine', 'House Wine (Glass)', 'Selection of red or white wine', 7.50, 'cat_beverages', true, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO "TimeSlot" (id, start_time, end_time, max_tables) VALUES
('ts_1100', '11:00', '13:00', 25),
('ts_1130', '11:30', '13:30', 25),
('ts_1200', '12:00', '14:00', 25),
('ts_1800', '18:00', '20:00', 25),
('ts_1830', '18:30', '20:30', 25),
('ts_1900', '19:00', '21:00', 25)
ON CONFLICT (id) DO NOTHING;

-- Insert dining tables
INSERT INTO "DiningTable" (id, table_number, seats)
SELECT 
  'table_' || generate_series(1,25)::text,
  generate_series(1,25),
  2
ON CONFLICT (table_number) DO NOTHING;
