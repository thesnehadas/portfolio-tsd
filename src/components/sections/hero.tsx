"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

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

const mediaOutlets = [
  {
    name: 'Josh Talks',
    logo: '/otherlogos/Josh_Talk_Logo.png',
    url: 'https://www.youtube.com/watch?si=25wNCALX3c3Wmxz0&v=uO-YEcGW1KU&feature=youtu.be'
  },
  {
    name: 'Aaj Tak',
    logo: '/otherlogos/Aaj_tak_logo.png',
    url: 'https://www.aajtak.in/education/news/story/kota-helped-me-get-out-of-depression-cracked-jee-after-breakup-read-success-story-of-iit-student-1807271-2023-10-27'
  },
  {
    name: 'News18',
    logo: '/otherlogos/news18_logo.png',
    url: 'https://hindi.news18.com/news/career/success-story-of-iit-student-sneha-das-kota-coaching-factory-helped-her-crack-jee-iit-roorkee-admission-after-breakup-story-7782187.html'
  },
  {
    name: 'News24',
    logo: '/otherlogos/News24_logo.svg',
    url: 'https://news24online.com/education/girl-cracks-iit-exams-the-real-story-of-thukra-ke-mera-pyar/184954/'
  }
];

const HeroSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaOutlets.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const currentOutlet = mediaOutlets[currentIndex];

  return (
    <section 
      className="min-h-[70vh] flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-5xl mx-auto pb-4 pt-24 md:pt-32 relative"
      style={{
        backgroundColor: 'transparent',
      }}
    >
      {/* Name Tag / Breadcrumb */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
        <div 
          className="text-sm uppercase mb-6 font-sans flex items-center gap-2"
          style={{
            letterSpacing: '0.2em',
            color: '#71717a', // Derived from computed styles muted-foreground
            fontSize: '14px',
          }}
        >
          <span>Sneha Das</span>
          <span>|</span>
          <img 
            src="/otherlogos/iit_roorkee_logo.svg" 
            alt="IIT Roorkee" 
            className="h-4 w-auto"
          />
          <span style={{ color: '#D4AF37' }}>IIT Roorkee</span>
        </div>
      </div>

      {/* Main Headline */}
      <h1 
        className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mb-6 text-balance animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 ease-out fill-mode-both"
        style={{
          color: '#09090b', // Primary foreground
          fontWeight: 400,
        }}
      >
        Time is money; I build AI systems that save you both.
      </h1>

      {/* Subtext */}
      <p 
        className="text-lg md:text-xl max-w-2xl mb-10 font-sans font-light leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 ease-out fill-mode-both"
        style={{
          color: '#71717a', // Muted foreground
        }}
      >
        AI infrastructure for pipeline generation, sales acceleration, and operational efficiency that drives measurable outcomes.
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

      {/* Media Outlets Tag - Bottom Right */}
      <a
        href={currentOutlet.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-8 right-6 md:right-12 lg:right-24 flex items-center gap-1.5 text-xs font-sans hover:opacity-80 transition-all duration-500 group"
        style={{
          color: '#71717a',
        }}
        key={currentIndex}
      >
        <span>Know more about me on</span>
        <span style={{ color: '#71717a' }}>{currentOutlet.name}</span>
        <img 
          src={currentOutlet.logo} 
          alt={currentOutlet.name} 
          className="h-4 w-auto transition-opacity duration-500"
        />
        <ArrowUpRight 
          className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
          strokeWidth={1.5}
          style={{ color: '#71717a' }}
        />
      </a>
    </section>
  );
};

export default HeroSection;