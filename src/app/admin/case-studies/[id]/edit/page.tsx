import { db } from "@/lib/db";
import { caseStudies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { CaseStudyForm } from "@/components/admin/case-study-form";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EditCaseStudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const study = await db.select().from(caseStudies).where(eq(caseStudies.id, id)).limit(1);

  if (!study[0]) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-serif font-semibold text-[#09090b] mb-8">
        Edit Case Study
      </h1>
      <CaseStudyForm initialData={study[0]} />
    </div>
  );
}
