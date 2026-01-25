import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { TestimonialForm } from "@/components/admin/testimonial-form";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);

  if (!testimonial[0]) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-serif font-semibold text-[#09090b] mb-8">
        Edit Testimonial
      </h1>
      <TestimonialForm initialData={testimonial[0]} />
    </div>
  );
}
