import { NextRequest, NextResponse } from "next/server";
import { requireAuthAPI } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    await requireAuthAPI(request);
    const all = await db.select().from(blogPosts).orderBy(blogPosts.createdAt);
    return NextResponse.json(all);
  } catch (error: any) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuthAPI(request);
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await db
      .select()
      .from(blogPosts)
      .where(sql`${blogPosts.slug} = ${body.slug}`)
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "A blog post with this slug already exists" },
        { status: 400 }
      );
    }

    const newPost = await db
      .insert(blogPosts)
      .values({
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt || null,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
        primaryKeyword: body.primaryKeyword || null,
        secondaryKeywords: body.secondaryKeywords || null,
        searchIntent: body.searchIntent || null,
        content: body.content,
        featuredImage: body.featuredImage || null,
        featuredImageAlt: body.featuredImageAlt || null,
        featuredImageCaption: body.featuredImageCaption || null,
        category: body.category || null,
        tags: body.tags || null,
        status: body.status || "draft",
        isFeatured: body.isFeatured || 0,
        publishDate: body.publishDate ? new Date(body.publishDate) : null,
        schemaType: body.schemaType || null,
      })
      .returning();

    return NextResponse.json(newPost[0]);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create blog post" },
      { status: 500 }
    );
  }
}
