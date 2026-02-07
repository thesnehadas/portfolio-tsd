import { db } from "@/lib/db";
import { blogPosts, blogTags } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { BlogForm } from "@/components/admin/blog-form";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let post = null;
  let tags = [];
  let error = null;

  try {
    [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    tags = await db.select().from(blogTags).orderBy(blogTags.name);
  } catch (err: any) {
    console.error("Error fetching blog post:", err);
    error = err.message || "Failed to load blog post";
    if (err.message?.includes("does not exist") || err.message?.includes("relation") || err.code === "42P01") {
      error = "Database tables not set up. Please run migrations in Supabase.";
    }
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-serif font-semibold text-[#09090b] mb-8">
          Edit Blog Post
        </h1>
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 font-medium mb-2">⚠️ Setup Required</p>
          <p className="text-yellow-700 text-sm">{error}</p>
          <p className="text-yellow-700 text-sm mt-2">
            Please run the SQL migration in your Supabase SQL Editor.
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  // Helper function to safely convert ANY date-like value to ISO string or null
  // This is critical - React cannot serialize Date objects to client components
  const formatDateToString = (date: any): string | null => {
    if (!date) return null;
    if (typeof date === 'string') {
      // If it's already a string, validate it's a valid date string
      const testDate = new Date(date);
      if (!isNaN(testDate.getTime())) {
        return date;
      }
      return null;
    }
    if (date instanceof Date) {
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
      return null;
    }
    // Try to parse as date (handles timestamps, date-like objects, etc.)
    try {
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString();
      }
    } catch {
      // Ignore parsing errors
    }
    return null;
  };

  // Convert the raw post object to a plain object with all dates as strings
  // This ensures React can serialize it properly to the client component
  const postAny = post as any;
  
  const formattedPost = {
    id: post.id,
    title: post.title || "",
    slug: post.slug || "",
    excerpt: post.excerpt || null,
    // Map all snake_case fields to camelCase, handling both formats
    metaTitle: postAny.meta_title || postAny.metaTitle || null,
    metaDescription: postAny.meta_description || postAny.metaDescription || null,
    primaryKeyword: postAny.primary_keyword || postAny.primaryKeyword || null,
    secondaryKeywords: postAny.secondary_keywords || postAny.secondaryKeywords || null,
    searchIntent: postAny.search_intent || postAny.searchIntent || null,
    content: post.content || "",
    featuredImage: postAny.featured_image || postAny.featuredImage || null,
    featuredImageAlt: postAny.featured_image_alt || postAny.featuredImageAlt || null,
    featuredImageCaption: postAny.featured_image_caption || postAny.featuredImageCaption || null,
    category: post.category || null,
    tags: post.tags || null,
    status: post.status || "draft",
    // Handle isFeatured - could be is_featured (snake_case) or isFeatured (camelCase)
    isFeatured: postAny.is_featured ?? postAny.isFeatured ?? 0,
    // CRITICAL: Convert publishDate to string - React cannot serialize Date objects
    publishDate: formatDateToString(postAny.publish_date || postAny.publishDate),
    schemaType: postAny.schema_type || postAny.schemaType || null,
  };

  return (
    <div>
      <h1 className="text-3xl font-serif font-semibold text-[#09090b] mb-8">
        Edit Blog Post
      </h1>
      <BlogForm initialData={formattedPost} existingTags={tags} />
    </div>
  );
}
