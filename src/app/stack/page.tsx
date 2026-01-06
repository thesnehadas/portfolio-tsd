import Header from "@/components/sections/header";
import ToolsSection from "@/components/sections/tools";
import ContactSection from "@/components/sections/contact";
import Footer from "@/components/sections/footer";

export default function StackPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header />
      <main className="pt-20">
        <ToolsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
