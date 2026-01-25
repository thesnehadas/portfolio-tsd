import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

// Use environment variable for database path, fallback to sqlite.db
const dbPath = process.env.DATABASE_URL || "sqlite.db";
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

export type Database = typeof db;
