import { db } from "@/lib/db";
import { systems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth-helpers";
import { SystemForm } from "@/components/admin/system-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EditSystemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;

  let system = null;
  let error = null;

  try {
    [system] = await db.select().from(systems).where(eq(systems.id, id)).limit(1);
  } catch (err: any) {
    console.error("Error fetching system:", err);
    error = err.message || "Failed to load system";
    if (err.message?.includes("does not exist") || err.message?.includes("relation") || err.code === "42P01") {
      error = "Database tables not set up. Please run migrations in Supabase.";
    }
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-serif font-semibold text-[#09090b] mb-8">
          Edit System
        </h1>
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 font-medium mb-2">⚠️ Setup Required</p>
          <p className="text-yellow-700 text-sm">{error}</p>
          <p className="text-yellow-700 text-sm mt-2">
            Please run the SQL migration in your Supabase SQL Editor.
          </p>
        </div>
      </div>
    );
  }

  if (!system) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-serif font-semibold text-[#09090b] mb-8">
        Edit System
      </h1>
      <SystemForm initialData={system} />
    </div>
  );
}
