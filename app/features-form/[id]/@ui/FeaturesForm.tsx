"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import ShootDetailsForm from "./ShootDetailsForm";
import TagsForm from "./TagsForm";
import GarmentsForm from "./GarmentsForm";
import UploadImgsForm from "./UploadImgsForm";
import { SubmissionType } from "../AccessCodePage";
import styles from "./FeaturesForm.module.css";

type StatusType = "idle" | "loading" | "success" | "error";

function formatFileName(
  stylistName: string,
  shootName: string,
  originalName: string,
) {
  const clean = (str: string) =>
    str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
  const ext = originalName.split(".").pop();
  return `${clean(stylistName)}-${clean(shootName)}-${Date.now()}.${ext}`;
}

export default function FeaturesForm({
  submission,
}: {
  submission: SubmissionType;
}) {
  const router = useRouter();
  const [files, setFiles] = useState<FileList | null>(null);
  const [details, setDetails] = useState({
    stylistName: "",
    shootName: "",
    city: "",
  });
  const [garments, setGarments] = useState([
    { type: "", name: "", brand: "" },
    { type: "", name: "", brand: "" },
  ]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [status, setStatus] = useState<StatusType>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  async function uploadFiles(
    files: FileList,
    stylistName: string,
    shootName: string,
  ) {
    const supabase = createClient();
    const uploadedPaths: string[] = [];
    for (const file of Array.from(files)) {
      const fileName = formatFileName(stylistName, shootName, file.name);
      const filePath = `features-form/${fileName}`;
      console.log("Uploading:", {
        filePath,
        file,
        size: file.size,
        type: file.type,
      });
      const { error } = await supabase.storage
        .from("featuresform")
        .upload(filePath, file, { upsert: true });
      if (error) {
        console.error("Supabase upload error:", error);
        throw error;
      }
      uploadedPaths.push(filePath);
    }
    return uploadedPaths;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (
      !details.stylistName.trim() ||
      !details.shootName.trim() ||
      !details.city.trim()
    ) {
      setFormError("Please fill in all details.");
      return;
    }
    if (selectedTags.length === 0) {
      setFormError("Please select at least one tag.");
      return;
    }
    if (!files || files.length < 3) {
      setFormError("Please upload at least 3 images.");
      return;
    }
    if (!garments.length) {
      setFormError("Please add at least one garment.");
      return;
    }
    const incompleteGarment = garments.find(
      (g) => !g.type.trim() || !g.name.trim() || !g.brand.trim(),
    );
    if (incompleteGarment) {
      setFormError("Please fill in all fields for each garment.");
      return;
    }

    const MAX_UPLOAD_SIZE = 50 * 1024 * 1024; // 50MB per file
    const tooLargeFiles = Array.from(files || []).filter(
      (file) => file.size > MAX_UPLOAD_SIZE,
    );
    if (tooLargeFiles.length > 0) {
      setFormError(
        `The following files are too large (max 50MB):\n` +
          tooLargeFiles
            .map((f) => `${f.name} (${(f.size / 1024 / 1024).toFixed(2)}MB)`)
            .join("\n"),
      );
      return;
    }

    setStatus("loading");
    let imagePaths: string[] = [];
    try {
      imagePaths = await uploadFiles(
        files,
        details.stylistName,
        details.shootName,
      );
    } catch {
      setStatus("error");
      setFormError("Failed to upload images.");
      return;
    }

    try {
      const res = await fetch("/api/features-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          details,
          tags: selectedTags,
          garments,
          imagePaths,
        }),
      });

      if (res.ok) {
        setStatus("success");
        router.push(`/features-form/${submission.slug}`);
      } else {
        setStatus("error");
        let errorMsg = "Failed to send.";
        try {
          const data = await res.json();
          if (data?.error) {
            errorMsg = data.error;
          } else if (typeof data === "string") {
            errorMsg = data;
          }
          setFormError(errorMsg);
          console.error("API error response:", data);
        } catch (jsonErr) {
          try {
            const text = await res.text();
            errorMsg = `Failed to parse JSON error: ${jsonErr}. Response text: ${text}`;
            setFormError(errorMsg);
          } catch {
            setFormError(`Failed to parse JSON error: ${jsonErr}`);
          }
        }
      }
    } catch (err) {
      setStatus("error");
      setFormError("A network error occurred. Please try again.");
      console.error("Network error:", err);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <UploadImgsForm files={files} setFiles={setFiles} />
      <ShootDetailsForm details={details} setDetails={setDetails} />
      <GarmentsForm garments={garments} setGarments={setGarments} />
      <TagsForm selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
      <div className={styles.submitBtnContainer}>
        <button
          type="submit"
          disabled={status === "loading"}
          className={styles.submitBtn}
        >
          {status === "loading" ? "SENDING..." : "SEND"}
        </button>
      </div>
      {formError && (
        <div style={{ color: "red", marginTop: 16, fontWeight: "bold" }}>
          {formError}
        </div>
      )}
      {status === "error" && !formError && (
        <div style={{ color: "red", marginTop: 16 }}>Failed to send.</div>
      )}
    </form>
  );
}
