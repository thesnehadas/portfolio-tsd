import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Ensure the connection string is properly formatted
let connectionString = process.env.DATABASE_URL;

// If password contains @, it needs to be URL encoded
// But since it's already in the env var, we'll use it as-is
// The issue might be that Supabase needs the connection pooler URL instead

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000, // Increased timeout
});

// Test connection on startup
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

export const db = drizzle(pool, { schema });

export type Database = typeof db;
