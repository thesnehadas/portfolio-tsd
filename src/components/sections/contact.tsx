"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * ContactSection Component
 * Returns a pixel-perfect clone of the contact section with a retro OS window aesthetic.
 * 
 * Theme: Light
 * Design: Vintage OS window frame "contact.exe"
 */
const ContactSection: React.FC = () => {
  return (
    <section 
      id="contact" 
      className="py-10 md:py-12 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto"
      style={{
        display: 'block',
        position: 'static',
        width: '100%',
        margin: '0 auto',
        padding: '2.5rem 1.5rem', // py-10 matches computed styles but keeps horizontal padding
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Retro Window Container */}
        <div 
          className="retro-window bg-retro-cream border-2 border-retro-brown rounded-lg overflow-hidden shadow-retro"
          style={{
            backgroundColor: '#fdfaf3',
            border: '2px solid #4a3728',
            borderRadius: '0.5rem',
            boxShadow: '4px 4px 0px #4a3728',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          {/* Title Bar */}
          <div 
            className="retro-title-bar flex items-center justify-between px-3 py-2 bg-retro-cream border-b-2 border-retro-brown"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'between',
              paddingLeft: '0.75rem',
              paddingRight: '0.75rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              backgroundColor: '#fdfaf3',
              borderBottom: '2px solid #4a3728',
            }}
          >
            <span 
              className="text-sm font-sans tracking-wide"
              style={{
                fontSize: '0.875rem',
                fontFamily: 'var(--font-sans)',
                color: '#4a3728',
                letterSpacing: '0.025em',
              }}
            >
              Contact me.exe
            </span>
            
            {/* Window Controls */}
            <div className="flex items-center gap-1.5" style={{ display: 'flex', gap: '0.375rem' }}>
              <button 
                className="w-4 h-4 border-2 border-retro-brown rounded-sm bg-retro-cream flex items-center justify-center transition-colors hover:bg-black/5"
                style={{
                  width: '1rem',
                  height: '1rem',
                  border: '2px solid #4a3728',
                  borderRadius: '0.125rem',
                  backgroundColor: '#fdfaf3',
                }}
              >
                <span style={{ fontSize: '10px', color: '#4a3728', lineHeight: '1' }}>_</span>
              </button>
              <button 
                className="w-4 h-4 border-2 border-retro-brown rounded-sm bg-retro-cream flex items-center justify-center transition-colors hover:bg-black/5"
                style={{
                  width: '1rem',
                  height: '1rem',
                  border: '2px solid #4a3728',
                  borderRadius: '0.125rem',
                  backgroundColor: '#fdfaf3',
                }}
              >
                <span style={{ fontSize: '10px', color: '#4a3728', lineHeight: '1' }}>□</span>
              </button>
              <button 
                className="w-4 h-4 border-2 border-retro-brown rounded-sm bg-retro-cream flex items-center justify-center transition-colors hover:bg-black/5"
                style={{
                  width: '1rem',
                  height: '1rem',
                  border: '2px solid #4a3728',
                  borderRadius: '0.125rem',
                  backgroundColor: '#fdfaf3',
                }}
              >
                <span style={{ fontSize: '10px', color: '#4a3728', lineHeight: '1' }}>×</span>
              </button>
            </div>
          </div>

          {/* Window Content */}
          <div className="p-6 md:p-10" style={{ padding: '2.5rem 1.5rem' }}>
            <h2 
              className="text-3xl md:text-4xl mb-6 font-display"
              style={{
                fontSize: 'clamp(1.875rem, 4vw, 2.25rem)',
                marginBottom: '1.5rem',
                color: '#4a3728',
                lineHeight: '1.2',
                fontWeight: '400',
              }}
            >
              Let&apos;s talk
            </h2>
            
            <p 
              className="text-lg text-muted-foreground font-light leading-relaxed mb-10"
              style={{
                fontSize: '1.125rem',
                color: '#71717a',
                lineHeight: '1.625',
                fontWeight: '300',
                marginBottom: '2.5rem',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Building something with AI and need a second brain? Let&apos;s talk!
            </p>

            <a 
              href="https://calendar.app.google/vXojVNrChx8WhY5P8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-foreground text-background hover:bg-foreground/90 font-medium tracking-wide rounded-sm h-12 px-10 text-base group"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                backgroundColor: '#09090b',
                color: '#ffffff',
                height: '3rem',
                paddingLeft: '2.5rem',
                paddingRight: '2.5rem',
                borderRadius: '0.125rem',
                fontSize: '1rem',
                fontWeight: '500',
                letterSpacing: '0.025em',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              Get in touch
              <ArrowRight 
                className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" 
                style={{ 
                  marginLeft: '0.5rem',
                  width: '1rem',
                  height: '1rem' 
                }} 
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
