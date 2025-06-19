"use client";
import { Bin } from "@/app/@svgs";
import { useTransition } from "react";

export default function RemoveBookmarkButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = async () => {
    await fetch(`/api/account/bookmarks/${id}`, { method: "DELETE" });
    window.location.reload();
  };

  return (
    <button onClick={() => startTransition(handleRemove)} disabled={isPending}>
      <Bin />
    </button>
  );
}
