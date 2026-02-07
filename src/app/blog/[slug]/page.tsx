import React from "react";
import Footer from "@/components/sections/footer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let post = null;

  try {
    [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);

    // Only show published posts (or allow draft in development)
    if (!post || (post.status !== 'published' && process.env.NODE_ENV === 'production')) {
      notFound();
    }
  } catch (error) {
    console.error("Error fetching blog post:", error);
    notFound();
  }

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    const d = typeof date === 'string' ? new Date(date) : date;
    const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", 
                   "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <main className="pt-0">
        <div className="bg-[#18181b] min-h-screen">
          <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-24 py-16">
            {/* Back Button */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white/80 transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to blog
            </Link>

            {/* Date */}
            <span className="text-white/40 text-xs mb-4 block">
              {formatDate(post.publishDate || post.createdAt)}
            </span>

            {/* Title */}
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-serif italic mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Description/Excerpt */}
            {post.excerpt && (
              <p className="text-white/60 font-light text-lg mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="mb-12 w-full">
                <img
                  src={post.featuredImage}
                  alt={post.featuredImageAlt || post.title}
                  className="w-full h-auto"
                />
                {post.featuredImageCaption && (
                  <p className="text-white/40 text-sm mt-2 italic">
                    {post.featuredImageCaption}
                  </p>
                )}
              </div>
            )}

            {/* Content - Rendered Markdown */}
            <div className="prose prose-invert max-w-none w-full">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Custom styling for markdown elements
                  h1: ({ node, ...props }) => (
                    <h1 className="text-white text-3xl md:text-4xl font-serif italic mt-12 mb-6" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-white text-2xl md:text-3xl font-serif italic mt-12 mb-6" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-white text-xl md:text-2xl font-serif italic mt-8 mb-4" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="text-white/80 font-light leading-relaxed mb-6" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="text-white/80 font-light leading-relaxed mb-6 space-y-3 list-disc list-inside" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="text-white/80 font-light leading-relaxed mb-6 space-y-3 list-decimal list-inside" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-white/80 font-light" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="text-white font-medium" {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a className="text-white/80 underline hover:text-white transition-colors" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-white/30 pl-4 italic text-white/70 my-6" {...props} />
                  ),
                  code: ({ node, inline, ...props }: any) => {
                    if (inline) {
                      return (
                        <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono text-white/90" {...props} />
                      );
                    }
                    return (
                      <code className="block bg-white/10 p-4 rounded text-sm font-mono text-white/90 overflow-x-auto my-6" {...props} />
                    );
                  },
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
