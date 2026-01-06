import React from 'react';
import { ArrowUpRight } from 'lucide-react';

/**
 * BlogSignalSection Component
 * 
 * A high-contrast dark section for "the signal" blog.
 * Incorporates retro window controls, the signal logo icon, serif typography,
 * and an outlined "Read the blog" button.
 */
const BlogSignalSection = () => {
  return (
    <section 
      className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-[#18181b] text-[#ffffff]"
      aria-labelledby="blog-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl">
          {/* Retro Window Controls Motif */}
          <div className="flex items-center gap-1.5 mb-6">
            <div className="w-2.5 h-2.5 rounded-full bg-[hsl(0,45%,55%)]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[hsl(45,45%,55%)]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[hsl(120,30%,50%)]"></div>
          </div>

          {/* Label and Logo */}
          <div className="flex items-center gap-3 mb-6">
            <img 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/008c3d0b-88f7-4259-83d6-596df0a76090-arthurmello-ai/assets/icons/signal-logo-CvcImUgW-1.png" 
              alt="The Signal logo" 
              className="h-6 w-auto invert brightness-0 transition-all"
              style={{ filter: 'invert(1)' }}
            />
            <p className="text-sm uppercase tracking-[0.2em] text-white/60 font-sans font-medium">
              Blog
            </p>
          </div>

          {/* Heading */}
          <h2 
            id="blog-heading" 
            className="text-3xl md:text-4xl mb-6 text-white font-serif italic"
            style={{ 
              fontFamily: 'var(--font-display)', 
              fontWeight: 400,
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              lineHeight: '1.2'
            }}
          >
            the signal
          </h2>

          {/* Description */}
          <p className="text-lg text-white/70 font-light leading-relaxed mb-10 max-w-xl">
            A blog about building real AI systems for marketing: agents, models, experiments, and the engineering behind them.
          </p>

          {/* Outlined Button CTA */}
          <a 
            href="/blog" 
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white border border-white/30 bg-transparent rounded-md h-11 px-8 text-white hover:bg-white hover:text-[#18181b] group"
          >
            Read the blog
            <ArrowUpRight 
              className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" 
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default BlogSignalSection;