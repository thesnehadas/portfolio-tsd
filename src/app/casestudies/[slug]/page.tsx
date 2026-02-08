import { db } from "@/lib/db";
import { caseStudies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  let study;
  try {
    const studies = await db
      .select()
      .from(caseStudies)
      .where(eq(caseStudies.slug, slug))
      .limit(1);
    
    study = studies[0];
    
    // If not found by slug, try by ID (for backward compatibility)
    if (!study) {
      const studiesById = await db
        .select()
        .from(caseStudies)
        .where(eq(caseStudies.id, slug))
        .limit(1);
      study = studiesById[0];
    }
  } catch (error) {
    console.error("Error fetching case study:", error);
  }

  if (!study || study.status !== "published") {
    notFound();
  }

  const clientName = study.clientName || study.title || "Untitled";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-16">
        {/* Back Link */}
        <Link
          href="/casestudies"
          className="text-[#71717a] hover:text-[#09090b] mb-8 inline-block transition-colors"
        >
          ← Back to case studies
        </Link>

        {/* Featured Image */}
        {study.featuredImage && (
          <div className="mb-8 -mx-6 md:-mx-12 lg:-mx-24">
            <div className="relative w-full h-64 md:h-96 overflow-hidden">
              <Image
                src={study.featuredImage}
                alt={clientName}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {study.isFeatured === 1 && (
              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                Featured
              </span>
            )}
            {study.industry && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                {study.industry}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-[#09090b] mb-4">
            {clientName}
          </h1>
          {study.description && (
            <p className="text-xl text-[#71717a] font-light leading-relaxed">
              {study.description}
            </p>
          )}
        </div>

        {/* Problem / Challenge */}
        {study.problemChallenge && (
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#09090b] mb-4">
              Problem / Challenge
            </h2>
            <div
              className="prose prose-lg max-w-none text-[#71717a]"
              dangerouslySetInnerHTML={{ __html: study.problemChallenge }}
            />
          </div>
        )}

        {/* Solution Overview */}
        {study.solutionOverview && (
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#09090b] mb-4">
              Solution Overview
            </h2>
            <div
              className="prose prose-lg max-w-none text-[#71717a]"
              dangerouslySetInnerHTML={{ __html: study.solutionOverview }}
            />
          </div>
        )}

        {/* Results */}
        {study.results && (
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#09090b] mb-4">
              Results
            </h2>
            <div
              className="prose prose-lg max-w-none text-[#71717a]"
              dangerouslySetInnerHTML={{ __html: study.results }}
            />
          </div>
        )}

        {/* Key Features */}
        {study.keyFeatures && (
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#09090b] mb-4">
              Key Features
            </h2>
            <div
              className="prose prose-lg max-w-none text-[#71717a]"
              dangerouslySetInnerHTML={{ __html: study.keyFeatures }}
            />
          </div>
        )}

        {/* Technical Details */}
        {(study.technicalStack || study.timeline) && (
          <div className="mb-12 border-t border-[#4a3728]/20 pt-8">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#09090b] mb-4">
              Technical Details
            </h2>
            {study.technicalStack && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#09090b] mb-2">Technical Stack</h3>
                <p className="text-[#71717a]">{study.technicalStack}</p>
              </div>
            )}
            {study.timeline && (
              <div>
                <h3 className="text-lg font-semibold text-[#09090b] mb-2">Timeline</h3>
                <p className="text-[#71717a]">{study.timeline}</p>
              </div>
            )}
          </div>
        )}

        {/* Client Testimonial */}
        {study.clientTestimonial && (
          <div className="mb-12 border-t border-[#4a3728]/20 pt-8">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#09090b] mb-4">
              Client Testimonial
            </h2>
            <blockquote className="text-xl text-[#71717a] font-light italic border-l-4 border-[#4a3728] pl-6">
              {study.clientTestimonial}
            </blockquote>
          </div>
        )}

        {/* Back Link */}
        <div className="border-t border-[#4a3728]/20 pt-8">
          <Link
            href="/casestudies"
            className="text-[#09090b] hover:underline font-semibold"
          >
            ← View all case studies
          </Link>
        </div>
      </div>
    </div>
  );
}
