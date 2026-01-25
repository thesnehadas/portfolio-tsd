import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const caseStudies = pgTable("case_studies", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  fullDescription: text("full_description"),
  metrics: text("metrics").notNull(), // JSON string
  details: text("details"), // JSON string array
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
  quote: text("quote").notNull(),
  author: text("author").notNull(),
  role: text("role").notNull(),
  company: text("company"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const socialProof = pgTable("social_proof", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
  name: text("name").notNull(),
  logo: text("logo"), // URL to logo image
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
