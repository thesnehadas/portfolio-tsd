import Header from "@/components/sections/header";
import BlogSignalSection from "@/components/sections/blog-signal";
import ContactSection from "@/components/sections/contact";
import Footer from "@/components/sections/footer";
import Link from "next/link";

export default function BlogPage() {
  const blogPosts = [
    {
      slug: "first-rule-of-ai-agents",
      date: "MARCH 2024",
      title: "The First Rule of AI Agents is: You Don't Build AI Agents",
      description: "Why building monolithic agents is a mistake and how to think about modularity in AI engineering.",
      featuredImage: "/blog-images/630x1200.png",
    },
    {
      slug: "causal-inference-mmm",
      date: "FEBRUARY 2024",
      title: "Causal Inference in Marketing Mix Modeling",
      description: "Moving beyond correlations to understand the true impact of marketing spend using causal graphs.",
      featuredImage: "/blog-images/causal-inference-mmm.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header />
      <main className="pt-20">
        <BlogSignalSection showButton={false} />
        <div className="bg-[#18181b] pb-24 px-6 md:px-12 lg:px-24 -mt-8 md:-mt-12">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-white/60 text-sm uppercase tracking-[0.2em] mb-12">Recent Articles</h3>
            <div className="grid gap-12">
              {blogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group border-t border-white/10 pt-8 flex flex-col md:flex-row gap-6 md:gap-8 hover:opacity-90 transition-opacity"
                >
                  {/* Content - Left Side */}
                  <div className="flex-1 flex flex-col">
                    <span className="text-white/40 text-xs mb-2 block">{post.date}</span>
                    <h4 className="text-white text-xl font-serif italic mb-4 group-hover:text-white/80 transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-white/60 font-light mb-4 flex-grow">{post.description}</p>
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
        </div>
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
