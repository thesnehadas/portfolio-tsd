"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * HeroSection Component
 * 
 * A minimalistic hero section featuring:
 * - A name tag "Arthur Mello"
 * - Large serif headline "I build AI systems that make marketing better"
 * - Detailed subtext
 * - Primary "Get in touch" CTA with arrow icon
 * - Secondary "What I do" link
 * 
 * Adheres to the light theme and editorial layout specified in the design instructions.
 */

const HeroSection: React.FC = () => {
  return (
    <section 
      className="min-h-[70vh] flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-5xl mx-auto pb-4 pt-24 md:pt-32"
      style={{
        backgroundColor: 'transparent',
      }}
    >
      {/* Name Tag / Breadcrumb */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
        <p 
          className="text-sm uppercase mb-6 font-sans"
          style={{
            letterSpacing: '0.2em',
            color: '#71717a', // Derived from computed styles muted-foreground
            fontSize: '14px',
          }}
        >
          Arthur Mello
        </p>
      </div>

      {/* Main Headline */}
      <h1 
        className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mb-6 text-balance animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 ease-out fill-mode-both"
        style={{
          color: '#09090b', // Primary foreground
          fontWeight: 400,
        }}
      >
        I build AI systems that make marketing better.
      </h1>

      {/* Subtext */}
      <p 
        className="text-lg md:text-xl max-w-2xl mb-10 font-sans font-light leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 ease-out fill-mode-both"
        style={{
          color: '#71717a', // Muted foreground
        }}
      >
        AI agents, causal inference and MMM for teams who want results instead of endless POCs.
      </p>

      {/* Call to Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 ease-out fill-mode-both">
        {/* Primary Action */}
        <a 
          href="#contact" 
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 group px-8 h-11 rounded-sm"
          style={{
            backgroundColor: '#09090b',
            color: '#ffffff',
            fontWeight: 500,
            letterSpacing: '0.025em',
          }}
        >
          Get in touch
          <ArrowRight 
            className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" 
            strokeWidth={2}
          />
        </a>

        {/* Secondary Action */}
        <a 
          href="#offers" 
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 px-8 h-11 rounded-sm border hover:bg-black/5"
          style={{
            borderColor: 'rgba(9, 9, 11, 0.3)',
            color: '#09090b',
            fontWeight: 500,
            letterSpacing: '0.025em',
          }}
        >
          What I do
        </a>
      </div>
    </section>
  );
};

export default HeroSection;