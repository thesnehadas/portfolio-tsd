import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { systems } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET - Public endpoint to fetch all systems (for display on website)
export async function GET() {
  try {
    const allSystems = await db
      .select({
        id: systems.id,
        title: systems.title,
        summary: systems.summary,
        description: systems.description,
        order: systems.order,
      })
      .from(systems)
      .orderBy(asc(systems.order), asc(systems.createdAt));
    
    return NextResponse.json(allSystems);
  } catch (error: any) {
    console.error("Error fetching systems:", error);
    // Return empty array if table doesn't exist yet
    return NextResponse.json([]);
  }
}
