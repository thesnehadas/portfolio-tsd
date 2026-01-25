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
  const allCaseStudies = await db.select().from(caseStudies).orderBy(desc(caseStudies.createdAt));

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

      <CaseStudiesList initialData={allCaseStudies} />
    </div>
  );
}
