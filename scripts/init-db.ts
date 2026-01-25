import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "../src/lib/db/schema";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite, { schema });

async function init() {
  console.log("Creating tables...");
  
  // Create tables manually since migrations might not exist yet
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS case_studies (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      full_description TEXT,
      metrics TEXT NOT NULL,
      details TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      quote TEXT NOT NULL,
      author TEXT NOT NULL,
      role TEXT NOT NULL,
      company TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS social_proof (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      logo TEXT,
      "order" INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  console.log("Creating admin user...");
  const email = process.env.ADMIN_EMAIL || "admin@thesnehadas.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const hashedPassword = await bcrypt.hash(password, 10);
  const now = Date.now();

  try {
    sqlite.exec(`
      INSERT OR IGNORE INTO users (id, email, password, name, created_at, updated_at)
      VALUES ('${randomUUID()}', '${email}', '${hashedPassword}', 'Admin', ${now}, ${now})
    `);
    console.log(`✅ Admin user created: ${email}`);
    console.log(`   Password: ${password}`);
    console.log("⚠️  Please change the password after first login!");
  } catch (error: any) {
    console.log("Admin user already exists or error:", error.message);
  }

  console.log("✅ Database initialized!");
  sqlite.close();
}

init().catch(console.error);
