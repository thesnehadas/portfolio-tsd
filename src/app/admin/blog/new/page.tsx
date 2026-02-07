import { db } from "@/lib/db";
import { blogTags } from "@/lib/db/schema";
import { BlogForm } from "@/components/admin/blog-form";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function NewBlogPage() {
  const tags = await db.select().from(blogTags).orderBy(blogTags.name);

  return (
    <div>
      <h1 className="text-3xl font-serif font-semibold text-[#09090b] mb-8">
        New Blog Post
      </h1>
      <BlogForm existingTags={tags} />
    </div>
  );
}
