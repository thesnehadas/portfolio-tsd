"use client";

import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section 
      id="about" 
      className="py-10 md:py-12 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto border-t border-[#e4e4e7] relative"
      style={{
        backgroundColor: 'transparent',
      }}
    >

      <h2 
        className="font-display text-2xl md:text-3xl mb-12 text-center"
        style={{
          color: 'rgb(34, 31, 28)',
          lineHeight: '1.2',
        }}
      >
        About me
      </h2>
      
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6 text-[#71717a] font-light leading-relaxed">
          <p className="text-base">
            I&apos;m an AI engineer at Jupiter (YC S19) from IIT Roorkee, building autonomous AI agents for marketing, outbound, and operations. I&apos;ve helped several brands including YC-backed startups and Shark Tank brands to automate and scale.
          </p>
      
          <p className="text-base">
            I got into data during IIT JEE prep, analyzing thousands of questions to crack the exam in 4 months. When I discovered LangGraph and n8n, I could finally build systems that acted autonomously.
          </p>
        </div>
        
        <div className="space-y-6 text-[#71717a] font-light leading-relaxed mt-8">
          <p className="text-base">
            Some things I&apos;ve built:
          </p>
          
          <ul className="space-y-3 pt-3">
            <li className="flex items-center gap-4 text-[#71717a] font-light text-base">
              <span 
                className="w-1.5 h-1.5 rounded-full bg-[#09090b]/30 flex-shrink-0" 
                aria-hidden="true"
              />
              Multi-channel outbound automation agents for personalized prospecting
            </li>
            <li className="flex items-center gap-4 text-[#71717a] font-light text-base">
              <span 
                className="w-1.5 h-1.5 rounded-full bg-[#09090b]/30 flex-shrink-0" 
                aria-hidden="true"
              />
              SEO strategy agents for keyword analysis and ranking
            </li>
            <li className="flex items-center gap-4 text-[#71717a] font-light text-base">
              <span 
                className="w-1.5 h-1.5 rounded-full bg-[#09090b]/30 flex-shrink-0" 
                aria-hidden="true"
              />
              Lead quality analysis agents with signal identification
            </li>
            <li className="flex items-center gap-4 text-[#71717a] font-light text-base">
              <span 
                className="w-1.5 h-1.5 rounded-full bg-[#09090b]/30 flex-shrink-0" 
                aria-hidden="true"
              />
              Multi-agent customer support chatbots for WhatsApp and Web
            </li>
            <li className="flex items-center gap-4 text-[#71717a] font-light text-base">
              <span 
                className="w-1.5 h-1.5 rounded-full bg-[#09090b]/30 flex-shrink-0" 
                aria-hidden="true"
              />
              AI agents for competitor analysis and SEO content generation
            </li>
          </ul>
          
          <p className="text-base">
            When I&apos;m not building systems, I&apos;m watching podcasts on psychology or mythology, reading fiction and leadership books, writing shayaris, singing, or caring for my pets.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;