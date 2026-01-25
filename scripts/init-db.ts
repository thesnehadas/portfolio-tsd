import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../src/lib/db/schema";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const db = drizzle(pool, { schema });

async function init() {
  console.log("✅ Database connection established");

  console.log("Creating admin user...");
  const email = process.env.ADMIN_EMAIL || "snehadas.iitr@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "SnehaD@s9803";

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.insert(schema.users).values({
      id: randomUUID(),
      email,
      password: hashedPassword,
      name: "Admin",
    }).onConflictDoNothing();
    
    console.log(`✅ Admin user created: ${email}`);
    console.log(`   Password: ${password}`);
    console.log("⚠️  Please change the password after first login!");
  } catch (error: any) {
    if (error.code === '23505') { // Unique constraint violation
      console.log("ℹ️  Admin user already exists");
    } else {
      console.log("❌ Error creating admin user:", error.message);
    }
  }

  console.log("✅ Database initialization complete!");
  await pool.end();
}

init().catch(console.error);
