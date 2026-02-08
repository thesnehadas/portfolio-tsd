import { requireAuth } from "@/lib/auth-helpers";
import { SystemForm } from "@/components/admin/system-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NewSystemPage() {
  await requireAuth();

  return (
    <div>
      <h1 className="text-3xl font-serif font-semibold text-[#09090b] mb-8">
        New System
      </h1>
      <SystemForm />
    </div>
  );
}
