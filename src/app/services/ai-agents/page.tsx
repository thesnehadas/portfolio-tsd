"use client";

import { useState } from "react";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { ArrowLeft, ArrowRight, Mail, BarChart3, RefreshCw, Bot, Zap, X } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function AIAgentsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, message });
    setIsDialogOpen(false);
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header />
      <main className="pt-24 md:pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-24">
          <Link 
            href="/#offers"
            className="inline-flex items-center gap-2 text-sm text-[#71717a] hover:text-[#09090b] transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="mb-16">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="h-5 w-5 text-[#71717a]" />
              <span className="text-xs uppercase tracking-wider text-[#71717a] font-sans">SERVICE</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#09090b] mb-6 leading-tight">
              AI Agent Development
            </h1>
            <p className="text-lg md:text-xl text-[#71717a] font-light leading-relaxed max-w-3xl mb-8">
              Production AI systems that handle campaigns, reporting, outreach, and internal operations. Built end-to-end and deployed into your workflow.
            </p>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 group px-8 h-11 rounded-sm"
              style={{
                backgroundColor: '#09090b',
                color: '#ffffff',
                fontWeight: 500,
                letterSpacing: '0.025em',
              }}
            >
              Get in touch
              <ArrowRight 
                className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" 
                strokeWidth={2}
              />
            </button>
          </div>

          <section className="mb-20">
            <h2 className="text-3xl md:text-4xl font-serif text-[#09090b] mb-8">
              The problem
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-base md:text-lg text-[#71717a] font-light leading-relaxed">
                  Your team spends hours on repetitive tasks: generating reports, sending outreach, syncing data between tools, responding to routine queries. These tasks don't require human judgment, but they eat up time that could go toward strategy and growth.
                </p>
              </div>
              <div>
                <p className="text-base md:text-lg text-[#71717a] font-light leading-relaxed">
                  You've tried automation tools, but they're either too rigid or require constant babysitting. You've seen demos of AI agents, but most are prototypes that break in production. You need something that actually works.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <h2 className="text-3xl md:text-4xl font-serif text-[#09090b] mb-6">
              What I build
            </h2>
            <p className="text-base md:text-lg text-[#71717a] font-light leading-relaxed max-w-3xl mb-12">
              I build production AI systems and LLM applications that handle real work. These aren't prototypes or demos. They're fully deployed systems integrated into your workflow. I manage everything from architecture to deployment so your team can focus elsewhere.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-[#e4e4e7] rounded-sm p-6 hover:border-[#09090b]/20 transition-colors">
                <Mail className="h-6 w-6 text-[#09090b] mb-4" />
                <h3 className="text-lg font-serif font-medium text-[#09090b] mb-2">
                  Outreach Agents
                </h3>
                <p className="text-sm text-[#71717a] font-light leading-relaxed">
                  Automated email sequences, follow-ups, and personalized outbound campaigns
                </p>
              </div>

              <div className="border border-[#e4e4e7] rounded-sm p-6 hover:border-[#09090b]/20 transition-colors">
                <BarChart3 className="h-6 w-6 text-[#09090b] mb-4" />
                <h3 className="text-lg font-serif font-medium text-[#09090b] mb-2">
                  Reporting Agents
                </h3>
                <p className="text-sm text-[#71717a] font-light leading-relaxed">
                  Automated report generation, data synthesis, and insight delivery
                </p>
              </div>

              <div className="border border-[#e4e4e7] rounded-sm p-6 hover:border-[#09090b]/20 transition-colors">
                <RefreshCw className="h-6 w-6 text-[#09090b] mb-4" />
                <h3 className="text-lg font-serif font-medium text-[#09090b] mb-2">
                  Data Sync Agents
                </h3>
                <p className="text-sm text-[#71717a] font-light leading-relaxed">
                  Keep your tools in sync without manual intervention or broken integrations
                </p>
              </div>

              <div className="border border-[#e4e4e7] rounded-sm p-6 hover:border-[#09090b]/20 transition-colors">
                <Bot className="h-6 w-6 text-[#09090b] mb-4" />
                <h3 className="text-lg font-serif font-medium text-[#09090b] mb-2">
                  Internal Assistants
                </h3>
                <p className="text-sm text-[#71717a] font-light leading-relaxed">
                  Custom chatbots that answer questions using your internal knowledge base
                </p>
              </div>

              <div className="border border-[#e4e4e7] rounded-sm p-6 hover:border-[#09090b]/20 transition-colors">
                <Zap className="h-6 w-6 text-[#09090b] mb-4" />
                <h3 className="text-lg font-serif font-medium text-[#09090b] mb-2">
                  Workflow Agents
                </h3>
                <p className="text-sm text-[#71717a] font-light leading-relaxed">
                  End-to-end automation of multi-step processes across your stack
                </p>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <h2 className="text-3xl md:text-4xl font-serif text-[#09090b] mb-12">
              How it works
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="text-2xl font-serif font-medium text-[#09090b] mb-2">01</div>
                <h3 className="text-xl font-serif font-medium text-[#09090b] mb-3">Discovery</h3>
                <p className="text-base text-[#71717a] font-light leading-relaxed">
                  We map your workflows and identify the highest-leverage automation opportunities
                </p>
              </div>

              <div>
                <div className="text-2xl font-serif font-medium text-[#09090b] mb-2">02</div>
                <h3 className="text-xl font-serif font-medium text-[#09090b] mb-3">Design</h3>
                <p className="text-base text-[#71717a] font-light leading-relaxed">
                  I design the agent architecture, including data flows, integrations, and failure handling
                </p>
              </div>

              <div>
                <div className="text-2xl font-serif font-medium text-[#09090b] mb-2">03</div>
                <h3 className="text-xl font-serif font-medium text-[#09090b] mb-3">Build</h3>
                <p className="text-base text-[#71717a] font-light leading-relaxed">
                  I build the agent with production-grade reliability: error handling, logging, and monitoring
                </p>
              </div>

              <div>
                <div className="text-2xl font-serif font-medium text-[#09090b] mb-2">04</div>
                <h3 className="text-xl font-serif font-medium text-[#09090b] mb-3">Deploy</h3>
                <p className="text-base text-[#71717a] font-light leading-relaxed">
                  The agent is deployed into your environment with documentation and handoff
                </p>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <h2 className="text-3xl md:text-4xl font-serif text-[#09090b] mb-6">
              Ready to automate?
            </h2>
            <p className="text-base md:text-lg text-[#71717a] font-light leading-relaxed max-w-3xl mb-8">
              Tell me what you're trying to automate. I'll let you know if an AI agent is the right solution and what it would take to build it.
            </p>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 group px-8 h-11 rounded-sm"
              style={{
                backgroundColor: '#09090b',
                color: '#ffffff',
                fontWeight: 500,
                letterSpacing: '0.025em',
              }}
            >
              Get in touch
              <ArrowRight 
                className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" 
                strokeWidth={2}
              />
            </button>
          </section>
        </div>
      </main>
      <Footer />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent 
          className="max-w-lg p-0"
          showCloseButton={false}
          style={{
            backgroundColor: '#fdfaf3',
            border: '2px solid #4a3728',
            borderRadius: '0.5rem',
          }}
        >
          <div 
            className="flex items-center justify-between px-4 py-2 border-b-2"
            style={{
              borderBottom: '2px solid #4a3728',
              backgroundColor: '#fdfaf3',
            }}
          >
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#e15b5b' }}></div>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f1c40f' }}></div>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#2ecc71' }}></div>
              </div>
            </div>
            <button
              onClick={() => setIsDialogOpen(false)}
              className="text-[#4a3728] hover:opacity-70 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-6 md:p-8">
            <DialogHeader>
              <DialogTitle 
                className="text-2xl md:text-3xl font-serif text-[#09090b] mb-4 text-left"
                style={{ fontWeight: 400 }}
              >
                AI Agent Development
              </DialogTitle>
              <DialogDescription 
                className="text-base text-[#71717a] font-light leading-relaxed mb-6 text-left"
              >
                Tell me what you're trying to automate. I'll let you know if an AI agent is the right solution and what it would take to build it.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label 
                  htmlFor="email"
                  className="block text-sm font-medium text-[#09090b] mb-2"
                >
                  Your email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 border border-[#e4e4e7] rounded-sm bg-white text-[#09090b] focus:outline-none focus:border-[#09090b] transition-colors"
                />
              </div>

              <div>
                <label 
                  htmlFor="message"
                  className="block text-sm font-medium text-[#09090b] mb-2"
                >
                  Tell me a bit about what you need (optional)
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="A few lines about your project or question..."
                  rows={4}
                  className="w-full px-4 py-3 border border-[#e4e4e7] rounded-sm bg-white text-[#09090b] focus:outline-none focus:border-[#09090b] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 group px-8 h-11 rounded-sm"
                style={{
                  backgroundColor: '#09090b',
                  color: '#ffffff',
                  fontWeight: 500,
                  letterSpacing: '0.025em',
                }}
              >
                Get in touch
                <ArrowRight 
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" 
                  strokeWidth={2}
                />
              </button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
