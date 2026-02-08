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
            <p className="text-sm text-red-600 mb-3 font-semibold">To fix this, run this SQL in your Supabase SQL Editor:</p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-x-auto mb-3">
              <pre className="whitespace-pre-wrap">{`-- Update case_studies table with new fields
ALTER TABLE case_studies 
ADD COLUMN IF NOT EXISTS client_name TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS featured_image TEXT,
ADD COLUMN IF NOT EXISTS problem_challenge TEXT,
ADD COLUMN IF NOT EXISTS solution_overview TEXT,
ADD COLUMN IF NOT EXISTS results TEXT,
ADD COLUMN IF NOT EXISTS key_features TEXT,
ADD COLUMN IF NOT EXISTS technical_stack TEXT,
ADD COLUMN IF NOT EXISTS timeline TEXT,
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT,
ADD COLUMN IF NOT EXISTS client_testimonial TEXT,
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS is_featured INTEGER NOT NULL DEFAULT 0;

-- Make slug unique after adding it
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'case_studies_slug_unique' 
    AND conrelid = 'case_studies'::regclass
  ) THEN
    ALTER TABLE case_studies ADD CONSTRAINT case_studies_slug_unique UNIQUE (slug);
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_status ON case_studies(status);
CREATE INDEX IF NOT EXISTS idx_case_studies_is_featured ON case_studies(is_featured);

-- Migrate existing data
UPDATE case_studies 
SET client_name = COALESCE(title, 'Untitled Case Study')
WHERE client_name IS NULL;

UPDATE case_studies 
SET slug = LOWER(REPLACE(REPLACE(REPLACE(REPLACE(COALESCE(client_name, title, 'untitled'), ' ', '-'), '_', '-'), '--', '-'), '---', '-')) || '-' || SUBSTRING(id, 1, 8)
WHERE slug IS NULL;

UPDATE case_studies 
SET status = 'published' 
WHERE status IS NULL;`}</pre>
            </div>
            <p className="text-xs text-red-600">
              After running the SQL, refresh this page.
            </p>
          </div>
        </div>
      ) : (
        <CaseStudiesList initialData={allCaseStudies} />
      )}
    </div>
  );
}
