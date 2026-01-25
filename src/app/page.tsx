import Header from "@/components/sections/header";
import HeroSection from "@/components/sections/hero";
import SocialProofSection from "@/components/sections/social-proof";
import WhatIDo from "@/components/sections/what-i-do";
import WhoIHelp from "@/components/sections/who-i-help";
import CaseStudiesSection from "@/components/sections/case-studies";
import ToolsSection from "@/components/sections/tools";
import AboutSection from "@/components/sections/about";
import BlogSignalSection from "@/components/sections/blog-signal";
import ContactSection from "@/components/sections/contact";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-retro-brown/10 selection:text-retro-brown">
      <Header />
      <main>
        <HeroSection />
        <SocialProofSection />
        <WhatIDo />
        <WhoIHelp />
        <CaseStudiesSection />
        <ToolsSection />
        <AboutSection />
        <BlogSignalSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
