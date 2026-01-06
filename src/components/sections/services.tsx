import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const services = [
  {
    title: 'AI Agent Development',
    description: 'Production-grade AI agents that handle campaigns, reporting, outreach, and internal operations. Built end-to-end and deployed into your workflow.',
    href: '/services/ai-agents',
  },
  {
    title: 'Hands-on Consulting',
    description: "Engineering support to design, build, and ship the AI systems your team doesn't have time or expertise to tackle.",
    href: '/services/consulting',
  },
  {
    title: 'Workshops and Training',
    description: 'Working sessions and practical training on AI strategy, LLM workflows, and marketing measurement—for teams that want clarity and skills, not slides.',
    href: '/services/workshops',
  },
  {
    title: 'Mentorships',
    description: '1-on-1 guidance for anyone who needs help leveling up in AI, causality or data science for marketing.',
    href: '/services/mentorship',
  },
];

export default function Services() {
  return (
    <section 
      id="offers" 
      className="py-16 md:py-20 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto"
    >
      <h2 className="text-[3rem] tracking-tight leading-[1.2] mb-12 font-display text-[#1A1A1A]">
        What I do
      </h2>
      
      <div className="flex flex-col">
        {services.map((service, index) => (
          <a
            key={index}
            href={service.href}
            className="group block w-full text-left border-t border-[#E4E4E7] py-5 transition-all duration-300 hover:bg-[#F5F1E9]/30 -mx-4 px-4 decoration-none"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[1.125rem] font-serif font-medium text-[#1A1A1A]">
                    {service.title}
                  </h3>
                  <ArrowUpRight 
                    className="h-4 w-4 text-[#71717A] opacity-0 transition-opacity duration-300 group-hover:opacity-100" 
                  />
                </div>
                <p className="text-[1.125rem] text-[#71717A] font-light leading-relaxed max-w-3xl">
                  {service.description}
                </p>
              </div>
            </div>
          </a>
        ))}
        {/* Final border to close the list if needed, or rely on following section border */}
        <div className="border-t border-[#E4E4E7] w-full" />
      </div>
    </section>
  );
}