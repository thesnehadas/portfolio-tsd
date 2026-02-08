"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

interface System {
  id?: string;
  title: string;
  summary: string;
  description: string;
  order: number;
}

export function SystemForm({ initialData }: { initialData?: System }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    summary: initialData?.summary || "",
    description: initialData?.description || "",
    order: initialData?.order || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        title: formData.title.trim(),
        summary: formData.summary.trim(),
        description: formData.description.trim(),
        order: Number(formData.order) || 0,
      };

      const url = initialData?.id
        ? `/api/admin/systems/${initialData.id}`
        : "/api/admin/systems";
      const method = initialData?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) {
          setError("You are not authorized. Please log in again.");
          setTimeout(() => {
            window.location.href = "/admin/login";
          }, 2000);
          return;
        }
        throw new Error(data.error || "Failed to save");
      }

      window.location.href = "/admin/systems";
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
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="mt-1"
          placeholder="e.g., AI Marketing Workflow Toolkit"
        />
      </div>

      <div>
        <Label htmlFor="summary">Summary (Short Description) *</Label>
        <Textarea
          id="summary"
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          required
          className="mt-1"
          rows={3}
          placeholder="Short description shown on the card (e.g., How to use ChatGPT to speed up your marketing processes.)"
        />
        <p className="text-sm text-[#71717a] mt-1">
          This is the short description that appears on the system card.
        </p>
      </div>

      <div>
        <Label htmlFor="description">Description (Full Description) *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          className="mt-1"
          rows={8}
          placeholder="Full description shown in the dialog when someone clicks on the system"
        />
        <p className="text-sm text-[#71717a] mt-1">
          This is the detailed description that appears in the dialog when someone requests access.
        </p>
      </div>

      <div>
        <Label htmlFor="order">Order</Label>
        <Input
          id="order"
          type="number"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
          className="mt-1"
          placeholder="0"
        />
        <p className="text-sm text-[#71717a] mt-1">
          Lower numbers appear first. Default is 0.
        </p>
      </div>

      <div className="flex gap-4 pt-6">
        <Button type="submit" disabled={loading} className="bg-[#09090b] text-white">
          {loading ? "Saving..." : initialData?.id ? "Update" : "Create"}
        </Button>
        <Link href="/admin/systems">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
