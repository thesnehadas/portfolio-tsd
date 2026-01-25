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

interface CaseStudy {
  id: string;
  title: string;
  description: string;
  fullDescription: string | null;
  metrics: string;
  details: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function CaseStudiesList({ initialData }: { initialData: CaseStudy[] }) {
  const [studies, setStudies] = useState(initialData);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <>
      <div className="space-y-4">
        {studies.length === 0 ? (
          <div className="bg-white border-2 border-[#4a3728]/30 rounded-lg p-12 text-center">
            <p className="text-[#71717a]">No case studies yet. Create your first one!</p>
          </div>
        ) : (
          studies.map((study) => {
            const metrics = JSON.parse(study.metrics || "[]");
            return (
              <div
                key={study.id}
                className="bg-white border-2 border-[#4a3728]/30 rounded-lg p-6 hover:border-[#4a3728] transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-serif font-semibold text-[#09090b] mb-2">
                      {study.title}
                    </h3>
                    <p className="text-[#71717a] mb-4">{study.description}</p>
                    <div className="flex gap-4">
                      {metrics.map((metric: any, idx: number) => (
                        <div key={idx}>
                          <span className="text-lg font-semibold text-[#09090b]">
                            {metric.value}
                          </span>
                          <span className="text-sm text-[#71717a] ml-2 uppercase">
                            {metric.label}
                          </span>
                        </div>
                      ))}
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
