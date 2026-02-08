"use client";

import React, { useState, useEffect } from 'react';
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

/**
 * TestimonialSection Component
 * 
 * Displays client testimonials in a carousel without boxes.
 * Shows one testimonial at a time with auto-looping.
 * Fetches testimonials from the database.
 */
interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company?: string;
}

const TestimonialCard: React.FC<TestimonialProps> = ({ quote, author, role, company }) => {
  return (
    <div className="text-center max-w-3xl mx-auto">
      {/* Quote */}
      <blockquote className="text-2xl md:text-3xl font-serif font-light italic text-[#09090b] mb-8 leading-relaxed">
        &ldquo;{quote}&rdquo;
      </blockquote>
      
      {/* Author Info */}
      <div className="mt-8">
        <div className="font-sans font-semibold text-lg text-[#09090b] mb-1">
          {author}
        </div>
        <div className="font-sans text-base text-[#71717a]">
          {role}
          {company && ` at ${company}`}
        </div>
      </div>
    </div>
  );
};

const TestimonialSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<TestimonialProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        if (response.ok) {
          const data = await response.json();
          setTestimonials(data);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  // Don't render if no testimonials
  if (loading || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-10 md:py-12 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-serif text-[#09090b] mb-4">
          In their words
        </h2>
        <p className="text-lg text-[#71717a] font-light max-w-2xl">
          Real feedback from teams I've worked with.
        </p>
      </div>

      {/* Testimonials Carousel */}
      <div className="relative">
        <Carousel
          opts={{
            align: "center",
            loop: testimonials.length > 1,
          }}
          plugins={[plugin.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4">
                <TestimonialCard {...testimonial} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialSection;
