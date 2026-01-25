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

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 30000, // Increased timeout
});

// Handle connection errors
pool.on('error', (err) => {
  console.error('Database pool error:', err);
});

export const db = drizzle(pool, { schema });

export type Database = typeof db;
