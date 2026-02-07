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

  // Map snake_case database fields to camelCase form fields
  // Helper function to safely convert date to string
  const formatDateToString = (date: any): string | null => {
    if (!date) return null;
    if (typeof date === 'string') return date;
    if (date instanceof Date) {
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    }
    // Try to parse as date
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

  const formattedPost = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || null,
    metaTitle: (post as any).meta_title || (post as any).metaTitle || null,
    metaDescription: (post as any).meta_description || (post as any).metaDescription || null,
    primaryKeyword: (post as any).primary_keyword || (post as any).primaryKeyword || null,
    secondaryKeywords: (post as any).secondary_keywords || (post as any).secondaryKeywords || null,
    searchIntent: (post as any).search_intent || (post as any).searchIntent || null,
    content: post.content,
    featuredImage: (post as any).featured_image || (post as any).featuredImage || null,
    featuredImageAlt: (post as any).featured_image_alt || (post as any).featuredImageAlt || null,
    featuredImageCaption: (post as any).featured_image_caption || (post as any).featuredImageCaption || null,
    category: post.category || null,
    tags: post.tags || null,
    status: post.status,
    isFeatured: post.isFeatured,
    // Handle publishDate - ensure it's always a string or null, never a Date object
    publishDate: formatDateToString((post as any).publish_date || (post as any).publishDate),
    schemaType: (post as any).schema_type || (post as any).schemaType || null,
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
