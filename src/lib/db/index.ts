import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Parse and properly encode the connection string
// PostgreSQL connection strings: postgresql://user:password@host:port/db
// If password contains special characters like @, they must be URL encoded
function fixConnectionString(url: string): string {
  try {
    // Try to parse the URL
    const urlObj = new URL(url);
    
    // If password exists and contains @, encode it
    if (urlObj.password && urlObj.password.includes('@') && !urlObj.password.includes('%40')) {
      urlObj.password = encodeURIComponent(urlObj.password);
      return urlObj.toString();
    }
    
    return url;
  } catch (e) {
    // If URL parsing fails, try manual parsing
    const match = url.match(/^postgresql:\/\/([^:]+):([^@]+)@(.+)$/);
    if (match) {
      const [, user, password, rest] = match;
      if (password.includes('@') && !password.includes('%40')) {
        const encodedPassword = encodeURIComponent(password);
        return `postgresql://${user}:${encodedPassword}@${rest}`;
      }
    }
    return url;
  }
}

const connectionString = fixConnectionString(process.env.DATABASE_URL);

// Supabase connection pool configuration
// Free tier typically allows 15-20 connections, but we use a smaller pool
// to avoid hitting limits and allow for connection overhead
const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  // Reduced pool size for Supabase compatibility
  max: 5, // Reduced from 20 to avoid hitting Supabase limits
  min: 1, // Keep at least 1 connection ready
  idleTimeoutMillis: 20000, // Close idle connections after 20s
  connectionTimeoutMillis: 10000, // Timeout after 10s (reduced from 30s)
  // Allow the pool to create connections on demand
  allowExitOnIdle: false,
});

// Handle connection errors
pool.on('error', (err) => {
  console.error('Database pool error:', err);
  // Don't throw - let the application handle it
});

// Log pool statistics periodically (only in development)
if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    console.log('Pool stats:', {
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount,
    });
  }, 30000); // Every 30 seconds
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Closing database pool...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Closing database pool...');
  await pool.end();
  process.exit(0);
});

export const db = drizzle(pool, { schema });

export type Database = typeof db;
