import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { systems } from "@/lib/db/schema";
import { requireAuthAPI } from "@/lib/auth-helpers";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET - List all systems
export async function GET(request: NextRequest) {
  try {
    await requireAuthAPI(request);
    
    const allSystems = await db
      .select()
      .from(systems)
      .orderBy(desc(systems.order), desc(systems.createdAt));
    
    return NextResponse.json(allSystems);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching systems:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch systems" },
      { status: 500 }
    );
  }
}

// POST - Create new system
export async function POST(request: NextRequest) {
  try {
    await requireAuthAPI(request);
    
    const body = await request.json();
    const { title, summary, description, order } = body;

    if (!title || !summary || !description) {
      return NextResponse.json(
        { error: "Title, summary, and description are required" },
        { status: 400 }
      );
    }

    const [newSystem] = await db
      .insert(systems)
      .values({
        title: title.trim(),
        summary: summary.trim(),
        description: description.trim(),
        order: order || 0,
      })
      .returning();

    return NextResponse.json(newSystem, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error creating system:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create system" },
      { status: 500 }
    );
  }
}
