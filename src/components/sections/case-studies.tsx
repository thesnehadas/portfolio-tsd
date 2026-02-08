"use client";

import React, { useState, useEffect } from 'react';
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
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
 * Displays featured case studies in a carousel.
 * Fetches from database and shows only featured, published case studies.
 */
interface CaseStudyProps {
  id: string;
  clientName?: string;
  title?: string;
  description?: string;
  solutionOverview?: string;
  results?: string;
  keyFeatures?: string;
  featuredImage?: string;
  slug?: string;
}

const CaseStudyCard: React.FC<CaseStudyProps & { onOpen: () => void }> = ({ 
  clientName, 
  title, 
  description, 
  featuredImage,
  onOpen 
}) => {
  const displayName = clientName || title || "Untitled";
  
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
      
      {/* Featured Image */}
      {featuredImage && (
        <div className="mb-6 -mx-8 md:-mx-10 lg:-mx-12 -mt-8 md:-mt-10 lg:-mt-12">
          <img
            src={featuredImage}
            alt={displayName}
            className="w-full h-48 object-cover"
          />
        </div>
      )}
      
      {/* Title */}
      <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[#09090b] mb-4">
        {displayName}
      </h3>
      
      {/* Description */}
      {description && (
        <p className="text-lg md:text-xl text-[#71717a] font-light leading-relaxed">
          {description}
        </p>
      )}
    </button>
  );
};

const CaseStudiesSection: React.FC = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudyProps[]>([]);
  const [selectedStudy, setSelectedStudy] = useState<CaseStudyProps | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const response = await fetch('/api/case-studies?featured=true&status=published');
        if (response.ok) {
          const data = await response.json();
          setCaseStudies(data);
        }
      } catch (error) {
        console.error('Error fetching case studies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudies();
  }, []);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const handleOpenStudy = (study: CaseStudyProps) => {
    setSelectedStudy(study);
    setIsDialogOpen(true);
  };

  // Don't render if no case studies
  if (loading || caseStudies.length === 0) {
    return null;
  }

  return (
    <section id="case-studies" className="py-10 md:py-12 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl md:text-4xl font-serif text-[#09090b]">
            Case Studies
          </h2>
          <Link
            href="/casestudies"
            className="text-[#71717a] hover:text-[#09090b] transition-colors text-sm md:text-base"
          >
            View all →
          </Link>
        </div>
        <p className="text-lg text-[#71717a] font-light max-w-2xl">
          Real results from AI systems built for marketing teams.
        </p>
      </div>

      {/* Case Studies Carousel */}
      <div className="relative">
        <Carousel
          opts={{
            align: "center",
            loop: caseStudies.length > 1,
          }}
          plugins={[plugin.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {caseStudies.map((study) => (
              <CarouselItem key={study.id} className="pl-2 md:pl-4">
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
        <DialogContent className="max-w-3xl bg-[#fdfaf3] border-2 border-[#4a3728] max-h-[90vh] overflow-y-auto">
          {selectedStudy && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#e15b5b]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#f1c40f]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2ecc71]"></div>
                </div>
                <DialogTitle className="text-2xl md:text-3xl font-serif font-semibold text-[#09090b]">
                  {selectedStudy.clientName || selectedStudy.title || "Untitled"}
                </DialogTitle>
                {selectedStudy.description && (
                  <DialogDescription className="text-base text-[#71717a] font-light leading-relaxed mt-4">
                    {selectedStudy.description}
                  </DialogDescription>
                )}
              </DialogHeader>
              
              <div className="mt-6 space-y-6">
                {selectedStudy.solutionOverview && (
                  <div>
                    <h4 className="text-lg font-serif font-semibold text-[#09090b] mb-3">Solution Overview</h4>
                    <div 
                      className="prose prose-sm max-w-none text-[#71717a]"
                      dangerouslySetInnerHTML={{ __html: selectedStudy.solutionOverview }}
                    />
                  </div>
                )}

                {selectedStudy.results && (
                  <div>
                    <h4 className="text-lg font-serif font-semibold text-[#09090b] mb-3">Results</h4>
                    <div 
                      className="prose prose-sm max-w-none text-[#71717a]"
                      dangerouslySetInnerHTML={{ __html: selectedStudy.results }}
                    />
                  </div>
                )}

                {selectedStudy.keyFeatures && (
                  <div>
                    <h4 className="text-lg font-serif font-semibold text-[#09090b] mb-3">Key Features</h4>
                    <div 
                      className="prose prose-sm max-w-none text-[#71717a]"
                      dangerouslySetInnerHTML={{ __html: selectedStudy.keyFeatures }}
                    />
                  </div>
                )}

                {selectedStudy.slug && (
                  <div className="pt-4 border-t border-[#4a3728]/20">
                    <Link
                      href={`/casestudies/${selectedStudy.slug}`}
                      className="text-[#09090b] hover:underline font-semibold"
                    >
                      Read full case study →
                    </Link>
                  </div>
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
