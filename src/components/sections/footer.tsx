import React from 'react';

const Footer = () => {
  const socialLinks = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/melloarthur/' },
    { label: 'GitHub', href: 'https://github.com/arthurmello' },
    { label: 'Medium', href: 'https://medium.com/@arthurmello_' },
    { label: 'YouTube', href: 'https://www.youtube.com/@arthur_bmello' },
    { label: 'Substack', href: 'https://substack.com/@arthurmello1' },
    { label: 'Newsletter', href: '#' },
  ];

  return (
    <footer className="py-8 px-6 md:px-12 lg:px-24 border-t border-[#e4e4e7]">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-[#71717a] mb-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="link-underline hover:text-[#09090b] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="text-center text-sm text-[#71717a] font-light">
          © 2026 Sneha Das
        </div>
      </div>
    </footer>
  );
};

export default Footer;