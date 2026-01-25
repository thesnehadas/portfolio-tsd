"use client";

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

/**
 * ToolsSection Component (renamed to Systems)
 * 
 * Clones the "Systems" section of the website with pixel-perfect accuracy.
 * Features:
 * - Retro-inspired card-style buttons with colored window controls.
 * - Light cream background (retro-cream: #fdfaf3).
 * - Thick brown borders (retro-brown: #4a3728).
 * - Offset shadow hover effects.
 * - Responsive grid layout.
 */

interface ToolCardProps {
  title: string;
  description: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ title, description }) => {
  return (
    <button className="group text-left bg-[#fdfaf3] border-2 border-[#4a3728]/30 rounded-lg p-6 transition-all duration-200 hover:border-[#4a3728] hover:shadow-[4px_4px_0px_#4a3728] w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#4a3728]">
      {/* Retro Window Dots */}
      <div className="flex items-center gap-1.5 mb-4">
        <div className="w-2.5 h-2.5 rounded-full bg-[#e15b5b]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#f1c40f]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#2ecc71]"></div>
      </div>
      
      {/* Title and Icon */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-base font-serif font-semibold text-[#09090b] leading-tight max-w-[90%]">
          {title}
        </h4>
        <ArrowUpRight 
          className="h-4 w-4 text-[#4a3728] opacity-0 -translate-y-1 translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 shrink-0" 
        />
      </div>
      
      {/* Description */}
      <p className="text-sm text-[#71717a] font-light leading-relaxed">
        {description}
      </p>
    </button>
  );
};

const ToolsSection: React.FC = () => {
  const freeTools = [
    {
      title: "AI Marketing Workflow Toolkit",
      description: "How to use ChatGPT to speed up your marketing processes."
    },
    {
      title: "BS-Proof Attribution Checklist",
      description: "A tool to help you challenge your current attribution measurements."
    },
    {
      title: "Marketing Feature Engineering Handbook",
      description: "A compact, high-utility reference guide for data people working on marketing problems."
    }
  ];

  const paidTools = [
    {
      title: '"Marketing Experiment Lab" Toolkit',
      description: "Run proper experiments and measure true incremental impact."
    },
    {
      title: "Retail Demand & Promo Simulator – Lite",
      description: "Simulate demand scenarios and optimize your promo calendar."
    },
    {
      title: "Startup Pitch Generator",
      description: "AI-powered tool to generate and refine investor-ready pitches."
    },
    {
      title: "MMM for Humans",
      description: "Understand your marketing mix without a PhD in statistics."
    }
  ];

  return (
    <section id="systems" className="py-10 md:py-12 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-4">
        <h2 className="text-3xl md:text-4xl font-serif text-[#09090b]">Systems</h2>
      </div>

      {/* Free Category */}
      <div className="mb-16">
        <p className="text-sm uppercase tracking-[0.15em] text-[#71717a] mb-6 font-sans font-medium">
          Free
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {freeTools.map((tool, index) => (
            <ToolCard key={`free-${index}`} title={tool.title} description={tool.description} />
          ))}
        </div>
      </div>

      {/* Paid Category */}
      <div>
        <p className="text-sm uppercase tracking-[0.15em] text-[#71717a] mb-6 font-sans font-medium">
          Paid
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paidTools.map((tool, index) => (
            <ToolCard key={`paid-${index}`} title={tool.title} description={tool.description} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;