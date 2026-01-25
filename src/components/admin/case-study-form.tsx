"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

interface CaseStudy {
  id?: string;
  title: string;
  description: string;
  fullDescription: string | null;
  metrics: string;
  details: string | null;
}

export function CaseStudyForm({ initialData }: { initialData?: CaseStudy }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    fullDescription: initialData?.fullDescription || "",
    metrics: initialData?.metrics
      ? JSON.parse(initialData.metrics)
      : [{ label: "", value: "" }, { label: "", value: "" }],
    details: initialData?.details
      ? JSON.parse(initialData.details)
      : [""],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...formData,
        metrics: JSON.stringify(formData.metrics),
        details: JSON.stringify(formData.details.filter((d) => d.trim())),
      };

      const url = initialData?.id
        ? `/api/admin/case-studies/${initialData.id}`
        : "/api/admin/case-studies";
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

      router.push("/admin/case-studies");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateMetric = (index: number, field: "label" | "value", value: string) => {
    const newMetrics = [...formData.metrics];
    newMetrics[index] = { ...newMetrics[index], [field]: value };
    setFormData({ ...formData, metrics: newMetrics });
  };

  const addMetric = () => {
    setFormData({
      ...formData,
      metrics: [...formData.metrics, { label: "", value: "" }],
    });
  };

  const removeMetric = (index: number) => {
    setFormData({
      ...formData,
      metrics: formData.metrics.filter((_, i) => i !== index),
    });
  };

  const updateDetail = (index: number, value: string) => {
    const newDetails = [...formData.details];
    newDetails[index] = value;
    setFormData({ ...formData, details: newDetails });
  };

  const addDetail = () => {
    setFormData({
      ...formData,
      details: [...formData.details, ""],
    });
  };

  const removeDetail = (index: number) => {
    setFormData({
      ...formData,
      details: formData.details.filter((_, i) => i !== index),
    });
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
        />
      </div>

      <div>
        <Label htmlFor="description">Short Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
          className="mt-1"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="fullDescription">Full Description</Label>
        <Textarea
          id="fullDescription"
          value={formData.fullDescription}
          onChange={(e) =>
            setFormData({ ...formData, fullDescription: e.target.value })
          }
          className="mt-1"
          rows={5}
        />
      </div>

      <div>
        <Label>Metrics *</Label>
        <div className="space-y-3 mt-2">
          {formData.metrics.map((metric, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Value (e.g., 80%)"
                value={metric.value}
                onChange={(e) => updateMetric(index, "value", e.target.value)}
                required
              />
              <Input
                placeholder="Label (e.g., Time Saved)"
                value={metric.label}
                onChange={(e) => updateMetric(index, "label", e.target.value)}
                required
              />
              {formData.metrics.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeMetric(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addMetric}>
            Add Metric
          </Button>
        </div>
      </div>

      <div>
        <Label>Key Features</Label>
        <div className="space-y-3 mt-2">
          {formData.details.map((detail, index) => (
            <div key={index} className="flex gap-2">
              <Textarea
                placeholder="Feature description"
                value={detail}
                onChange={(e) => updateDetail(index, e.target.value)}
                className="flex-1"
                rows={2}
              />
              {formData.details.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeDetail(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addDetail}>
            Add Feature
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading} className="bg-[#09090b] text-white">
          {loading ? "Saving..." : initialData?.id ? "Update" : "Create"}
        </Button>
        <Link href="/admin/case-studies">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
