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

    // Check if slug already exists for a different case study
    const existing = await db
      .select()
      .from(caseStudies)
      .where(eq(caseStudies.slug, slug))
      .limit(1);

    if (existing.length > 0 && existing[0].id !== id) {
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

    const updated = await db
      .update(caseStudies)
      .set({
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
        // Title has NOT NULL constraint, ensure it's never null
        title: body.clientName.trim() || body.title?.trim() || "",
        // Description has NOT NULL constraint, ensure it's never null
        description: body.description?.trim() || body.metaDescription?.trim() || "",
        fullDescription: nullIfEmpty(body.fullDescription),
        // Metrics has NOT NULL constraint, so ensure it's never null
        metrics: body.metrics?.trim() || "",
        // Details is nullable in schema but ensure it's a string
        details: body.details?.trim() || "",
        updatedAt: new Date(),
      })
      .where(eq(caseStudies.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error: any) {
    console.error("Error updating case study:", error);
    
    // Try to unwrap Drizzle/PostgreSQL errors
    let dbError = error;
    
    // Check for nested errors (Drizzle sometimes wraps them)
    if (error.cause && typeof error.cause === 'object') {
      dbError = error.cause;
    } else if (error.originalError) {
      dbError = error.originalError;
    } else if (error.original) {
      dbError = error.original;
    }
    
    // Log comprehensive error details
    console.error("Error details:", {
      message: error.message,
      dbErrorMessage: dbError.message,
      code: dbError.code || error.code,
      detail: dbError.detail || error.detail,
      constraint: dbError.constraint || error.constraint,
      table: dbError.table || error.table,
      column: dbError.column || error.column,
      hint: dbError.hint || error.hint,
    });
    
    // Extract error code from message if not in error object
    let errorCode = dbError.code || error.code;
    let errorDetail = dbError.detail || error.detail;
    let errorHint = dbError.hint || error.hint;
    let errorColumn = dbError.column || error.column;
    let errorConstraint = dbError.constraint || error.constraint;
    
    // Try to parse error code from message if it contains "Failed query"
    if (error.message && error.message.includes("Failed query")) {
      const codeMatch = error.message.match(/code: (\w+)/i) || error.message.match(/\((\d{5})\)/);
      if (codeMatch) {
        errorCode = codeMatch[1];
      }
      
      const constraintMatch = error.message.match(/constraint "?(\w+)"?/i);
      if (constraintMatch) {
        errorConstraint = constraintMatch[1];
      }
      
      const columnMatch = error.message.match(/column "?(\w+)"?/i);
      if (columnMatch) {
        errorColumn = columnMatch[1];
      }
    }
    
    // Provide more helpful error messages
    let errorMessage = dbError.message || error.message || "Failed to update case study";
    
    // Handle specific database errors
    if (errorCode === '23505') { // Unique violation
      errorMessage = `A case study with this slug already exists. Please use a different slug.`;
      if (errorConstraint) {
        errorMessage += ` (Constraint: ${errorConstraint})`;
      }
    } else if (errorCode === '23502') { // Not null violation
      errorMessage = `Missing required field: ${errorColumn || 'unknown field'}`;
    } else if (errorCode === '42703') { // Undefined column
      errorMessage = `Database schema mismatch. Column '${errorColumn || 'unknown'}' does not exist. Please run the migration SQL.`;
    } else if (errorCode === '23514') { // Check violation
      errorMessage = `Data validation failed: ${errorDetail || errorMessage}`;
    } else if (errorDetail) {
      errorMessage = `${errorMessage}: ${errorDetail}`;
    } else if (errorHint) {
      errorMessage = `${errorMessage}. ${errorHint}`;
    }
    
    // Clean up error message
    if (errorMessage.startsWith("Failed query:")) {
      errorMessage = errorMessage.replace(/^Failed query:\s*/i, "").trim();
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetail || null,
        hint: errorHint || null,
        code: errorCode || null,
        constraint: errorConstraint || null,
        column: errorColumn || null,
      },
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
