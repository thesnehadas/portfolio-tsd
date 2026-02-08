"use client";

import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

/**
 * ToolsSection Component (renamed to Systems)
 * 
 * Clones the "Systems" section of the website with pixel-perfect accuracy.
 * Features:
 * - Retro-inspired card-style buttons with colored window controls.
 * - Light cream background (retro-cream: #fdfaf3).
 * - Thick brown borders (retro-brown: #4a3728).
 * - Offset shadow hover effects.
 * - Responsive grid layout.
 */

interface ToolCardProps {
  title: string;
  shortDescription: string;
  onOpen: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ title, shortDescription, onOpen }) => {
  return (
    <button 
      onClick={onOpen}
      className="group text-left bg-[#fdfaf3] border-2 border-[#4a3728]/30 rounded-lg p-6 transition-all duration-200 hover:border-[#4a3728] hover:shadow-[4px_4px_0px_#4a3728] w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#4a3728]"
    >
      {/* Retro Window Dots */}
      <div className="flex items-center gap-1.5 mb-4">
        <div className="w-2.5 h-2.5 rounded-full bg-[#e15b5b]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#f1c40f]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#2ecc71]"></div>
      </div>
      
      {/* Title and Icon */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-base font-serif font-semibold text-[#09090b] leading-tight max-w-[90%]">
          {title}
        </h4>
        <ArrowUpRight 
          className="h-4 w-4 text-[#4a3728] opacity-0 -translate-y-1 translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 shrink-0" 
        />
      </div>
      
      {/* Description */}
      <p className="text-sm text-[#71717a] font-light leading-relaxed">
        {shortDescription}
      </p>
    </button>
  );
};

interface Tool {
  id: string;
  title: string;
  summary: string; // For the card
  description: string; // For the dialog
}

const ToolsSection: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [toolsLoading, setToolsLoading] = useState(true);

  // Fetch systems from database
  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const res = await fetch("/api/systems");
        if (res.ok) {
          const data = await res.json();
          // Map database fields to component interface and sort by order
          const mappedTools: Tool[] = data
            .map((system: any) => ({
              id: system.id,
              title: system.title,
              summary: system.summary,
              description: system.description,
              order: system.order || 0,
            }))
            .sort((a: any, b: any) => a.order - b.order)
            .slice(0, 6)
            .map(({ order, ...tool }) => tool); // Remove order from final objects
          setAllTools(mappedTools);
        } else {
          console.error("Failed to fetch systems");
          // Fallback to empty array if fetch fails
          setAllTools([]);
        }
      } catch (err) {
        console.error("Error fetching systems:", err);
        setAllTools([]);
      } finally {
        setToolsLoading(false);
      }
    };

    fetchSystems();
  }, []);

  const handleOpenDialog = (tool: Tool) => {
    setSelectedTool(tool);
    setIsDialogOpen(true);
    setName("");
    setEmail("");
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name.trim() || !email.trim()) {
      setError("Please fill in both name and email");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/systems/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemTitle: selectedTool?.title,
          systemDescription: selectedTool?.description,
          name: name.trim(),
          email: email.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const errorMessage = data.error || `Server error: ${res.status} ${res.statusText}`;
        console.error("API Error:", {
          status: res.status,
          statusText: res.statusText,
          error: data,
        });
        throw new Error(errorMessage);
      }

      const result = await res.json();
      console.log("Request submitted successfully:", result);

      setSuccess(true);
      setTimeout(() => {
        setIsDialogOpen(false);
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      console.error("Form submission error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section id="systems" className="py-10 md:py-12 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto scroll-mt-20">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
          <h2 className="text-3xl md:text-4xl font-serif text-[#09090b]">Systems</h2>
        </div>

        {/* All Systems */}
        {toolsLoading ? (
          <div className="text-center py-12 text-[#71717a]">
            <p>Loading systems...</p>
          </div>
        ) : allTools.length === 0 ? (
          <div className="text-center py-12 text-[#71717a]">
            <p>No systems available at the moment.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allTools.map((tool) => (
              <ToolCard 
                key={tool.id} 
                title={tool.title} 
                shortDescription={tool.summary}
                onOpen={() => handleOpenDialog(tool)}
              />
            ))}
          </div>
        )}
      </section>

      {/* System Access Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-[#fdfaf3] border-2 border-[#4a3728]">
          {selectedTool && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#e15b5b]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#f1c40f]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2ecc71]"></div>
                </div>
                <DialogTitle className="text-2xl md:text-3xl font-serif font-semibold text-[#09090b]">
                  {selectedTool.title}
                </DialogTitle>
                <DialogDescription className="text-base text-[#71717a] font-light leading-relaxed mt-4">
                  {selectedTool.description}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6">
                <h3 className="text-lg font-serif font-semibold text-[#09090b] mb-6">
                  Unlock access to this toolkit
                </h3>

                {success ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded text-green-700 text-center">
                    Request submitted successfully! We'll be in touch soon.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
                        {error}
                      </div>
                    )}

                    <div>
                      <Label htmlFor="name" className="text-[#09090b]">
                        Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 bg-white border-[#4a3728]/30 focus:border-[#4a3728]"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-[#09090b]">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 bg-white border-[#4a3728]/30 focus:border-[#4a3728]"
                        placeholder="your@email.com"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#09090b] text-white hover:bg-[#09090b]/90 mt-6"
                    >
                      {loading ? "Submitting..." : "Unlock access"}
                    </Button>
                  </form>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ToolsSection;