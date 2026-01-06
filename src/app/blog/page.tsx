import Header from "@/components/sections/header";
import BlogSignalSection from "@/components/sections/blog-signal";
import ContactSection from "@/components/sections/contact";
import Footer from "@/components/sections/footer";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header />
      <main className="pt-20">
        <BlogSignalSection />
        <div className="bg-[#18181b] pb-24 px-6 md:px-12 lg:px-24">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-white/60 text-sm uppercase tracking-[0.2em] mb-12">Recent Articles</h3>
            <div className="grid gap-12">
              <div className="group border-t border-white/10 pt-8">
                <span className="text-white/40 text-xs mb-2 block">MARCH 2024</span>
                <h4 className="text-white text-xl font-serif italic mb-4 group-hover:text-white/80 transition-colors cursor-pointer">The First Rule of AI Agents is: You Don't Build AI Agents</h4>
                <p className="text-white/60 font-light max-w-2xl mb-4">Why building monolithic agents is a mistake and how to think about modularity in AI engineering.</p>
                <div className="w-10 h-[1px] bg-white/20 group-hover:w-20 transition-all duration-500"></div>
              </div>
              <div className="group border-t border-white/10 pt-8">
                <span className="text-white/40 text-xs mb-2 block">FEBRUARY 2024</span>
                <h4 className="text-white text-xl font-serif italic mb-4 group-hover:text-white/80 transition-colors cursor-pointer">Causal Inference in Marketing Mix Modeling</h4>
                <p className="text-white/60 font-light max-w-2xl mb-4">Moving beyond correlations to understand the true impact of marketing spend using causal graphs.</p>
                <div className="w-10 h-[1px] bg-white/20 group-hover:w-20 transition-all duration-500"></div>
              </div>
            </div>
          </div>
        </div>
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
