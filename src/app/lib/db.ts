// src/lib/db.ts
import mysql from "mysql2/promise";

// Base configuration
const config: mysql.PoolOptions = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "vesuvius_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Add SSL configuration only if needed
if (process.env.DB_SSL === "true") {
  config.ssl = {
    rejectUnauthorized: false, // Sæt til true i produktion med valid certificates
  };
}

const pool = mysql.createPool(config);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connection successful");
    connection.release();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

// Test connection on startup (kun i development)
if (process.env.NODE_ENV === "development") {
  testConnection();
}

export default pool;
