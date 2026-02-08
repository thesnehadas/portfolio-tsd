"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import Link from "next/link";
import { toast } from "sonner";

interface CaseStudy {
  id?: string;
  clientName?: string;
  industry?: string;
  slug?: string;
  featuredImage?: string;
  problemChallenge?: string;
  solutionOverview?: string;
  results?: string;
  keyFeatures?: string;
  technicalStack?: string;
  timeline?: string;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string;
  clientTestimonial?: string;
  status?: string;
  isFeatured?: number;
  // Legacy fields
  title?: string;
  description?: string;
  fullDescription?: string;
  metrics?: string;
  details?: string;
}

export function CaseStudyForm({ initialData }: { initialData?: CaseStudy }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Generate slug from client name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const [formData, setFormData] = useState({
    // Basic Info
    clientName: initialData?.clientName || initialData?.title || "",
    industry: initialData?.industry || "",
    slug: initialData?.slug || "",
    featuredImage: initialData?.featuredImage || "",
    // Content (Rich Text)
    problemChallenge: initialData?.problemChallenge || "",
    solutionOverview: initialData?.solutionOverview || "",
    results: initialData?.results || "",
    keyFeatures: initialData?.keyFeatures || "",
    // Technical Details
    technicalStack: initialData?.technicalStack || "",
    timeline: initialData?.timeline || "",
    // SEO
    metaTitle: initialData?.metaTitle || "",
    metaDescription: initialData?.metaDescription || "",
    tags: initialData?.tags || "",
    // Publishing
    clientTestimonial: initialData?.clientTestimonial || "",
    status: initialData?.status || "draft",
    isFeatured: initialData?.isFeatured || 0,
  });

  // Auto-generate slug when client name changes
  useEffect(() => {
    if (formData.clientName && !initialData?.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(formData.clientName),
      }));
    }
  }, [formData.clientName]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "case-studies");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setFormData((prev) => ({ ...prev, featuredImage: data.url }));
      toast.success("Image uploaded successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = initialData?.id
        ? `/api/admin/case-studies/${initialData.id}`
        : "/api/admin/case-studies";
      const method = initialData?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        // Show more detailed error message
        let errorMsg = data.error || "Failed to save";
        if (data.details) {
          errorMsg += `\n\nDetails: ${data.details}`;
        }
        if (data.code) {
          errorMsg += `\n\nError Code: ${data.code}`;
        }
        throw new Error(errorMsg);
      }

      toast.success(initialData?.id ? "Case study updated!" : "Case study created!");
      router.push("/admin/case-studies");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
          <p className="font-semibold mb-1">Error:</p>
          <pre className="whitespace-pre-wrap text-sm">{error}</pre>
        </div>
      )}

      {/* Basic Info Section */}
      <div className="space-y-4 border-b pb-6">
        <h2 className="text-xl font-semibold text-[#09090b]">Basic Info</h2>
        
        <div>
          <Label htmlFor="clientName">Client Name *</Label>
          <Input
            id="clientName"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            required
            className="mt-1"
            placeholder="e.g., TechCorp"
          />
        </div>

        <div>
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            className="mt-1"
            placeholder="e.g., SaaS, E-commerce"
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
            className="mt-1"
            placeholder="techcorp-ai-automation"
          />
          <p className="text-sm text-[#71717a] mt-1">
            URL-friendly identifier (auto-generated from client name)
          </p>
        </div>

        <div>
          <Label htmlFor="featuredImage">Featured Image</Label>
          <div className="mt-1 space-y-2">
            <Input
              id="featuredImage"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="cursor-pointer"
            />
            {formData.featuredImage && (
              <div className="mt-2">
                <img
                  src={formData.featuredImage}
                  alt="Featured"
                  className="max-w-xs h-auto rounded border"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({ ...formData, featuredImage: "" })}
                  className="mt-2"
                >
                  Remove Image
                </Button>
              </div>
            )}
            {uploadingImage && <p className="text-sm text-[#71717a]">Uploading...</p>}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-4 border-b pb-6">
        <h2 className="text-xl font-semibold text-[#09090b]">Content</h2>
        
        <div>
          <Label htmlFor="problemChallenge">Problem / Challenge</Label>
          <div className="mt-1">
            <RichTextEditor
              content={formData.problemChallenge}
              onChange={(content) =>
                setFormData({ ...formData, problemChallenge: content })
              }
              placeholder="Describe the problem or challenge the client faced..."
            />
          </div>
        </div>

        <div>
          <Label htmlFor="solutionOverview">Solution Overview</Label>
          <div className="mt-1">
            <RichTextEditor
              content={formData.solutionOverview}
              onChange={(content) =>
                setFormData({ ...formData, solutionOverview: content })
              }
              placeholder="Describe the solution you provided..."
            />
          </div>
        </div>

        <div>
          <Label htmlFor="results">Results</Label>
          <div className="mt-1">
            <RichTextEditor
              content={formData.results}
              onChange={(content) =>
                setFormData({ ...formData, results: content })
              }
              placeholder="Describe the results and outcomes..."
            />
          </div>
        </div>

        <div>
          <Label htmlFor="keyFeatures">Key Features</Label>
          <div className="mt-1">
            <RichTextEditor
              content={formData.keyFeatures}
              onChange={(content) =>
                setFormData({ ...formData, keyFeatures: content })
              }
              placeholder="List the key features of the solution..."
            />
          </div>
        </div>
      </div>

      {/* Technical Details Section */}
      <div className="space-y-4 border-b pb-6">
        <h2 className="text-xl font-semibold text-[#09090b]">Technical Details</h2>
        
        <div>
          <Label htmlFor="technicalStack">Technical Stack</Label>
          <Textarea
            id="technicalStack"
            value={formData.technicalStack}
            onChange={(e) =>
              setFormData({ ...formData, technicalStack: e.target.value })
            }
            className="mt-1"
            rows={3}
            placeholder="e.g., Python, React, PostgreSQL, AWS"
          />
        </div>

        <div>
          <Label htmlFor="timeline">Timeline</Label>
          <Input
            id="timeline"
            value={formData.timeline}
            onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
            className="mt-1"
            placeholder="e.g., 3 months, Q1 2024"
          />
        </div>
      </div>

      {/* SEO Section */}
      <div className="space-y-4 border-b pb-6">
        <h2 className="text-xl font-semibold text-[#09090b]">SEO</h2>
        
        <div>
          <Label htmlFor="metaTitle">Meta Title</Label>
          <Input
            id="metaTitle"
            value={formData.metaTitle}
            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
            className="mt-1"
            placeholder="SEO title for search engines"
          />
        </div>

        <div>
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Textarea
            id="metaDescription"
            value={formData.metaDescription}
            onChange={(e) =>
              setFormData({ ...formData, metaDescription: e.target.value })
            }
            className="mt-1"
            rows={3}
            placeholder="SEO description for search engines"
          />
        </div>

        <div>
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="mt-1"
            placeholder="Comma-separated tags: AI, Marketing, Automation"
          />
        </div>
      </div>

      {/* Publishing Section */}
      <div className="space-y-4 border-b pb-6">
        <h2 className="text-xl font-semibold text-[#09090b]">Publishing</h2>
        
        <div>
          <Label htmlFor="clientTestimonial">Client Testimonial</Label>
          <Textarea
            id="clientTestimonial"
            value={formData.clientTestimonial}
            onChange={(e) =>
              setFormData({ ...formData, clientTestimonial: e.target.value })
            }
            className="mt-1"
            rows={4}
            placeholder="Quote from the client about the project..."
          />
        </div>

        <div className="flex gap-6">
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured === 1}
              onChange={(e) =>
                setFormData({ ...formData, isFeatured: e.target.checked ? 1 : 0 })
              }
              className="w-4 h-4"
            />
            <Label htmlFor="isFeatured" className="cursor-pointer">
              Featured (show on home page)
            </Label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#09090b] text-white"
        >
          {loading
            ? "Saving..."
            : formData.status === "draft"
            ? "Save as Draft"
            : "Publish"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={async () => {
            const draftData = { ...formData, status: "draft" };
            setFormData(draftData);
            setError("");
            setLoading(true);
            try {
              const url = initialData?.id
                ? `/api/admin/case-studies/${initialData.id}`
                : "/api/admin/case-studies";
              const method = initialData?.id ? "PUT" : "POST";
              const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(draftData),
              });
              if (!res.ok) {
                const data = await res.json();
                // Show more detailed error message
                let errorMsg = data.error || "Failed to save";
                if (data.details) {
                  errorMsg += `\n\nDetails: ${data.details}`;
                }
                if (data.code) {
                  errorMsg += `\n\nError Code: ${data.code}`;
                }
                throw new Error(errorMsg);
              }
              toast.success("Saved as draft!");
              router.push("/admin/case-studies");
              router.refresh();
            } catch (err: any) {
              setError(err.message || "Something went wrong");
              toast.error(err.message || "Something went wrong");
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
        >
          Save as Draft
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
