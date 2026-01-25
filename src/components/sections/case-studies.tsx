"use client";

import React, { useState } from 'react';
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * CaseStudiesSection Component
 * 
 * Displays case studies with metrics showcasing results in a carousel.
 * Features retro-inspired design with window controls and metrics cards.
 * Shows one case study at a time with auto-looping.
 */
interface CaseStudyProps {
  title: string;
  description: string;
  fullDescription?: string;
  metrics: Array<{
    label: string;
    value: string;
  }>;
  details?: string[];
}

const CaseStudyCard: React.FC<CaseStudyProps & { onOpen: () => void }> = ({ title, description, metrics, onOpen }) => {
  return (
    <button
      onClick={onOpen}
      className="bg-[#fdfaf3] border-2 border-[#4a3728]/30 rounded-lg p-8 md:p-10 lg:p-12 transition-all duration-200 hover:border-[#4a3728] hover:shadow-[4px_4px_0px_#4a3728] max-w-2xl mx-auto w-full text-left cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#4a3728]"
    >
      {/* Retro Window Dots */}
      <div className="flex items-center gap-1.5 mb-6">
        <div className="w-2.5 h-2.5 rounded-full bg-[#e15b5b]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#f1c40f]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#2ecc71]"></div>
      </div>
      
      {/* Title */}
      <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[#09090b] mb-4">
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-lg md:text-xl text-[#71717a] font-light leading-relaxed mb-8">
        {description}
      </p>
      
      {/* Metrics */}
      <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#4a3728]/20">
        {metrics.map((metric, index) => (
          <div key={index}>
            <div className="text-3xl md:text-4xl font-serif font-semibold text-[#09090b] mb-2">
              {metric.value}
            </div>
            <div className="text-sm text-[#71717a] font-sans uppercase tracking-wider">
              {metric.label}
            </div>
          </div>
        ))}
      </div>
    </button>
  );
};

const CaseStudiesSection: React.FC = () => {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudyProps | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const caseStudies: CaseStudyProps[] = [
    {
      title: "AI-Powered Marketing Automation",
      description: "Built an AI agent system that automated content creation and campaign optimization, reducing manual work by 80%.",
      fullDescription: "This comprehensive AI agent system revolutionized how the marketing team operates. By leveraging advanced language models and automation workflows, we created a system that handles content ideation, creation, optimization, and distribution across multiple channels. The system integrates seamlessly with existing marketing tools and provides real-time insights and recommendations.",
      metrics: [
        { label: "Time Saved", value: "80%" },
        { label: "ROI Increase", value: "3.5x" },
      ],
      details: [
        "Automated content generation for social media, email campaigns, and blog posts",
        "Real-time campaign optimization based on performance data",
        "Integration with major marketing platforms (HubSpot, Mailchimp, Google Ads)",
        "Reduced content creation time from 4 hours to 30 minutes per piece",
        "Improved campaign performance through data-driven optimization"
      ],
    },
    {
      title: "Causal Inference Platform",
      description: "Developed a marketing mix model that accurately measured incremental impact across all channels.",
      fullDescription: "A sophisticated causal inference platform that goes beyond traditional attribution models. Using advanced statistical methods and machine learning, this platform accurately measures the true incremental impact of each marketing channel, accounting for external factors, seasonality, and cross-channel interactions. The platform provides actionable insights that help optimize marketing spend and improve overall ROI.",
      metrics: [
        { label: "Accuracy", value: "94%" },
        { label: "Cost Reduction", value: "40%" },
      ],
      details: [
        "Multi-touch attribution with causal inference methods",
        "Real-time impact measurement across all marketing channels",
        "Budget optimization recommendations based on incremental impact",
        "Integration with existing analytics and marketing platforms",
        "Reduced wasted ad spend by identifying non-incremental channels"
      ],
    },
    {
      title: "MMM Implementation",
      description: "Implemented a full MMM solution that replaced outdated attribution models and provided actionable insights.",
      fullDescription: "A complete Media Mix Modeling (MMM) solution that provides a holistic view of marketing effectiveness. This implementation uses Bayesian methods to model the relationship between marketing spend and business outcomes, accounting for lag effects, saturation, and interactions between channels. The solution replaced legacy attribution models and provided the marketing team with reliable, actionable insights for budget allocation and strategy.",
      metrics: [
        { label: "Insight Speed", value: "10x" },
        { label: "Budget Efficiency", value: "25%" },
      ],
      details: [
        "Bayesian MMM model with weekly and monthly granularity",
        "Automated reporting and insight generation",
        "Budget allocation recommendations based on model predictions",
        "Scenario planning and what-if analysis capabilities",
        "Integration with finance and marketing planning tools"
      ],
    },
  ];

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const handleOpenStudy = (study: CaseStudyProps) => {
    setSelectedStudy(study);
    setIsDialogOpen(true);
  };

  return (
    <section id="case-studies" className="py-10 md:py-12 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-serif text-[#09090b] mb-4">
          Case Studies
        </h2>
        <p className="text-lg text-[#71717a] font-light max-w-2xl">
          Real results from AI systems built for marketing teams.
        </p>
      </div>

      {/* Case Studies Carousel */}
      <div className="relative">
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          plugins={[plugin.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {caseStudies.map((study, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4">
                <CaseStudyCard {...study} onOpen={() => handleOpenStudy(study)} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12 border-[#4a3728]/30 hover:border-[#4a3728] bg-[#fdfaf3] hover:bg-[#fdfaf3]" />
          <CarouselNext className="hidden md:flex -right-12 border-[#4a3728]/30 hover:border-[#4a3728] bg-[#fdfaf3] hover:bg-[#fdfaf3]" />
        </Carousel>
      </div>

      {/* Case Study Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl bg-[#fdfaf3] border-2 border-[#4a3728]">
          {selectedStudy && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#e15b5b]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#f1c40f]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2ecc71]"></div>
                </div>
                <DialogTitle className="text-2xl md:text-3xl font-serif font-semibold text-[#09090b]">
                  {selectedStudy.title}
                </DialogTitle>
                <DialogDescription className="text-base text-[#71717a] font-light leading-relaxed mt-4">
                  {selectedStudy.fullDescription || selectedStudy.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-6">
                <h4 className="text-lg font-serif font-semibold text-[#09090b] mb-4">Key Results</h4>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {selectedStudy.metrics.map((metric, index) => (
                    <div key={index} className="bg-white/50 rounded-lg p-4 border border-[#4a3728]/20">
                      <div className="text-2xl md:text-3xl font-serif font-semibold text-[#09090b] mb-1">
                        {metric.value}
                      </div>
                      <div className="text-sm text-[#71717a] font-sans uppercase tracking-wider">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedStudy.details && selectedStudy.details.length > 0 && (
                  <>
                    <h4 className="text-lg font-serif font-semibold text-[#09090b] mb-4">Key Features</h4>
                    <ul className="space-y-2">
                      {selectedStudy.details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-3 text-[#71717a] font-light">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4a3728] mt-2 flex-shrink-0"></span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CaseStudiesSection;
