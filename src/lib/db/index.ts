import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Parse and fix the connection string if password contains @
// PostgreSQL connection strings: postgresql://user:password@host:port/db
// If password contains @, it must be URL encoded as %40
let connectionString = process.env.DATABASE_URL;

// Check if password needs encoding (if @ appears before the @host part)
const urlMatch = connectionString.match(/^postgresql:\/\/([^:]+):([^@]+)@(.+)$/);
if (urlMatch) {
  const [, user, password, rest] = urlMatch;
  // If password contains @ that's not encoded, encode it
  if (password.includes('@') && !password.includes('%40')) {
    const encodedPassword = encodeURIComponent(password);
    connectionString = `postgresql://${user}:${encodedPassword}@${rest}`;
  }
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
});

// Test connection on startup
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

export const db = drizzle(pool, { schema });

export type Database = typeof db;
