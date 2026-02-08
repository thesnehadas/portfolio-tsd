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

// Helper function to retry database operations on connection pool errors
async function retryDbOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3, // Increased retries
  initialDelayMs = 500 // Start with shorter delay
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a connection pool error
      const isPoolError = 
        error.message?.includes('MaxClientsInSessionMode') ||
        error.message?.includes('max clients reached') ||
        error.message?.includes('connection limit') ||
        error.message?.includes('connection') ||
        error.code === '57P01' || // Admin shutdown
        error.code === '57P02' || // Crash shutdown
        error.code === '57P03';    // Cannot connect now
      
      if (isPoolError && attempt < maxRetries) {
        // Exponential backoff with jitter
        const baseDelay = initialDelayMs * Math.pow(2, attempt);
        const jitter = Math.random() * 500; // Add random jitter up to 500ms
        const waitTime = baseDelay + jitter;
        
        console.log(`Connection pool error (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${Math.round(waitTime)}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      // Not a retryable error or max retries reached
      throw error;
    }
  }
  
  throw lastError;
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

    // Check if slug already exists (with retry)
    const existing = await retryDbOperation(async () => {
      return await db
        .select()
        .from(caseStudies)
        .where(eq(caseStudies.slug, slug))
        .limit(1);
    });

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
    
    // Validate status value
    if (status !== "draft" && status !== "published") {
      return NextResponse.json(
        { error: "Status must be either 'draft' or 'published'" },
        { status: 400 }
      );
    }

    // Prepare values object
    const values = {
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
      // Ensure description is always set (even if empty) to avoid NOT NULL constraint issues
      description: nullIfEmpty(body.description) || nullIfEmpty(body.metaDescription) || null,
      fullDescription: nullIfEmpty(body.fullDescription),
      // Metrics has NOT NULL constraint, so ensure it's never null
      metrics: body.metrics && body.metrics.trim() ? body.metrics.trim() : "",
      // Details also might have NOT NULL constraint
      details: body.details && body.details.trim() ? body.details.trim() : "",
    };

    // Log the values being inserted (for debugging - remove sensitive data in production)
    console.log("Inserting case study with values:", {
      clientName: values.clientName,
      slug: values.slug,
      status: values.status,
      isFeatured: values.isFeatured,
      hasProblemChallenge: !!values.problemChallenge,
      hasSolutionOverview: !!values.solutionOverview,
    });

    // Insert with retry logic for connection pool errors
    const newStudy = await retryDbOperation(async () => {
      return await db
        .insert(caseStudies)
        .values(values)
        .returning();
    });

    return NextResponse.json(newStudy[0]);
  } catch (error: any) {
    console.error("Error creating case study:", error);
    
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
      // Log the full error structure for debugging
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
    });
    
    // Extract error code from message if not in error object
    let errorCode = dbError.code || error.code;
    let errorDetail = dbError.detail || error.detail;
    let errorHint = dbError.hint || error.hint;
    let errorColumn = dbError.column || error.column;
    let errorConstraint = dbError.constraint || error.constraint;
    
    // Try to parse error code from message if it contains "Failed query"
    if (error.message && error.message.includes("Failed query")) {
      // Extract PostgreSQL error codes from the message
      const codeMatch = error.message.match(/code: (\w+)/i) || error.message.match(/\((\d{5})\)/);
      if (codeMatch) {
        errorCode = codeMatch[1];
      }
      
      // Try to extract constraint name
      const constraintMatch = error.message.match(/constraint "?(\w+)"?/i);
      if (constraintMatch) {
        errorConstraint = constraintMatch[1];
      }
      
      // Try to extract column name
      const columnMatch = error.message.match(/column "?(\w+)"?/i);
      if (columnMatch) {
        errorColumn = columnMatch[1];
      }
    }
    
    // Provide more helpful error messages
    let errorMessage = dbError.message || error.message || "Failed to create case study";
    
    // Handle connection pool errors specifically
    if (
      errorMessage.includes('MaxClientsInSessionMode') ||
      errorMessage.includes('max clients reached') ||
      errorCode === '57P01' || errorCode === '57P02' || errorCode === '57P03'
    ) {
      errorMessage = "Database connection limit reached. Please try again in a moment. If this persists, the connection pool may need adjustment.";
    }
    
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
    
    // Clean up error message - remove "Failed query:" prefix if present
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
