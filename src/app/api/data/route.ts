import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts, caseStudies, testimonials, systems, socialProof } from "@/lib/db/schema";
import { eq, desc, asc } from "drizzle-orm";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET - Public endpoint to fetch all database data for real-time dashboard
export async function GET() {
  try {
    // Fetch all data in parallel
    const [posts, studies, testimonialData, systemsData, socialProofData] = await Promise.all([
      // Blog Posts
      db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          slug: blogPosts.slug,
          status: blogPosts.status,
          isFeatured: blogPosts.isFeatured,
          publishDate: blogPosts.publishDate,
          createdAt: blogPosts.createdAt,
          category: blogPosts.category,
        })
        .from(blogPosts)
        .orderBy(desc(blogPosts.createdAt))
        .catch(() => []),
      
      // Case Studies
      db
        .select({
          id: caseStudies.id,
          clientName: caseStudies.clientName,
          title: caseStudies.title,
          slug: caseStudies.slug,
          status: caseStudies.status,
          isFeatured: caseStudies.isFeatured,
          createdAt: caseStudies.createdAt,
        })
        .from(caseStudies)
        .orderBy(desc(caseStudies.createdAt))
        .catch(() => []),
      
      // Testimonials
      db
        .select({
          id: testimonials.id,
          author: testimonials.author,
          company: testimonials.company,
          createdAt: testimonials.createdAt,
        })
        .from(testimonials)
        .orderBy(desc(testimonials.createdAt))
        .catch(() => []),
      
      // Systems
      db
        .select({
          id: systems.id,
          title: systems.title,
          order: systems.order,
          createdAt: systems.createdAt,
        })
        .from(systems)
        .orderBy(asc(systems.order), asc(systems.createdAt))
        .catch(() => []),
      
      // Social Proof
      db
        .select({
          id: socialProof.id,
          name: socialProof.name,
          order: socialProof.order,
          createdAt: socialProof.createdAt,
        })
        .from(socialProof)
        .orderBy(asc(socialProof.order))
        .catch(() => []),
    ]);

    return NextResponse.json({
      blogPosts: posts,
      caseStudies: studies,
      testimonials: testimonialData,
      systems: systemsData,
      socialProof: socialProofData,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error fetching dashboard data:", error);
    // Return empty data structure if there's an error
    return NextResponse.json({
      blogPosts: [],
      caseStudies: [],
      testimonials: [],
      systems: [],
      socialProof: [],
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
}
