import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { caseStudies } from "@/lib/db/schema";

export async function GET() {
  try {
    await requireAuth();
    const all = await db.select().from(caseStudies);
    return NextResponse.json(all);
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();

    const newStudy = await db
      .insert(caseStudies)
      .values({
        title: body.title,
        description: body.description,
        fullDescription: body.fullDescription || null,
        metrics: body.metrics,
        details: body.details || null,
      })
      .returning();

    return NextResponse.json(newStudy[0]);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create case study" },
      { status: 500 }
    );
  }
}
