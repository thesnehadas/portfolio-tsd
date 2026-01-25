import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TestimonialsList } from "@/components/admin/testimonials-list";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TestimonialsPage() {
  const allTestimonials = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-[#09090b] mb-2">
            Testimonials
          </h1>
          <p className="text-[#71717a]">
            Manage client testimonials
          </p>
        </div>
        <Link href="/admin/testimonials/new">
          <Button className="bg-[#09090b] text-white hover:bg-[#09090b]/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Testimonial
          </Button>
        </Link>
      </div>

      <TestimonialsList initialData={allTestimonials} />
    </div>
  );
}
