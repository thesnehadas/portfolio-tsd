import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

// Ensure this route is always accessible and not cached
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Keep-alive endpoint to prevent Supabase project from auto-pausing
 * This endpoint makes a minimal database query to register activity
 * Should be called periodically (every 6 days) via GitHub Actions
 */
export async function GET() {
  try {
    // Make a simple, lightweight query to keep the database active
    // Using SELECT 1 is the most efficient way to test connectivity
    const result = await db.execute(sql`SELECT 1 as keepalive`);
    
    return NextResponse.json(
      {
        status: "success",
        message: "Database keep-alive successful",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    // Even if there's an error, we log it but don't fail completely
    // This ensures the endpoint is always accessible
    console.error("Keep-alive error:", error.message);
    
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection issue",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
