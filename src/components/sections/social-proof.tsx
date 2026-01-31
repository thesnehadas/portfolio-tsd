"use client";

import React from 'react';
import Marquee from 'react-fast-marquee';

/**
 * SocialProofSection Component
 * 
 * Displays a row of company logos that the person has worked with.
 * Features a clean, minimal design with grayscale logos that can be colored on hover.
 * Logos scroll infinitely in a loop, with square logos not adjacent to each other.
 */
const SocialProofSection: React.FC = () => {
  // Square logos (FestBuzz, PeerHub, SBL, VJ Nucleus)
  const squareLogos = [
    { name: "FestBuzz", logo: "/trustedbylogos/festbuzz_logo.png" },
    { name: "PeerHub", logo: "/trustedbylogos/peerhub_logo.jpg" },
    { name: "SBL", logo: "/trustedbylogos/sbl_logo.jpeg" },
    { name: "VJ Nucleus", logo: "/trustedbylogos/vj_nucleus_logo.jpg" },
  ];

  // Other logos (Envito, Jupiter, SnapSight, UnfoldMart)
  const otherLogos = [
    { name: "Envito", logo: "/trustedbylogos/envito_logo.png" },
    { name: "Jupiter", logo: "/trustedbylogos/jupiter_logo.png" },
    { name: "SnapSight", logo: "/trustedbylogos/snapsight_logo.png" },
    { name: "UnfoldMart", logo: "/trustedbylogos/unfoldmart_logo.png" },
  ];

  // Arrange logos so square logos are not adjacent
  // Interleave: other, square, other, square, etc.
  const arrangedLogos: { name: string; logo: string }[] = [];
  const maxLength = Math.max(squareLogos.length, otherLogos.length);
  
  for (let i = 0; i < maxLength; i++) {
    if (i < otherLogos.length) {
      arrangedLogos.push(otherLogos[i]);
    }
    if (i < squareLogos.length) {
      arrangedLogos.push(squareLogos[i]);
    }
  }

  // Duplicate the array for seamless infinite scroll
  const duplicatedLogos = [...arrangedLogos, ...arrangedLogos];

  return (
    <section className="py-10 md:py-12 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto overflow-x-hidden w-full">
      {/* Section Header */}
      <div className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.15em] text-[#71717a] mb-4 font-sans font-medium">
          Trusted By
        </p>
      </div>

      {/* Company Logos - Infinite Scroll Marquee */}
      <div className="relative w-full" style={{ overflowX: 'hidden', overflowY: 'hidden' }}>
        <div style={{ overflowX: 'hidden', overflowY: 'visible', width: '100%' }}>
          <Marquee
            speed={50}
            gradient={false}
            pauseOnHover={true}
            className="py-4"
            style={{ overflowX: 'hidden', overflowY: 'visible' }}
          >
            {duplicatedLogos.map((company, index) => (
              <LogoItem key={`${company.name}-${index}`} company={company} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
};

// Logo component
const LogoItem: React.FC<{ company: { name: string; logo: string } }> = ({ company }) => {
  return (
    <div className="relative flex items-center justify-center h-12 md:h-16 mx-8 md:mx-12 opacity-60 hover:opacity-100 transition-opacity duration-200 group">
      <img
        src={company.logo}
        alt={company.name}
        className="h-full w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-200"
      />
    </div>
  );
};

export default SocialProofSection;
