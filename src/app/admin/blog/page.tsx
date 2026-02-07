import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogPage() {
  let allPosts = [];
  let error = null;

  try {
    allPosts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  } catch (err: any) {
    console.error("Error fetching blog posts:", err);
    error = err.message || "Failed to load blog posts";
    // If table doesn't exist, show helpful message
    if (err.message?.includes("does not exist") || err.message?.includes("relation") || err.code === "42P01") {
      error = "Database tables not set up. Please run migrations in Supabase.";
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-[#09090b] mb-2">
            Blog Posts
          </h1>
          <p className="text-[#71717a]">Manage your blog articles and content</p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-[#09090b] text-white hover:bg-[#09090b]/90">
            <Plus className="w-4 h-4 mr-2" />
            New Blog Post
          </Button>
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 font-medium mb-2">Setup Required</p>
          <p className="text-yellow-700 text-sm">{error}</p>
          <p className="text-yellow-700 text-sm mt-2">
            Please run the SQL migration from{" "}
            <code className="bg-yellow-100 px-1 rounded">drizzle/0000_flashy_tusk.sql</code>{" "}
            in your Supabase SQL Editor.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {!error && allPosts.length === 0 ? (
          <div className="text-center py-12 text-[#71717a]">
            <p>No blog posts yet. Create your first one!</p>
          </div>
        ) : !error ? (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#f4f4f5]">
                <tr>
                  <th className="text-left p-4 font-semibold text-[#09090b]">Title</th>
                  <th className="text-left p-4 font-semibold text-[#09090b]">Slug</th>
                  <th className="text-left p-4 font-semibold text-[#09090b]">Status</th>
                  <th className="text-left p-4 font-semibold text-[#09090b]">Featured</th>
                  <th className="text-left p-4 font-semibold text-[#09090b]">Publish Date</th>
                  <th className="text-left p-4 font-semibold text-[#09090b]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allPosts.map((post: any) => (
                  <tr key={post.id} className="border-t hover:bg-[#fafafa]">
                    <td className="p-4">
                      <div className="font-medium text-[#09090b]">{post.title}</div>
                      {post.excerpt && (
                        <div className="text-sm text-[#71717a] mt-1 line-clamp-1">
                          {post.excerpt}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-sm text-[#71717a] font-mono">{post.slug}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          post.status === "published"
                            ? "bg-green-100 text-green-800"
                            : post.status === "draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {post.isFeatured === 1 ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-[#71717a]">No</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-[#71717a]">
                      {(() => {
                        const date = post.publish_date || post.publishDate;
                        if (!date) return "--";
                        const dateObj = date instanceof Date ? date : new Date(date);
                        return isNaN(dateObj.getTime()) ? "--" : dateObj.toLocaleDateString();
                      })()}
                    </td>
                    <td className="p-4">
                      <Link href={`/admin/blog/${post.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
