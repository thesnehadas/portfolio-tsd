"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface ServiceItem {
  title: string;
  description: string;
  href: string;
}

const services: ServiceItem[] = [
  {
    title: "AI Agent Development",
    description: "Production-grade AI systems for pipeline generation, sales acceleration, and operational workflows. Built end-to-end and deployed into your infrastructure.",
    href: "/services/ai-agents"
  },
  {
    title: "Hands-on Consulting",
    description: "Technical implementation support to architect, build, and deploy AI infrastructure when your team lacks bandwidth or specialized expertise.",
    href: "/services/consulting"
  },
  {
    title: "Mentorships",
    description: "1-on-1 technical guidance for professionals building expertise in AI systems, automation architecture, or data-driven decision-making.",
    href: "/services/mentorship"
  }
];

const WhatIDo: React.FC = () => {
  return (
    <section 
      id="offers" 
      className="py-16 md:py-20 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto"
    >
      <h2 className="text-3xl md:text-4xl mb-12 font-serif text-foreground">
        What I do
      </h2>

      <div className="flex flex-col">
        {services.map((service, index) => (
          <Link
            key={index}
            href={service.href}
            className="group block w-full text-left border-t border-border py-5 transition-colors hover:bg-accent/30 -mx-4 px-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-serif font-medium text-foreground">
                    {service.title}
                  </h3>
                  <ArrowUpRight 
                    className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100" 
                  />
                </div>
                <p className="text-muted-foreground font-light text-base leading-relaxed max-w-2xl">
                  {service.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
        {/* Bottom border to close the list if needed, though the original uses border-t only */}
        <div className="border-t border-border w-full"></div>
      </div>
    </section>
  );
};

export default WhatIDo;