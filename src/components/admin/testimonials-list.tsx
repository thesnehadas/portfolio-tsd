"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function TestimonialsList({ initialData }: { initialData: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState(initialData);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setTestimonials(testimonials.filter((t) => t.id !== id));
      setDeleteId(null);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete testimonial");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {testimonials.length === 0 ? (
          <div className="bg-white border-2 border-[#4a3728]/30 rounded-lg p-12 text-center">
            <p className="text-[#71717a]">No testimonials yet. Create your first one!</p>
          </div>
        ) : (
          testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white border-2 border-[#4a3728]/30 rounded-lg p-6 hover:border-[#4a3728] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-lg font-serif italic text-[#09090b] mb-4">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="text-[#71717a]">
                    <p className="font-semibold text-[#09090b]">{testimonial.author}</p>
                    <p className="text-sm">
                      {testimonial.role}
                      {testimonial.company && ` at ${testimonial.company}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link href={`/admin/testimonials/${testimonial.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteId(testimonial.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Testimonial</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this testimonial? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
