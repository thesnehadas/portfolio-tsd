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

  // Ensure all fields are properly formatted for the form
  const formattedPost = {
    ...post,
    // Ensure publishDate is handled correctly
    publishDate: post.publishDate 
      ? (typeof post.publishDate === 'string' ? post.publishDate : post.publishDate.toISOString())
      : null,
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
