import Header from "@/components/sections/header";
import HeroSection from "@/components/sections/hero";
import SocialProofSection from "@/components/sections/social-proof";
import WhatIDo from "@/components/sections/what-i-do";
import WhoIHelp from "@/components/sections/who-i-help";
import CaseStudiesSection from "@/components/sections/case-studies";
import TestimonialSection from "@/components/sections/testimonial";
import ToolsSection from "@/components/sections/tools";
import AboutSection from "@/components/sections/about";
import BlogSignalSection from "@/components/sections/blog-signal";
import ContactSection from "@/components/sections/contact";
import Footer from "@/components/sections/footer";
import FloatingChat from "@/components/floating-chat";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-retro-brown/10 selection:text-retro-brown overflow-x-hidden">
      <Header />
      <main className="overflow-x-hidden">
        <HeroSection />
        <SocialProofSection />
        <WhatIDo />
        <WhoIHelp />
        <CaseStudiesSection />
        <TestimonialSection />
        <ToolsSection />
        <AboutSection />
        <BlogSignalSection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingChat />
    </div>
  );
}
