import { db } from "@/lib/db";
import { caseStudies } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CaseStudiesPage() {
  let allCaseStudies = [];
  
  try {
    allCaseStudies = await db
      .select()
      .from(caseStudies)
      .where(eq(caseStudies.status, "published"))
      .orderBy(desc(caseStudies.createdAt));
  } catch (error) {
    console.error("Error fetching case studies:", error);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-16">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="text-[#71717a] hover:text-[#09090b] mb-4 inline-block transition-colors"
          >
            ← Back to home
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-[#09090b] mb-4">
            Case Studies
          </h1>
          <p className="text-lg text-[#71717a] font-light max-w-2xl">
            Real results from AI systems built for marketing teams.
          </p>
        </div>

        {/* Case Studies Grid */}
        {allCaseStudies.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#71717a]">No case studies available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCaseStudies.map((study) => {
              const clientName = study.clientName || study.title || "Untitled";
              const description = study.description || "";
              
              return (
                <Link
                  key={study.id}
                  href={`/casestudies/${study.slug || study.id}`}
                  className="group relative bg-gradient-to-br from-[#fdfaf3] to-white border-2 border-[#4a3728]/30 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#4a3728] hover:shadow-[6px_6px_0px_#4a3728] hover:-translate-y-1"
                >
                  {/* Accent gradient overlay */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#4a3728]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  
                  {study.featuredImage && (
                    <div className="relative w-full h-56 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
                      <Image
                        src={study.featuredImage}
                        alt={clientName}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="p-6 relative z-10">
                    {/* Retro Window Dots */}
                    <div className="flex items-center gap-1.5 mb-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#e15b5b]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#f1c40f]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#2ecc71]"></div>
                    </div>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {study.isFeatured === 1 && (
                        <span className="px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-white rounded-full shadow-sm">
                          ⭐ Featured
                        </span>
                      )}
                      {study.industry && (
                        <span className="px-3 py-1.5 text-xs font-semibold bg-[#4a3728]/10 text-[#4a3728] rounded-full border border-[#4a3728]/20">
                          {study.industry}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg md:text-xl font-serif font-bold text-[#09090b] mb-3 leading-tight group-hover:text-[#4a3728] transition-colors">
                      {clientName}
                    </h3>
                    {description && (
                      <p className="text-sm md:text-base text-[#71717a] font-normal leading-relaxed line-clamp-3 mb-4">
                        {description}
                      </p>
                    )}
                    <div className="flex items-center text-[#4a3728] text-sm font-bold group-hover:text-[#4a3728] transition-all">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Read more</span>
                      <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
