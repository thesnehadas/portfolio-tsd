import Header from "@/components/sections/header";
import AboutSection from "@/components/sections/about";
import ContactSection from "@/components/sections/contact";
import Footer from "@/components/sections/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header />
      <main className="pt-20">
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
