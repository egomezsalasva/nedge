"use client";
import { Bin } from "@/app/svgs";
import { useTransition } from "react";

export default function RemoveBookmarkButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = async () => {
    try {
      await fetch(`/api/account/bookmarks/${id}`, { method: "DELETE" });
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
    } finally {
      window.location.reload();
    }
  };

  return (
    <button onClick={() => startTransition(handleRemove)} disabled={isPending}>
      <Bin />
    </button>
  );
}
