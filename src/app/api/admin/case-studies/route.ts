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

    // Normalize slug (trim and ensure it's not empty)
    const slug = body.slug.trim();
    if (!slug) {
      return NextResponse.json(
        { error: "Slug cannot be empty" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await db
      .select()
      .from(caseStudies)
      .where(eq(caseStudies.slug, slug))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "A case study with this slug already exists" },
        { status: 400 }
      );
    }

    // Helper function to convert empty strings to null
    const nullIfEmpty = (value: any) => {
      if (value === undefined || value === null) return null;
      if (typeof value === 'string' && value.trim() === '') return null;
      return value;
    };

    // Normalize isFeatured to be 0 or 1
    const isFeatured = body.isFeatured === true || body.isFeatured === 1 || body.isFeatured === '1' ? 1 : 0;
    
    // Normalize status
    const status = body.status || "draft";

    const newStudy = await db
      .insert(caseStudies)
      .values({
        clientName: body.clientName.trim(),
        industry: nullIfEmpty(body.industry),
        slug: slug,
        featuredImage: nullIfEmpty(body.featuredImage),
        problemChallenge: nullIfEmpty(body.problemChallenge),
        solutionOverview: nullIfEmpty(body.solutionOverview),
        results: nullIfEmpty(body.results),
        keyFeatures: nullIfEmpty(body.keyFeatures),
        technicalStack: nullIfEmpty(body.technicalStack),
        timeline: nullIfEmpty(body.timeline),
        metaTitle: nullIfEmpty(body.metaTitle),
        metaDescription: nullIfEmpty(body.metaDescription),
        tags: nullIfEmpty(body.tags),
        clientTestimonial: nullIfEmpty(body.clientTestimonial),
        status: status,
        isFeatured: isFeatured,
        // Legacy fields for backward compatibility
        title: body.clientName.trim() || nullIfEmpty(body.title),
        description: nullIfEmpty(body.description),
        fullDescription: nullIfEmpty(body.fullDescription),
        metrics: nullIfEmpty(body.metrics),
        details: nullIfEmpty(body.details),
      })
      .returning();

    return NextResponse.json(newStudy[0]);
  } catch (error: any) {
    console.error("Error creating case study:", error);
    // Log more details for debugging
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint,
      table: error.table,
      column: error.column,
      hint: error.hint,
    });
    
    // Provide more helpful error messages
    let errorMessage = error.message || "Failed to create case study";
    
    // Handle specific database errors
    if (error.code === '23505') { // Unique violation
      errorMessage = `A case study with this slug already exists. Please use a different slug.`;
    } else if (error.code === '23502') { // Not null violation
      errorMessage = `Missing required field: ${error.column || 'unknown field'}`;
    } else if (error.code === '42703') { // Undefined column
      errorMessage = `Database schema mismatch. Column '${error.column || 'unknown'}' does not exist. Please run the migration SQL.`;
    } else if (error.detail) {
      errorMessage = `${errorMessage}: ${error.detail}`;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.detail || error.hint || null,
        code: error.code || null
      },
      { status: 500 }
    );
  }
}
