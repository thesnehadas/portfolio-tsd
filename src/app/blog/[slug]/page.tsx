import React from "react";
import Footer from "@/components/sections/footer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const blogPosts: Record<string, {
  date: string;
  title: string;
  description: string;
  featuredImage: string;
  content: React.ReactNode;
}> = {
  "first-rule-of-ai-agents": {
    date: "MARCH 2024",
    title: "The First Rule of AI Agents is: You Don't Build AI Agents",
    description: "Why building monolithic agents is a mistake and how to think about modularity in AI engineering.",
    featuredImage: "/blog-images/630x1200.png",
    content: (
      <>
        <p className="text-white/80 font-light leading-relaxed mb-6 text-lg">
          Every AI engineer I know has made the same mistake: they build a single, monolithic agent that tries to do everything. It starts simple—"just handle customer support"—and ends up as a 2,000-line Python file that's impossible to debug, test, or maintain.
        </p>

        <p className="text-white/80 font-light leading-relaxed mb-6">
          The problem isn't the complexity of the task. It's the architecture. When you build one agent to rule them all, you're building a system that's brittle, hard to reason about, and expensive to run. Every new feature becomes a risk. Every bug affects everything.
        </p>

        <h2 className="text-white text-2xl md:text-3xl font-serif italic mt-12 mb-6">The Monolithic Trap</h2>

        <p className="text-white/80 font-light leading-relaxed mb-6">
          I've seen this pattern dozens of times. A team builds an agent that:
        </p>

        <ul className="text-white/80 font-light leading-relaxed mb-6 space-y-3 list-disc list-inside">
          <li>Handles customer queries</li>
          <li>Generates reports</li>
          <li>Sends follow-up emails</li>
          <li>Updates the CRM</li>
          <li>Checks inventory</li>
          <li>And somehow also does SEO analysis</li>
        </ul>

        <p className="text-white/80 font-light leading-relaxed mb-6">
          This agent becomes a black box. When something breaks—and it will—you're debugging a system where every component depends on every other component. You can't test parts in isolation. You can't deploy updates safely. You can't scale individual functions.
        </p>

        <h2 className="text-white text-2xl md:text-3xl font-serif italic mt-12 mb-6">Think in Modules, Not Agents</h2>

        <p className="text-white/80 font-light leading-relaxed mb-6">
          Instead of building one agent, build a system of specialized modules. Each module does one thing well:
        </p>

        <ul className="text-white/80 font-light leading-relaxed mb-6 space-y-3 list-disc list-inside">
          <li><strong className="text-white">Query Router:</strong> Understands intent and routes to the right module</li>
          <li><strong className="text-white">Data Fetcher:</strong> Retrieves information from your systems</li>
          <li><strong className="text-white">Response Generator:</strong> Creates answers using LLMs</li>
          <li><strong className="text-white">Action Executor:</strong> Performs operations (emails, updates, etc.)</li>
          <li><strong className="text-white">Quality Checker:</strong> Validates outputs before sending</li>
        </ul>

        <p className="text-white/80 font-light leading-relaxed mb-6">
          Each module is independent. You can test them separately. You can replace them without breaking the system. You can scale them based on actual usage, not theoretical peak load.
        </p>

        <h2 className="text-white text-2xl md:text-3xl font-serif italic mt-12 mb-6">Why This Works</h2>

        <p className="text-white/80 font-light leading-relaxed mb-6">
          Modular systems are easier to reason about. When a customer query fails, you know exactly which module broke. You can add logging, retries, and error handling at the right level. You can optimize the expensive parts (LLM calls) without touching the cheap parts (data fetching).
        </p>

        <p className="text-white/80 font-light leading-relaxed mb-6">
          They're also cheaper. Instead of running one massive agent for every request, you run only the modules you need. A simple data lookup doesn't need to spin up a full LLM context. A report generation doesn't need to check inventory.
        </p>

        <p className="text-white/80 font-light leading-relaxed mb-6">
          Most importantly, they're maintainable. When you need to add a new feature, you add a new module. When you need to fix a bug, you fix one module. When you need to update an integration, you update one module. The rest of the system keeps working.
        </p>

        <h2 className="text-white text-2xl md:text-3xl font-serif italic mt-12 mb-6">How to Start</h2>

        <p className="text-white/80 font-light leading-relaxed mb-6">
          Start by identifying the distinct capabilities your system needs. Don't think "I need an agent that does X." Think "I need a system that can do X, Y, and Z, and they should work together."
        </p>

        <p className="text-white/80 font-light leading-relaxed mb-6">
          Build each module as a separate service or function. Use a workflow orchestrator (like LangGraph, n8n, or Temporal) to connect them. Start with the simplest version of each module, then iterate.
        </p>

        <p className="text-white/80 font-light leading-relaxed mb-6">
          The first rule of AI agents is: you don't build AI agents. You build systems of modules that work together. The agent is the orchestration layer, not the implementation.
        </p>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-white/60 text-sm italic">
            This is the first in a series on building production AI systems. Next: how to design module interfaces that don't break.
          </p>
        </div>
      </>
    ),
  },
  "causal-inference-mmm": {
    date: "FEBRUARY 2024",
    title: "Causal Inference in Marketing Mix Modeling",
    description: "Moving beyond correlations to understand the true impact of marketing spend using causal graphs.",
    featuredImage: "/blog-images/causal-inference-mmm.jpg",
    content: (
      <p className="text-white/80 font-light leading-relaxed">
        Content coming soon...
      </p>
    ),
  },
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <main className="pt-0">
        <div className="bg-[#18181b] min-h-screen">
          <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-24 py-16">
            {/* Back Button */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white/80 transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to blog
            </Link>

            {/* Date */}
            <span className="text-white/40 text-xs mb-4 block">{post.date}</span>

            {/* Title */}
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-serif italic mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Description */}
            <p className="text-white/60 font-light text-lg mb-8 leading-relaxed">
              {post.description}
            </p>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="mb-12 w-full">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-invert max-w-none w-full">
              {post.content}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
