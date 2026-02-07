"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { X, Plus, Upload } from "lucide-react";

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  primaryKeyword: string | null;
  secondaryKeywords: string | null;
  searchIntent: string | null;
  content: string;
  featuredImage: string | null;
  featuredImageAlt: string | null;
  featuredImageCaption: string | null;
  category: string | null;
  tags: string | null; // JSON array of tag IDs
  status: string;
  isFeatured: number;
  publishDate: string | null;
  schemaType: string | null;
}

interface BlogTag {
  id: string;
  name: string;
}

const SCHEMA_TYPES = [
  "Article",
  "BlogPosting",
  "NewsArticle",
  "TechArticle",
  "HowTo",
  "FAQPage",
  "Review",
  "VideoObject",
];

export function BlogForm({ initialData, existingTags }: { initialData?: BlogPost; existingTags?: BlogTag[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableTags, setAvailableTags] = useState<BlogTag[]>(existingTags || []);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(() => {
    if (initialData?.tags) {
      try {
        const parsed = JSON.parse(initialData.tags);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [newTagName, setNewTagName] = useState("");

  const [formData, setFormData] = useState(() => {
    const toDateInputValue = (value: unknown) => {
      if (!value) return "";

      // Handle Date objects directly
      if (value instanceof Date) {
        if (!isNaN(value.getTime())) {
          const year = value.getFullYear();
          const month = String(value.getMonth() + 1).padStart(2, "0");
          const day = String(value.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        }
        return "";
      }

      // Convert anything else to string safely
      const valueStr = typeof value === "string" ? value : String(value);
      const date = new Date(valueStr);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }

      return "";
    };

    const publishDateStr = toDateInputValue(initialData?.publishDate);

    return {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      excerpt: initialData?.excerpt || "",
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      primaryKeyword: initialData?.primaryKeyword || "",
      secondaryKeywords: initialData?.secondaryKeywords || "",
      searchIntent: initialData?.searchIntent || "",
      content: initialData?.content || "",
      featuredImage: initialData?.featuredImage || "",
      featuredImageAlt: initialData?.featuredImageAlt || "",
      featuredImageCaption: initialData?.featuredImageCaption || "",
      category: initialData?.category || "",
      status: initialData?.status || "draft",
      isFeatured: initialData?.isFeatured === 1,
      publishDate: publishDateStr,
      schemaType: initialData?.schemaType || "",
    };
  });

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (value: string) => {
    setFormData({ ...formData, title: value });
    if (!initialData?.slug || formData.slug === generateSlug(initialData.title || "")) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, featuredImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addNewTag = async () => {
    if (!newTagName.trim()) return;

    // Check if tag already exists
    const existingTag = availableTags.find(
      (tag) => tag.name.toLowerCase() === newTagName.trim().toLowerCase()
    );
    if (existingTag) {
      if (!selectedTagIds.includes(existingTag.id)) {
        setSelectedTagIds([...selectedTagIds, existingTag.id]);
      }
      setNewTagName("");
      return;
    }

    // Create new tag via API
    try {
      const res = await fetch("/api/admin/blog/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTagName.trim() }),
      });

      if (res.ok) {
        const newTag = await res.json();
        setAvailableTags([...availableTags, newTag]);
        setSelectedTagIds([...selectedTagIds, newTag.id]);
        setNewTagName("");
      } else {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 401) {
          alert("You are not authorized. Please log in again.");
          window.location.href = "/admin/login";
        } else {
          throw new Error(errorData.error || "Failed to create tag");
        }
      }
    } catch (err: any) {
      console.error("Error creating tag:", err);
      alert(err.message || "Failed to create tag. Please try again.");
    }
  };

  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...formData,
        tags: JSON.stringify(selectedTagIds),
        isFeatured: formData.isFeatured ? 1 : 0,
        publishDate: formData.publishDate || null,
      };

      const url = initialData?.id
        ? `/api/admin/blog/${initialData.id}`
        : "/api/admin/blog";
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

      const result = await res.json();
      // Use window.location for reliable redirect
      window.location.href = "/admin/blog";
    } catch (err: any) {
      console.error("Error submitting form:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      {/* Core Content Section */}
      <div className="space-y-6 border-b pb-6">
        <h2 className="text-xl font-semibold text-[#09090b]">Core Content</h2>
        
        <div>
          <Label htmlFor="title">Article Title (H1) *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug / URL *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
            className="mt-1"
            placeholder="article-url-slug"
          />
          <p className="text-sm text-[#71717a] mt-1">
            URL-friendly version of the title (auto-generated from title)
          </p>
        </div>

        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="mt-1"
            rows={3}
            placeholder="Brief summary of the article"
          />
        </div>
      </div>

      {/* SEO Meta Section */}
      <div className="space-y-6 border-b pb-6">
        <h2 className="text-xl font-semibold text-[#09090b]">SEO Meta</h2>
        
        <div>
          <Label htmlFor="metaTitle">Meta Title</Label>
          <Input
            id="metaTitle"
            value={formData.metaTitle}
            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
            className="mt-1"
            placeholder="SEO title (defaults to article title if empty)"
          />
        </div>

        <div>
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Textarea
            id="metaDescription"
            value={formData.metaDescription}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
            className="mt-1"
            rows={2}
            placeholder="SEO meta description (150-160 characters recommended)"
          />
        </div>
      </div>

      {/* Keywords Section */}
      <div className="space-y-6 border-b pb-6">
        <h2 className="text-xl font-semibold text-[#09090b]">Keywords</h2>
        
        <div>
          <Label htmlFor="primaryKeyword">Primary Keyword</Label>
          <Input
            id="primaryKeyword"
            value={formData.primaryKeyword}
            onChange={(e) => setFormData({ ...formData, primaryKeyword: e.target.value })}
            className="mt-1"
            placeholder="Main keyword for SEO"
          />
        </div>

        <div>
          <Label htmlFor="secondaryKeywords">Secondary Keywords (comma-separated)</Label>
          <Input
            id="secondaryKeywords"
            value={formData.secondaryKeywords}
            onChange={(e) => setFormData({ ...formData, secondaryKeywords: e.target.value })}
            className="mt-1"
            placeholder="keyword1, keyword2, keyword3"
          />
        </div>

        <div>
          <Label htmlFor="searchIntent">Search Intent</Label>
          <Input
            id="searchIntent"
            value={formData.searchIntent}
            onChange={(e) => setFormData({ ...formData, searchIntent: e.target.value })}
            className="mt-1"
            placeholder="e.g., informational, commercial, transactional"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-6 border-b pb-6">
        <h2 className="text-xl font-semibold text-[#09090b]">Content</h2>
        
        <div>
          <Label htmlFor="content">Main Content (Markdown supported) *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            className="mt-1 font-mono text-sm"
            rows={20}
            placeholder="Write your article content in Markdown format..."
          />
          <p className="text-sm text-[#71717a] mt-1">
            Supports full Markdown syntax including headers, lists, links, code blocks, etc.
          </p>
        </div>
      </div>

      {/* Featured Image Section */}
      <div className="space-y-6 border-b pb-6">
        <h2 className="text-xl font-semibold text-[#09090b]">Featured Image</h2>
        
        <div>
          <Label htmlFor="featuredImage">Image URL</Label>
          <Input
            id="featuredImage"
            value={formData.featuredImage}
            onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
            className="mt-1"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <Label htmlFor="imageUpload">Or Upload Image File</Label>
          <div className="mt-1 flex items-center gap-2">
            <Input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="flex-1"
            />
            {formData.featuredImage && formData.featuredImage.startsWith("data:") && (
              <span className="text-sm text-green-600">✓ Image loaded</span>
            )}
          </div>
        </div>

        {formData.featuredImage && (
          <div className="mt-4">
            <img
              src={formData.featuredImage}
              alt="Preview"
              className="max-w-md h-auto rounded border"
            />
          </div>
        )}

        <div>
          <Label htmlFor="featuredImageAlt">Alt Text</Label>
          <Input
            id="featuredImageAlt"
            value={formData.featuredImageAlt}
            onChange={(e) => setFormData({ ...formData, featuredImageAlt: e.target.value })}
            className="mt-1"
            placeholder="Descriptive alt text for accessibility"
          />
        </div>

        <div>
          <Label htmlFor="featuredImageCaption">Caption</Label>
          <Input
            id="featuredImageCaption"
            value={formData.featuredImageCaption}
            onChange={(e) => setFormData({ ...formData, featuredImageCaption: e.target.value })}
            className="mt-1"
            placeholder="Optional image caption"
          />
        </div>
      </div>

      {/* Organization Section */}
      <div className="space-y-6 border-b pb-6">
        <h2 className="text-xl font-semibold text-[#09090b]">Organization</h2>
        
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="mt-1"
            placeholder="e.g., AI, Marketing, Engineering"
          />
        </div>

        <div>
          <Label>Tags</Label>
          <div className="mt-2 space-y-3">
            {/* Existing Tags */}
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    selectedTagIds.includes(tag.id)
                      ? "bg-[#09090b] text-white border-[#09090b]"
                      : "bg-white text-[#09090b] border-[#e4e4e7] hover:border-[#09090b]"
                  }`}
                >
                  {tag.name}
                  {selectedTagIds.includes(tag.id) && (
                    <X className="inline-block w-3 h-3 ml-1" />
                  )}
                </button>
              ))}
            </div>

            {/* Add New Tag */}
            <div className="flex gap-2">
              <Input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addNewTag();
                  }
                }}
                placeholder="Type new tag name and press Enter"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addNewTag}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Tag
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Publishing Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-[#09090b]">Publishing</h2>
        
        <div>
          <Label htmlFor="status">Status *</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="isFeatured"
            checked={formData.isFeatured}
            onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
          />
          <Label htmlFor="isFeatured" className="cursor-pointer">
            Feature this article
          </Label>
        </div>

        <div>
          <Label htmlFor="publishDate">Publish Date</Label>
          <Input
            id="publishDate"
            type="date"
            value={formData.publishDate}
            onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="schemaType">Schema Type</Label>
          <Select
            value={formData.schemaType}
            onValueChange={(value) => setFormData({ ...formData, schemaType: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select schema type" />
            </SelectTrigger>
            <SelectContent>
              {SCHEMA_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <Button type="submit" disabled={loading} className="bg-[#09090b] text-white">
          {loading ? "Saving..." : initialData?.id ? "Update" : "Create"}
        </Button>
        <Link href="/admin/blog">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
