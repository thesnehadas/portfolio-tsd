"use client";

import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section 
      id="about" 
      className="py-10 md:py-12 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto border-t border-[#e4e4e7]"
      style={{
        backgroundColor: 'transparent',
      }}
    >
      <h2 
        className="font-display text-2xl md:text-3xl mb-8 text-center"
        style={{
          color: 'rgb(34, 31, 28)',
          lineHeight: '1.2',
        }}
      >
        About me
      </h2>
      
      <div className="max-w-2xl mx-auto space-y-6 text-[#71717a] font-light leading-relaxed">
        <p className="text-base">
          I&apos;m a full-stack data scientist / AI engineer who works at the intersection of AI, marketing measurement and automation.
        </p>
        
        <p className="text-base">
          I specialize in helping teams ship fast: designing AI agents that deliver real value, building models that measure causality, and teaching data people how to build things.
        </p>
        
        <p className="text-base">
          Some of the things I&apos;ve done:
        </p>
        
        <ul className="space-y-3 py-4">
          <li className="flex items-center gap-4 text-[#71717a] font-light text-base">
            <span 
              className="w-1.5 h-1.5 rounded-full bg-[#09090b]/30 flex-shrink-0" 
              aria-hidden="true"
            />
            AI agents in production
          </li>
          <li className="flex items-center gap-4 text-[#71717a] font-light text-base">
            <span 
              className="w-1.5 h-1.5 rounded-full bg-[#09090b]/30 flex-shrink-0" 
              aria-hidden="true"
            />
            Media mix modeling for retail &amp; e-commerce
          </li>
          <li className="flex items-center gap-4 text-[#71717a] font-light text-base">
            <span 
              className="w-1.5 h-1.5 rounded-full bg-[#09090b]/30 flex-shrink-0" 
              aria-hidden="true"
            />
            RAG systems for enterprise knowledge bases
          </li>
          <li className="flex items-center gap-4 text-[#71717a] font-light text-base">
            <span 
              className="w-1.5 h-1.5 rounded-full bg-[#09090b]/30 flex-shrink-0" 
              aria-hidden="true"
            />
            Price elasticity estimation
          </li>
        </ul>
        
        <p className="text-base">
          Some of the tech I work with: Python, SQL and GCP.
        </p>
        
        <p className="text-base">
          When I&apos;m not building AI systems, you&apos;ll find me on the BJJ mats, lost in a good book, or{' '}
          <button 
            type="button"
            className="text-[#221f1c]/80 underline decoration-dashed underline-offset-4 hover:text-[#221f1c] transition-colors cursor-pointer bg-transparent border-none p-0 font-light"
          >
            playing games
          </button>.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;