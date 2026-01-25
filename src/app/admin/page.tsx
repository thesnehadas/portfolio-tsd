import { getSession } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { caseStudies, testimonials, socialProof } from "@/lib/db/schema";
import { count } from "drizzle-orm";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboard() {
  const session = await getSession();
  
  const caseStudiesCount = await db.select({ count: count() }).from(caseStudies);
  const testimonialsCount = await db.select({ count: count() }).from(testimonials);
  const socialProofCount = await db.select({ count: count() }).from(socialProof);

  return (
    <div>
      <h1 className="text-3xl font-serif font-semibold text-[#09090b] mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-[#4a3728]/30 rounded-lg p-6 hover:border-[#4a3728] transition-colors">
          <h3 className="text-lg font-semibold text-[#09090b] mb-2">Case Studies</h3>
          <p className="text-3xl font-serif font-bold text-[#09090b]">
            {caseStudiesCount[0]?.count || 0}
          </p>
        </div>

        <div className="bg-white border-2 border-[#4a3728]/30 rounded-lg p-6 hover:border-[#4a3728] transition-colors">
          <h3 className="text-lg font-semibold text-[#09090b] mb-2">Testimonials</h3>
          <p className="text-3xl font-serif font-bold text-[#09090b]">
            {testimonialsCount[0]?.count || 0}
          </p>
        </div>

        <div className="bg-white border-2 border-[#4a3728]/30 rounded-lg p-6 hover:border-[#4a3728] transition-colors">
          <h3 className="text-lg font-semibold text-[#09090b] mb-2">Social Proof</h3>
          <p className="text-3xl font-serif font-bold text-[#09090b]">
            {socialProofCount[0]?.count || 0}
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white border-2 border-[#4a3728]/30 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[#09090b] mb-4">Welcome back!</h2>
        <p className="text-[#71717a]">
          You're logged in as <strong>{session?.user?.email}</strong>
        </p>
      </div>
    </div>
  );
}
