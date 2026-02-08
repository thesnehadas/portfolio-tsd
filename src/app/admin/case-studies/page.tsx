import { db } from "@/lib/db";
import { caseStudies } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { CaseStudiesList } from "@/components/admin/case-studies-list";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CaseStudiesPage() {
  let allCaseStudies = [];
  let error = null;

  try {
    allCaseStudies = await db.select().from(caseStudies).orderBy(desc(caseStudies.createdAt));
  } catch (err: any) {
    console.error("Error fetching case studies:", err);
    error = err.message || "Failed to fetch case studies";
    
    // Check if it's a column doesn't exist error
    if (err.message?.includes("column") || err.message?.includes("does not exist")) {
      error = "Database schema not updated. Please run the SQL migration in Supabase.";
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-[#09090b] mb-2">
            Case Studies
          </h1>
          <p className="text-[#71717a]">
            Manage your case studies and showcase your work
          </p>
        </div>
        <Link href="/admin/case-studies/new">
          <Button className="bg-[#09090b] text-white hover:bg-[#09090b]/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Case Study
          </Button>
        </Link>
      </div>

      {error ? (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Setup Required</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="bg-white p-4 rounded border border-red-200">
            <p className="text-sm text-red-600 mb-2 font-semibold">To fix this:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-red-600">
              <li>Open your Supabase SQL Editor</li>
              <li>Copy the contents of <code className="bg-red-50 px-1 rounded">drizzle/create_case_studies_table_updated.sql</code></li>
              <li>Run the SQL migration</li>
              <li>Refresh this page</li>
            </ol>
          </div>
        </div>
      ) : (
        <CaseStudiesList initialData={allCaseStudies} />
      )}
    </div>
  );
}
