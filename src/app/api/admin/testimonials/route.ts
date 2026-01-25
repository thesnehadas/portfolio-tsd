import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";

export async function GET() {
  try {
    await requireAuth();
    const all = await db.select().from(testimonials);
    return NextResponse.json(all);
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();

    const newTestimonial = await db
      .insert(testimonials)
      .values({
        quote: body.quote,
        author: body.author,
        role: body.role,
        company: body.company || null,
      })
      .returning();

    return NextResponse.json(newTestimonial[0]);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
