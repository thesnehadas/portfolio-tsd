import { NextRequest, NextResponse } from "next/server";
import { requireAuthAPI } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { caseStudies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    await requireAuthAPI(request);
    const all = await db.select().from(caseStudies);
    return NextResponse.json(all);
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuthAPI(request);
    const body = await request.json();

    // Validate required fields
    if (!body.clientName || !body.slug) {
      return NextResponse.json(
        { error: "Client name and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await db
      .select()
      .from(caseStudies)
      .where(eq(caseStudies.slug, body.slug))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "A case study with this slug already exists" },
        { status: 400 }
      );
    }

    const newStudy = await db
      .insert(caseStudies)
      .values({
        clientName: body.clientName,
        industry: body.industry || null,
        slug: body.slug,
        featuredImage: body.featuredImage || null,
        problemChallenge: body.problemChallenge || null,
        solutionOverview: body.solutionOverview || null,
        results: body.results || null,
        keyFeatures: body.keyFeatures || null,
        technicalStack: body.technicalStack || null,
        timeline: body.timeline || null,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
        tags: body.tags || null,
        clientTestimonial: body.clientTestimonial || null,
        status: body.status || "draft",
        isFeatured: body.isFeatured || 0,
        // Legacy fields for backward compatibility
        title: body.clientName || body.title || null,
        description: body.description || null,
        fullDescription: body.fullDescription || null,
        metrics: body.metrics || null,
        details: body.details || null,
      })
      .returning();

    return NextResponse.json(newStudy[0]);
  } catch (error: any) {
    console.error("Error creating case study:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create case study" },
      { status: 500 }
    );
  }
}
