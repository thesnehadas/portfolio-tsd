import Header from "@/components/sections/header";
import HeroSection from "@/components/sections/hero";
import WhoIHelp from "@/components/sections/who-i-help";
import WhatIDo from "@/components/sections/what-i-do";
import ToolsSection from "@/components/sections/tools";
import BlogSignalSection from "@/components/sections/blog-signal";
import AboutSection from "@/components/sections/about";
import ContactSection from "@/components/sections/contact";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-retro-brown/10 selection:text-retro-brown">
      <Header />
      <main>
        <HeroSection />
        <WhoIHelp />
        <WhatIDo />
        <ToolsSection />
        <BlogSignalSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
