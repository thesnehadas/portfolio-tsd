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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allCaseStudies.map((study) => {
              const clientName = study.clientName || study.title || "Untitled";
              const description = study.description || "";
              
              return (
                <Link
                  key={study.id}
                  href={`/casestudies/${study.slug || study.id}`}
                  className="bg-[#fdfaf3] border-2 border-[#4a3728]/30 rounded-lg overflow-hidden transition-all duration-200 hover:border-[#4a3728] hover:shadow-[4px_4px_0px_#4a3728]"
                >
                  {study.featuredImage && (
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={study.featuredImage}
                        alt={clientName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
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
                    <h3 className="text-xl font-serif font-semibold text-[#09090b] mb-2">
                      {clientName}
                    </h3>
                    {description && (
                      <p className="text-[#71717a] text-sm line-clamp-3">
                        {description}
                      </p>
                    )}
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
