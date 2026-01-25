import { CaseStudyForm } from "@/components/admin/case-study-form";

export default function NewCaseStudyPage() {
  return (
    <div>
      <h1 className="text-3xl font-serif font-semibold text-[#09090b] mb-8">
        New Case Study
      </h1>
      <CaseStudyForm />
    </div>
  );
}
