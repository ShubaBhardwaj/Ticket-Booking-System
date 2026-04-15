// src/common/config/db.js
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Ensure DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL in environment variables");
}

// Create pool using DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  // 🔥 Important for Neon (serverless DB)
  ssl: {
    rejectUnauthorized: false,
  },

  // Prevent hanging issues
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Drizzle instance
export const db = drizzle(pool);

// Optional export (if you want raw queries)
export { pool };