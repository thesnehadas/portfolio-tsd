"use client";

import React from 'react';

/**
 * SocialProofSection Component
 * 
 * Displays a row of company logos that the person has worked with.
 * Features a clean, minimal design with grayscale logos that can be colored on hover.
 */
const SocialProofSection: React.FC = () => {
  // Placeholder company names - replace with actual logo URLs or company names
  const companies = [
    { name: "Company 1", logo: null },
    { name: "Company 2", logo: null },
    { name: "Company 3", logo: null },
    { name: "Company 4", logo: null },
    { name: "Company 5", logo: null },
    { name: "Company 6", logo: null },
  ];

  return (
    <section className="py-10 md:py-12 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.15em] text-[#71717a] mb-4 font-sans font-medium">
          Trusted By
        </p>
      </div>

      {/* Company Logos Row */}
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
        {companies.map((company, index) => (
          <div
            key={index}
            className="flex items-center justify-center h-12 md:h-16 opacity-60 hover:opacity-100 transition-opacity duration-200"
          >
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="h-full w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-200"
              />
            ) : (
              <div className="text-[#71717a] font-sans font-medium text-sm md:text-base">
                {company.name}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default SocialProofSection;
