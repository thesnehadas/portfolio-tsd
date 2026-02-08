import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET - Public endpoint to fetch all testimonials (for display on website)
export async function GET() {
  try {
    const allTestimonials = await db
      .select({
        id: testimonials.id,
        quote: testimonials.quote,
        author: testimonials.author,
        role: testimonials.role,
        company: testimonials.company,
      })
      .from(testimonials)
      .orderBy(desc(testimonials.createdAt));
    
    return NextResponse.json(allTestimonials);
  } catch (error: any) {
    console.error("Error fetching testimonials:", error);
    // Return empty array if table doesn't exist yet
    return NextResponse.json([]);
  }
}
