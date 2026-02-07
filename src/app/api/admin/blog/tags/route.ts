import { NextRequest, NextResponse } from "next/server";
import { requireAuthAPI } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { blogTags } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    await requireAuthAPI();
    const all = await db.select().from(blogTags).orderBy(blogTags.name);
    return NextResponse.json(all);
  } catch (error: any) {
    console.error("Error fetching tags:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuthAPI();
    const body = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { error: "Tag name is required" },
        { status: 400 }
      );
    }

    // Check if tag already exists
    const existing = await db
      .select()
      .from(blogTags)
      .where(eq(blogTags.name, body.name.trim()))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(existing[0]);
    }

    const newTag = await db
      .insert(blogTags)
      .values({
        name: body.name.trim(),
      })
      .returning();

    return NextResponse.json(newTag[0]);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error creating tag:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create tag" },
      { status: 500 }
    );
  }
}
