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

  // Helper function to safely convert ANY date-like value to YYYY-MM-DD string or null
  // This is critical - React cannot serialize Date objects to client components
  // Returns date in YYYY-MM-DD format for HTML date inputs
  const formatDateToDateString = (date: any): string | null => {
    if (!date) return null;
    
    let dateObj: Date | null = null;
    
    if (typeof date === 'string') {
      // If it's already a string, try to parse it
      dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return null;
      }
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      // Try to parse as date (handles timestamps, date-like objects, etc.)
      try {
        dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
          return null;
        }
      } catch {
        return null;
      }
    }
    
    // Convert to YYYY-MM-DD format for HTML date input
    if (dateObj && !isNaN(dateObj.getTime())) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    return null;
  };

  // Convert the raw post object to a plain object with all dates as strings
  // This ensures React can serialize it properly to the client component
  const postAny = post as any;
  
  // Get the publish date and convert it IMMEDIATELY
  const publishDateValue = postAny.publish_date || postAny.publishDate;
  const publishDateString = formatDateToDateString(publishDateValue);
  
  const formattedPost = {
    id: String(post.id || ""),
    title: String(post.title || ""),
    slug: String(post.slug || ""),
    excerpt: post.excerpt ? String(post.excerpt) : null,
    // Map all snake_case fields to camelCase, handling both formats
    metaTitle: (postAny.meta_title || postAny.metaTitle) ? String(postAny.meta_title || postAny.metaTitle) : null,
    metaDescription: (postAny.meta_description || postAny.metaDescription) ? String(postAny.meta_description || postAny.metaDescription) : null,
    primaryKeyword: (postAny.primary_keyword || postAny.primaryKeyword) ? String(postAny.primary_keyword || postAny.primaryKeyword) : null,
    secondaryKeywords: (postAny.secondary_keywords || postAny.secondaryKeywords) ? String(postAny.secondary_keywords || postAny.secondaryKeywords) : null,
    searchIntent: (postAny.search_intent || postAny.searchIntent) ? String(postAny.search_intent || postAny.searchIntent) : null,
    content: String(post.content || ""),
    featuredImage: (postAny.featured_image || postAny.featuredImage) ? String(postAny.featured_image || postAny.featuredImage) : null,
    featuredImageAlt: (postAny.featured_image_alt || postAny.featuredImageAlt) ? String(postAny.featured_image_alt || postAny.featuredImageAlt) : null,
    featuredImageCaption: (postAny.featured_image_caption || postAny.featuredImageCaption) ? String(postAny.featured_image_caption || postAny.featuredImageCaption) : null,
    category: post.category ? String(post.category) : null,
    tags: post.tags ? String(post.tags) : null,
    status: String(post.status || "draft"),
    // Handle isFeatured - could be is_featured (snake_case) or isFeatured (camelCase)
    isFeatured: Number(postAny.is_featured ?? postAny.isFeatured ?? 0),
    // CRITICAL: Convert publishDate to YYYY-MM-DD string format - React cannot serialize Date objects
    publishDate: publishDateString,
    schemaType: (postAny.schema_type || postAny.schemaType) ? String(postAny.schema_type || postAny.schemaType) : null,
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
