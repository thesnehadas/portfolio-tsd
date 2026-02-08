import { NextRequest, NextResponse } from "next/server";
import { requireAuthAPI } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { caseStudies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuthAPI(request);
    const { id } = await params;
    const study = await db
      .select()
      .from(caseStudies)
      .where(eq(caseStudies.id, id))
      .limit(1);

    if (study.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(study[0]);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch case study" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuthAPI(request);
    const { id } = await params;
    const body = await request.json();

    const updated = await db
      .update(caseStudies)
      .set({
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
        updatedAt: new Date(),
      })
      .where(eq(caseStudies.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update case study" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuthAPI(request);
    const { id } = await params;

    await db.delete(caseStudies).where(eq(caseStudies.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete case study" },
      { status: 500 }
    );
  }
}
