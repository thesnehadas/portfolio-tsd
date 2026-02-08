import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { systems } from "@/lib/db/schema";
import { requireAuthAPI } from "@/lib/auth-helpers";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET - Get single system
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuthAPI(request);
    const { id } = await params;
    
    const [system] = await db
      .select()
      .from(systems)
      .where(eq(systems.id, id))
      .limit(1);
    
    if (!system) {
      return NextResponse.json({ error: "System not found" }, { status: 404 });
    }
    
    return NextResponse.json(system);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching system:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch system" },
      { status: 500 }
    );
  }
}

// PUT - Update system
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuthAPI(request);
    const { id } = await params;
    
    const body = await request.json();
    const { title, summary, description, order } = body;

    if (!title || !summary || !description) {
      return NextResponse.json(
        { error: "Title, summary, and description are required" },
        { status: 400 }
      );
    }

    const [updatedSystem] = await db
      .update(systems)
      .set({
        title: title.trim(),
        summary: summary.trim(),
        description: description.trim(),
        order: order || 0,
        updatedAt: new Date(),
      })
      .where(eq(systems.id, id))
      .returning();

    if (!updatedSystem) {
      return NextResponse.json({ error: "System not found" }, { status: 404 });
    }

    return NextResponse.json(updatedSystem);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating system:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update system" },
      { status: 500 }
    );
  }
}

// DELETE - Delete system
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuthAPI(request);
    const { id } = await params;
    
    const [deletedSystem] = await db
      .delete(systems)
      .where(eq(systems.id, id))
      .returning();

    if (!deletedSystem) {
      return NextResponse.json({ error: "System not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error deleting system:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete system" },
      { status: 500 }
    );
  }
}
