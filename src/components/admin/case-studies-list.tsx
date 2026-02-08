"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CaseStudy {
  id: string;
  clientName?: string;
  industry?: string;
  status?: string;
  isFeatured?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  // Legacy fields
  title?: string;
}

export function CaseStudiesList({ initialData }: { initialData: CaseStudy[] }) {
  const [studies, setStudies] = useState(initialData);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");

  // Extract unique industries
  const industries = useMemo(() => {
    const unique = new Set<string>();
    studies.forEach((study) => {
      if (study.industry) unique.add(study.industry);
    });
    return Array.from(unique).sort();
  }, [studies]);

  // Filter and sort studies
  const filteredStudies = useMemo(() => {
    let filtered = [...studies];

    // Search by client name
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((study) => {
        const clientName = (study.clientName || study.title || "").toLowerCase();
        return clientName.includes(query);
      });
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((study) => study.status === statusFilter);
    }

    // Filter by industry
    if (industryFilter !== "all") {
      filtered = filtered.filter((study) => study.industry === industryFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      
      switch (sortBy) {
        case "date-desc":
          return dateB - dateA;
        case "date-asc":
          return dateA - dateB;
        case "name-asc":
          return (a.clientName || a.title || "").localeCompare(b.clientName || b.title || "");
        case "name-desc":
          return (b.clientName || b.title || "").localeCompare(a.clientName || a.title || "");
        default:
          return dateB - dateA;
      }
    });

    return filtered;
  }, [studies, searchQuery, statusFilter, industryFilter, sortBy]);

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/case-studies/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setStudies(studies.filter((s) => s.id !== id));
      setDeleteId(null);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete case study");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#71717a] w-4 h-4" />
            <Input
              placeholder="Search by client name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          {/* Industry Filter */}
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name A-Z</SelectItem>
              <SelectItem value="name-desc">Name Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="text-sm text-[#71717a]">
          Showing {filteredStudies.length} of {studies.length} case studies
        </div>
      </div>

      {/* Case Studies List */}
      <div className="space-y-4">
        {filteredStudies.length === 0 ? (
          <div className="bg-white border-2 border-[#4a3728]/30 rounded-lg p-12 text-center">
            <p className="text-[#71717a]">
              {searchQuery || statusFilter !== "all" || industryFilter !== "all"
                ? "No case studies match your filters."
                : "No case studies yet. Create your first one!"}
            </p>
          </div>
        ) : (
          filteredStudies.map((study) => {
            const clientName = study.clientName || study.title || "Untitled";
            return (
              <div
                key={study.id}
                className="bg-white border-2 border-[#4a3728]/30 rounded-lg p-6 hover:border-[#4a3728] transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-serif font-semibold text-[#09090b]">
                        {clientName}
                      </h3>
                      {study.isFeatured === 1 && (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                          Featured
                        </span>
                      )}
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          study.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {study.status === "published" ? "Published" : "Draft"}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-[#71717a] mb-2">
                      {study.industry && (
                        <span>Industry: {study.industry}</span>
                      )}
                      <span>Created: {formatDate(study.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link href={`/admin/case-studies/${study.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(study.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Case Study</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this case study? This action cannot be undone.
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
