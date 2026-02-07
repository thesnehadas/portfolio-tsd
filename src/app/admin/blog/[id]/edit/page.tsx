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

  // Strip non-serializable fields from tags (e.g., createdAt Date objects)
  const safeTags = (tags as Array<{ id: string; name: string }>).map((tag: any) => ({
    id: String(tag.id),
    name: String(tag.name),
  }));

  // CRITICAL: Serialize the entire post object to convert ALL Date objects to ISO strings
  // This ensures React can serialize it properly to the client component
  // JSON.parse(JSON.stringify()) converts Date objects to ISO string format
  const serializedPost = JSON.parse(JSON.stringify(post));

  // Helper function to convert ISO date string to YYYY-MM-DD format for HTML date inputs
  const formatDateToDateString = (dateStr: string | null): string | null => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    } catch {
      return null;
    }
    return null;
  };

  // Map all fields from serialized post (all dates are now strings)
  const formattedPost = {
    id: String(serializedPost.id || ""),
    title: String(serializedPost.title || ""),
    slug: String(serializedPost.slug || ""),
    excerpt: serializedPost.excerpt ? String(serializedPost.excerpt) : null,
    // Map all snake_case fields to camelCase, handling both formats
    metaTitle: serializedPost.meta_title || serializedPost.metaTitle || null,
    metaDescription: serializedPost.meta_description || serializedPost.metaDescription || null,
    primaryKeyword: serializedPost.primary_keyword || serializedPost.primaryKeyword || null,
    secondaryKeywords: serializedPost.secondary_keywords || serializedPost.secondaryKeywords || null,
    searchIntent: serializedPost.search_intent || serializedPost.searchIntent || null,
    content: String(serializedPost.content || ""),
    featuredImage: serializedPost.featured_image || serializedPost.featuredImage || null,
    featuredImageAlt: serializedPost.featured_image_alt || serializedPost.featuredImageAlt || null,
    featuredImageCaption: serializedPost.featured_image_caption || serializedPost.featuredImageCaption || null,
    category: serializedPost.category || null,
    tags: serializedPost.tags || null,
    status: String(serializedPost.status || "draft"),
    // Handle isFeatured - could be is_featured (snake_case) or isFeatured (camelCase)
    isFeatured: Number(serializedPost.is_featured ?? serializedPost.isFeatured ?? 0),
    // Convert ISO date string to YYYY-MM-DD format for HTML date input
    publishDate: formatDateToDateString(serializedPost.publish_date || serializedPost.publishDate),
    schemaType: serializedPost.schema_type || serializedPost.schemaType || null,
  };

  return (
    <div>
      <h1 className="text-3xl font-serif font-semibold text-[#09090b] mb-8">
        Edit Blog Post
      </h1>
      <BlogForm initialData={formattedPost} existingTags={safeTags} />
    </div>
  );
}
