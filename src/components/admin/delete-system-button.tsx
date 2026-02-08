"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteSystemButton({ systemId }: { systemId: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this system? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/systems/${systemId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        throw new Error(data.error || "Failed to delete system");
      }

      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Failed to delete system");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDelete}
      disabled={loading}
      variant="outline"
      size="sm"
      className="text-red-600 hover:text-red-700"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
