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

export const blogTags = pgTable("blog_tags", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const systems = pgTable("systems", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
  title: text("title").notNull(),
  summary: text("summary").notNull(), // Short description for card
  description: text("description").notNull(), // Full description for dialog
  order: integer("order").notNull().default(0), // For ordering systems
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
  // Core Content
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  // SEO Meta
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  // Keywords
  primaryKeyword: text("primary_keyword"),
  secondaryKeywords: text("secondary_keywords"), // Comma-separated
  searchIntent: text("search_intent"),
  // Content
  content: text("content").notNull(), // Markdown content
  // Featured Image
  featuredImage: text("featured_image"), // URL or data URL
  featuredImageAlt: text("featured_image_alt"),
  featuredImageCaption: text("featured_image_caption"),
  // Organization
  category: text("category"),
  tags: text("tags"), // JSON array of tag IDs
  // Publishing
  status: text("status").notNull().default("draft"), // draft, published, archived
  isFeatured: integer("is_featured").notNull().default(0), // 0 or 1 (boolean)
  publishDate: timestamp("publish_date"),
  schemaType: text("schema_type"), // Schema.org type
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});