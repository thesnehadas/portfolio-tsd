import React from 'react';
import Link from 'next/link';
import { Linkedin, Instagram, Twitter, Youtube, Mail } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/thesnehadas/', icon: Linkedin },
    { label: 'Instagram', href: 'https://www.instagram.com/thesnehadas', icon: Instagram },
    { label: 'X', href: 'https://x.com/Sneha_IITR', icon: Twitter },
    { label: 'YouTube', href: 'https://www.youtube.com/@SnehaDasIITR', icon: Youtube },
    { label: 'Email', href: 'mailto:hello@thesnehadas.com', icon: Mail },
  ];

  return (
    <footer className="py-16 md:py-20 px-6 md:px-12 lg:px-24 bg-background">
      <div className="max-w-5xl mx-auto">
        {/* Signature in the middle */}
        <div className="flex justify-center mb-4">
          <Link href="/">
            <img 
              src="/otherlogos/name_logo.gif" 
              alt="Sneha Das" 
              className="h-16 md:h-20 w-auto"
            />
          </Link>
        </div>

        {/* Social Media Handles */}
        <div className="flex justify-center items-center gap-6">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-[#71717a] hover:text-[#09090b] transition-colors"
                aria-label={link.label}
              >
                <Icon className="h-5 w-5 md:h-6 md:w-6" />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;