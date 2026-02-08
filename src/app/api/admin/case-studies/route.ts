import { NextRequest, NextResponse } from "next/server";
import { requireAuthAPI } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { caseStudies } from "@/lib/db/schema";

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
    return NextResponse.json(
      { error: error.message || "Failed to create case study" },
      { status: 500 }
    );
  }
}
