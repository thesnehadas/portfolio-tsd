"use client";

import React from 'react';

/**
 * Header component for snehadas.ai
 * Featuring glassmorphism effect, logo, and navigation links.
 */
const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-transparent">
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-24 py-6 flex items-center justify-between h-[68px]">
        {/* Logo Section */}
        <a 
          href="/" 
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <img 
            src="/otherlogos/name_logo.gif" 
            alt="snehadas.ai" 
            className="h-12 md:h-14 w-auto"
          />
        </a>

          {/* Navigation Section */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#offers"
              className="link-underline text-sm font-medium text-[#7c736a] hover:text-[#221f1c] transition-colors"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              What I Do
            </a>
            <a
              href="#case-studies"
              className="link-underline text-sm font-medium text-[#7c736a] hover:text-[#221f1c] transition-colors"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              Case Studies
            </a>
            <a
              href="#systems"
              className="link-underline text-sm font-medium text-[#7c736a] hover:text-[#221f1c] transition-colors"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              Systems
            </a>
            <a
              href="/blog"
              className="link-underline text-sm font-medium text-[#7c736a] hover:text-[#221f1c] transition-colors"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              Blog
            </a>
            <a
              href="#about"
              className="link-underline text-sm font-medium text-[#7c736a] hover:text-[#221f1c] transition-colors"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              About me
            </a>
          </nav>

        {/* Mobile Menu Button (Optional/Hidden in Desktop per screenshot) */}
        <div className="md:hidden flex items-center">
          <button 
            type="button" 
            className="text-[#7c736a] hover:text-[#221f1c]"
            aria-label="Toggle menu"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx global>{`
        .link-underline {
          position: relative;
          text-decoration: none;
        }

        .link-underline::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 1px;
          bottom: -2px;
          left: 0;
          background-color: currentColor;
          transform: scaleX(0);
          transform-origin: bottom right;
          transition: transform 0.3s ease-out;
        }

        .link-underline:hover::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }
      `}</style>
    </header>
  );
};

export default Header;