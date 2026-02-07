import Header from "@/components/sections/header";
import BlogSignalSection from "@/components/sections/blog-signal";
import ContactSection from "@/components/sections/contact";
import Footer from "@/components/sections/footer";
import Link from "next/link";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { CategoryFilter } from "@/components/blog/category-filter";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const selectedCategory = params.category || "all";
  
  let posts = [];
  let categories: string[] = [];
  let featuredPosts: typeof posts = [];
  let allArticles: typeof posts = [];

  try {
    // Fetch only published posts with all needed fields
    const allPosts = await db
      .select({
        id: blogPosts.id,
        slug: blogPosts.slug,
        title: blogPosts.title,
        excerpt: blogPosts.excerpt,
        featuredImage: blogPosts.featuredImage,
        publishDate: blogPosts.publishDate,
        createdAt: blogPosts.createdAt,
        isFeatured: blogPosts.isFeatured,
        category: blogPosts.category,
      })
      .from(blogPosts)
      .where(eq(blogPosts.status, 'published'));
    
    // Extract unique categories
    const categorySet = new Set<string>();
    allPosts.forEach((post) => {
      if (post.category) {
        categorySet.add(post.category);
      }
    });
    categories = Array.from(categorySet).sort();
    
    // Sort all posts by publishDate first, then createdAt, descending
    const sortedPosts = allPosts.sort((a, b) => {
      const dateA = a.publishDate || a.createdAt;
      const dateB = b.publishDate || b.createdAt;
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
    
    // Featured articles always show (not filtered by category)
    featuredPosts = sortedPosts.filter((post) => post.isFeatured === 1);
    
    // Filter all articles by category if selected
    if (selectedCategory !== "all") {
      allArticles = sortedPosts.filter((post) => post.category === selectedCategory);
    } else {
      allArticles = sortedPosts;
    }
    
    posts = allArticles;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    // If database error, show empty state
    posts = [];
    featuredPosts = [];
    allArticles = [];
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
            {/* Category Filter */}
            <Suspense fallback={<div className="mb-12 h-12" />}>
              <CategoryFilter categories={categories} />
            </Suspense>

            {/* Featured Articles Section */}
            {featuredPosts.length > 0 && (
              <div className="mb-16">
                <h3 className="text-white/60 text-sm uppercase tracking-[0.2em] mb-8">Featured Articles</h3>
                <div className="grid gap-12">
                  {featuredPosts.map((post) => (
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
              </div>
            )}

            {/* All Articles Section */}
            <div>
              <h3 className="text-white/60 text-sm uppercase tracking-[0.2em] mb-8">
                {selectedCategory !== "all" ? `${selectedCategory} Articles` : "All Articles"}
              </h3>
              {allArticles.length === 0 ? (
                <div className="text-center py-12 text-white/60">
                  <p>
                    {selectedCategory !== "all" 
                      ? `No articles found in "${selectedCategory}" category.`
                      : "No published articles yet."}
                  </p>
                </div>
              ) : (
                <div className="grid gap-12">
                  {allArticles.map((post) => (
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
        </div>
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
