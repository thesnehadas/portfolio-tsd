"use client";

import React, { useState } from 'react';
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
  title: string;
  shortDescription: string; // For the card
  fullDescription: string; // For the dialog
}

const ToolsSection: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const allTools: Tool[] = [
    {
      title: "AI Marketing Workflow Toolkit",
      shortDescription: "How to use ChatGPT to speed up your marketing processes.",
      fullDescription: "A comprehensive toolkit that teaches you how to leverage ChatGPT and AI tools to automate and accelerate your marketing workflows. Learn practical prompts, workflow templates, and strategies to reduce manual work and increase productivity in content creation, campaign planning, and marketing operations."
    },
    {
      title: "BS-Proof Attribution Checklist",
      shortDescription: "A tool to help you challenge your current attribution measurements.",
      fullDescription: "A systematic checklist designed to help you identify and challenge flawed attribution models. This toolkit provides frameworks to evaluate attribution accuracy, spot common measurement errors, and build more reliable attribution systems that actually reflect marketing impact."
    },
    {
      title: "Marketing Feature Engineering Handbook",
      shortDescription: "A compact, high-utility reference guide for data people working on marketing problems.",
      fullDescription: "A practical handbook for data scientists and analysts working on marketing problems. Covers essential feature engineering techniques, common marketing data transformations, and best practices for building robust marketing models. Includes code examples and real-world case studies."
    },
    {
      title: '"Marketing Experiment Lab" Toolkit',
      shortDescription: "Run proper experiments and measure true incremental impact.",
      fullDescription: "A complete toolkit for designing, running, and analyzing marketing experiments. Learn how to set up proper A/B tests, control for external factors, calculate statistical significance, and measure true incremental impact of your marketing initiatives."
    },
    {
      title: "Retail Demand & Promo Simulator – Lite",
      shortDescription: "Simulate demand scenarios and optimize your promo calendar.",
      fullDescription: "A simulation tool that helps you model demand scenarios and optimize your promotional calendar. Understand how different promotions affect demand, plan inventory, and maximize ROI from your promotional activities."
    },
    {
      title: "Startup Pitch Generator",
      shortDescription: "AI-powered tool to generate and refine investor-ready pitches.",
      fullDescription: "An AI-powered tool that helps you generate, refine, and perfect your investor pitch deck. Get structured templates, AI-generated content suggestions, and feedback to create compelling pitches that resonate with investors."
    },
    {
      title: "MMM for Humans",
      shortDescription: "Understand your marketing mix without a PhD in statistics.",
      fullDescription: "A simplified guide to Marketing Mix Modeling (MMM) that makes complex statistical concepts accessible. Learn how to build and interpret MMM models, understand marketing effectiveness, and make data-driven budget allocation decisions—all explained in plain language."
    }
  ];

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
          systemDescription: selectedTool?.fullDescription,
          name: name.trim(),
          email: email.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit request");
      }

      setSuccess(true);
      setTimeout(() => {
        setIsDialogOpen(false);
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allTools.slice(0, 6).map((tool, index) => (
            <ToolCard 
              key={index} 
              title={tool.title} 
              shortDescription={tool.shortDescription}
              onOpen={() => handleOpenDialog(tool)}
            />
          ))}
        </div>
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
                  {selectedTool.fullDescription}
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