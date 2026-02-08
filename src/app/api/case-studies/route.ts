import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { caseStudies } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET - Public endpoint to fetch case studies
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const status = searchParams.get("status") || "published";

    let query = db.select().from(caseStudies);

    // Filter by status
    if (status === "published") {
      query = query.where(eq(caseStudies.status, "published"));
    }

    // Filter by featured
    if (featured === "true") {
      query = query.where(eq(caseStudies.isFeatured, 1));
    }

    const allCaseStudies = await query.orderBy(desc(caseStudies.createdAt));
    
    return NextResponse.json(allCaseStudies);
  } catch (error: any) {
    console.error("Error fetching case studies:", error);
    // Return empty array if table doesn't exist yet
    return NextResponse.json([]);
  }
}
