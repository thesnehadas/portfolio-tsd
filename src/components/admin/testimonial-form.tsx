"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

interface Testimonial {
  id?: string;
  quote: string;
  author: string;
  role: string;
  company: string | null;
}

export function TestimonialForm({ initialData }: { initialData?: Testimonial }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    quote: initialData?.quote || "",
    author: initialData?.author || "",
    role: initialData?.role || "",
    company: initialData?.company || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...formData,
        company: formData.company || null,
      };

      const url = initialData?.id
        ? `/api/admin/testimonials/${initialData.id}`
        : "/api/admin/testimonials";
      const method = initialData?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      router.push("/admin/testimonials");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="quote">Quote *</Label>
        <Textarea
          id="quote"
          value={formData.quote}
          onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
          required
          className="mt-1"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="author">Author Name *</Label>
        <Input
          id="author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="role">Role *</Label>
        <Input
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="mt-1"
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading} className="bg-[#09090b] text-white">
          {loading ? "Saving..." : initialData?.id ? "Update" : "Create"}
        </Button>
        <Link href="/admin/testimonials">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
