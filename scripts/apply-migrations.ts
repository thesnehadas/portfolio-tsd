import { Pool } from "pg";
import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync } from "fs";

// Load .env.local file
config({ path: resolve(process.cwd(), ".env.local") });

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function applyMigrations() {
  try {
    console.log("✅ Database connection established");
    
    // Read the migration file
    const migrationSQL = readFileSync(
      resolve(process.cwd(), "drizzle/0000_flashy_tusk.sql"),
      "utf-8"
    );

    // Split by statement breakpoint and execute each statement
    const statements = migrationSQL
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    console.log(`\n📝 Applying ${statements.length} migration statements...\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        try {
          await pool.query(statement);
          console.log(`✅ Statement ${i + 1} executed successfully`);
        } catch (error: any) {
          // Ignore "already exists" errors
          if (error.message.includes("already exists") || error.code === "42P07") {
            console.log(`ℹ️  Statement ${i + 1} skipped (already exists)`);
          } else {
            console.error(`❌ Error in statement ${i + 1}:`, error.message);
            throw error;
          }
        }
      }
    }

    console.log("\n✅ All migrations applied successfully!");
  } catch (error: any) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

applyMigrations().catch(console.error);
