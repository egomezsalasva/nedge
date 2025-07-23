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

    setStatus("loading");
    const formData = new FormData();
    formData.append("details", JSON.stringify(details));
    formData.append("tags", JSON.stringify(selectedTags));
    formData.append("garments", JSON.stringify(garments));
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    const res = await fetch("/api/features-form", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      setStatus("success");
      router.push(`/features-form/${submission.slug}`);
    } else {
      setStatus("error");
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
      {formError && <div style={{ color: "red" }}>{formError}</div>}
      {status === "error" && <div>Failed to send.</div>}
    </form>
  );
}
