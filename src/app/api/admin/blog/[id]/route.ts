import { NextRequest, NextResponse } from "next/server";
import { requireAuthAPI } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuthAPI();
    const { id } = await params;
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error: any) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuthAPI();
    const { id } = await params;
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists for another post
    const existing = await db
      .select()
      .from(blogPosts)
      .where(sql`${blogPosts.slug} = ${body.slug} AND ${blogPosts.id} != ${id}`)
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "A blog post with this slug already exists" },
        { status: 400 }
      );
    }

    const updated = await db
      .update(blogPosts)
      .set({
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
        updatedAt: sql`now()`,
      })
      .where(eq(blogPosts.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuthAPI();
    const { id } = await params;

    await db.delete(blogPosts).where(eq(blogPosts.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
