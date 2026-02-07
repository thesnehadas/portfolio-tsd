import Header from "@/components/sections/header";
import BlogSignalSection from "@/components/sections/blog-signal";
import ContactSection from "@/components/sections/contact";
import Footer from "@/components/sections/footer";
import Link from "next/link";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogPage() {
  let posts = [];

  try {
    // Fetch only published posts, ordered by publish date (or created date if no publish date)
    const allPosts = await db
      .select({
        id: blogPosts.id,
        slug: blogPosts.slug,
        title: blogPosts.title,
        excerpt: blogPosts.excerpt,
        featuredImage: blogPosts.featuredImage,
        publishDate: blogPosts.publishDate,
        createdAt: blogPosts.createdAt,
      })
      .from(blogPosts)
      .where(eq(blogPosts.status, 'published'));
    
    // Sort by publishDate first, then createdAt, descending
    posts = allPosts.sort((a, b) => {
      const dateA = a.publishDate || a.createdAt;
      const dateB = b.publishDate || b.createdAt;
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    // If database error, show empty state
    posts = [];
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
      <Header />
      <main className="pt-20">
        <BlogSignalSection showButton={false} />
        <div className="bg-[#18181b] pb-24 px-6 md:px-12 lg:px-24 -mt-8 md:-mt-12">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-white/60 text-sm uppercase tracking-[0.2em] mb-12">Recent Articles</h3>
            {posts.length === 0 ? (
              <div className="text-center py-12 text-white/60">
                <p>No published articles yet.</p>
              </div>
            ) : (
              <div className="grid gap-12">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group border-t border-white/10 pt-8 flex flex-col md:flex-row gap-6 md:gap-8 hover:opacity-90 transition-opacity"
                  >
                    {/* Content - Left Side */}
                    <div className="flex-1 flex flex-col">
                      <span className="text-white/40 text-xs mb-2 block">
                        {formatDate(post.publishDate || post.createdAt)}
                      </span>
                      <h4 className="text-white text-xl font-serif italic mb-4 group-hover:text-white/80 transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-white/60 font-light mb-4 flex-grow">
                        {post.excerpt || "Read more..."}
                      </p>
                      <div className="w-10 h-[1px] bg-white/20 group-hover:w-20 transition-all duration-500"></div>
                    </div>

                    {/* Featured Image - Right Side */}
                    {post.featuredImage && (
                      <div className="flex-shrink-0 w-full md:w-64 lg:w-80 overflow-hidden rounded-sm">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
