"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ShootDetailsForm from "./ShootDetailsForm";
import TagsForm from "./TagsForm";
import GarmentsForm from "./GarmentsForm";
import UploadImgsForm from "./UploadImgsForm";
import { SubmissionType } from "../AccessCodePage";
import styles from "./FeaturesForm.module.css";

type StatusType = "idle" | "loading" | "success" | "error";

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
  const [garments, setGarments] = useState([{ type: "", name: "", brand: "" }]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [status, setStatus] = useState<StatusType>("idle");
  const [formError, setFormError] = useState<string | null>(null);

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

    const MAX_UPLOAD_SIZE = 4 * 1024 * 1024; // 4MB per file
    const tooLargeFiles = Array.from(files || []).filter(
      (file) => file.size > MAX_UPLOAD_SIZE,
    );
    if (tooLargeFiles.length > 0) {
      setFormError(
        `The following files are too large (max 4MB):\n` +
          tooLargeFiles
            .map((f) => `${f.name} (${(f.size / 1024 / 1024).toFixed(2)}MB)`)
            .join("\n"),
      );
      return;
    }

    setStatus("loading");
    const formData = new FormData();
    formData.append("details", JSON.stringify(details));
    formData.append("tags", JSON.stringify(selectedTags));
    formData.append("garments", JSON.stringify(garments));
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await fetch("/api/features-form", {
        method: "POST",
        body: formData,
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
