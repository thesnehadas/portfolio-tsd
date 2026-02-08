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
  // Check if password might contain unencoded special characters
  // Look for pattern: postgresql://user:password@host
  // If there are multiple @ signs before the host, password likely contains @
  const atSignCount = (url.match(/@/g) || []).length;
  
  // If there's more than one @, the password likely contains an unencoded @
  if (atSignCount > 1) {
    // Try to parse: postgresql://user:password@rest
    // We need to find the LAST @ which separates credentials from host
    // The host part starts after the last @
    const lastAtIndex = url.lastIndexOf('@');
    if (lastAtIndex > 0) {
      const beforeAt = url.substring(0, lastAtIndex); // postgresql://user:password
      const afterAt = url.substring(lastAtIndex + 1); // host:port/db
      
      // Extract user and password (password may contain @)
      const userPassMatch = beforeAt.match(/^postgresql:\/\/([^:]+):(.+)$/);
      if (userPassMatch) {
        const [, user, password] = userPassMatch;
        // If password isn't already encoded, encode it
        if (password && !password.includes('%')) {
          const encodedPassword = encodeURIComponent(password);
          const fixedUrl = `postgresql://${user}:${encodedPassword}@${afterAt}`;
          console.log('Fixed connection string: encoded password with special characters');
          return fixedUrl;
        }
      }
    }
  }
  
  // If no special characters detected or already encoded, try standard URL parsing
  try {
    const urlObj = new URL(url);
    // Double-check password encoding
    if (urlObj.password && urlObj.password.includes('@') && !urlObj.password.includes('%40')) {
      urlObj.password = encodeURIComponent(urlObj.password);
      return urlObj.toString();
    }
    return url;
  } catch (e) {
    // If URL parsing fails, return as-is (might already be correct)
    return url;
  }
}

const connectionString = fixConnectionString(process.env.DATABASE_URL);

// Check if we should use Supabase connection pooler
// The pooler URL uses pooler.supabase.com domain
// Port 5432 = Transaction mode (recommended for serverless)
// Port 6543 = Session mode (for long-lived connections)
const usePooler = connectionString.includes('pooler.supabase.com') ||
                  connectionString.includes('pgbouncer=true');

// Supabase connection pool configuration
// For serverless environments, each instance creates its own pool
// So we need very small pools (1-2 connections max) to avoid exhausting Supabase limits
// Free tier typically allows 15-20 TOTAL connections across all instances
const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  // Very small pool for serverless compatibility
  // If using pooler, we can use slightly more connections
  max: usePooler ? 2 : 1, // 1 connection per instance for direct, 2 for pooler
  min: 0, // Don't keep connections idle in serverless (they'll be created on demand)
  idleTimeoutMillis: 10000, // Close idle connections quickly (10s)
  connectionTimeoutMillis: 5000, // Fast timeout (5s)
  // In serverless, we want to allow exit on idle to free up connections
  allowExitOnIdle: true,
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
      usingPooler: usePooler,
    });
  }, 30000); // Every 30 seconds
}

// Log connection info on startup
console.log(`Database connection configured: ${usePooler ? 'Using Supabase Pooler' : 'Direct connection'} (max: ${usePooler ? 2 : 1} connections per instance)`);

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
