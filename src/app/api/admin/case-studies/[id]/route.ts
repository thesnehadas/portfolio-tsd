import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { caseStudies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();

    const updated = await db
      .update(caseStudies)
      .set({
        title: body.title,
        description: body.description,
        fullDescription: body.fullDescription || null,
        metrics: body.metrics,
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
    await requireAuth();
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
