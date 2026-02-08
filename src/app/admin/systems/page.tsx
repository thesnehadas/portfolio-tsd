import { db } from "@/lib/db";
import { systems } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { requireAuth } from "@/lib/auth-helpers";
import { DeleteSystemButton } from "@/components/admin/delete-system-button";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SystemsPage() {
  await requireAuth();

  let allSystems = [];
  let error = null;

  try {
    allSystems = await db
      .select()
      .from(systems)
      .orderBy(desc(systems.order), desc(systems.createdAt));
  } catch (err: any) {
    console.error("Error fetching systems:", err);
    error = err.message || "Failed to load systems";
    if (err.message?.includes("does not exist") || err.message?.includes("relation") || err.code === "42P01") {
      error = "Database tables not set up. Please run migrations in Supabase.";
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-[#09090b] mb-2">
            Systems
          </h1>
          <p className="text-[#71717a]">Manage your systems and toolkits</p>
        </div>
        <Link href="/admin/systems/new">
          <Button className="bg-[#09090b] text-white hover:bg-[#09090b]/90">
            <Plus className="w-4 h-4 mr-2" />
            New System
          </Button>
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 font-medium mb-2">⚠️ Setup Required</p>
          <p className="text-yellow-700 text-sm">{error}</p>
          <p className="text-yellow-700 text-sm mt-2">
            Please run the SQL migration in your Supabase SQL Editor.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {!error && allSystems.length === 0 ? (
          <div className="text-center py-12 text-[#71717a]">
            <p>No systems yet. Create your first one!</p>
          </div>
        ) : !error ? (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#f4f4f5]">
                <tr>
                  <th className="text-left p-4 font-semibold text-[#09090b]">Title</th>
                  <th className="text-left p-4 font-semibold text-[#09090b]">Summary</th>
                  <th className="text-left p-4 font-semibold text-[#09090b]">Order</th>
                  <th className="text-left p-4 font-semibold text-[#09090b]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allSystems.map((system) => (
                  <tr key={system.id} className="border-t hover:bg-[#fafafa]">
                    <td className="p-4">
                      <div className="font-medium text-[#09090b]">{system.title}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-[#71717a] line-clamp-2 max-w-md">
                        {system.summary}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-[#71717a]">
                      {system.order}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link href={`/admin/systems/${system.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <DeleteSystemButton systemId={system.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
