"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

interface Props {
  institute: string;
  paperType: string;
  set: string;
}

export default function ManageClientActions({ institute, paperType, set }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to completely delete the ${institute} key for ${paperType} Set ${set}?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch("/api/admin/manage-keys", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ institute, paperType, set }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete key.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
