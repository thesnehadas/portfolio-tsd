import React from 'react';
import { ArrowUpRight } from 'lucide-react';

/**
 * BlogCTA Component
 * 
 * Clones the dark themed "mind models" blog section with specific background color, 
 * inverted signal logo, and high-contrast button.
 * 
 * Theme: light (container is light, but the section itself is high-contrast dark)
 */
export default function BlogCTA() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-[#1F1B19] text-[#FBF9F6]">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl">
          {/* Retro window control dots */}
          <div className="flex items-center gap-1.5 mb-6">
            <div className="w-2.5 h-2.5 rounded-full bg-[#D94E4E]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#E6B34D]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#5A8C5A]"></div>
          </div>

          {/* Logo and Label */}
          <div className="flex items-center gap-3 mb-6">
            <img 
              src="/mind-models-logo-png.png" 
              alt="Mind Models logo" 
              className="h-8 md:h-10 w-auto"
            />
            <p className="text-sm uppercase tracking-[0.2em] text-[#FBF9F6]/60 font-sans font-medium">
              Blog
            </p>
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl mb-6 text-[#FBF9F6] font-display">
            mind models
          </h2>

          {/* Description */}
          <p className="text-lg text-[#FBF9F6]/70 font-sans font-light leading-relaxed mb-8">
            Reflections on AI engineering, lessons from building<br />
            and living, and figuring things along the way.
          </p>

          {/* CTA Button */}
          <a 
            href="/blog" 
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border bg-transparent rounded-md h-11 px-8 border-[#FBF9F6]/30 text-[#FBF9F6] hover:bg-[#FBF9F6] hover:text-[#1F1B19] group"
          >
            Read the blog
            <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}