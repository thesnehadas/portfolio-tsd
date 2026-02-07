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
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  const tags = await db.select().from(blogTags).orderBy(blogTags.name);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-serif font-semibold text-[#09090b] mb-8">
        Edit Blog Post
      </h1>
      <BlogForm initialData={post} existingTags={tags} />
    </div>
  );
}
