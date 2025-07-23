import React, { useRef, useState } from "react";
import styles from "./FeaturesForm.module.css";

type UploadImgsFormProps = {
  files: FileList | null;
  setFiles: (files: FileList | null) => void;
};

export default function UploadImgsForm({
  files,
  setFiles,
}: UploadImgsFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    inputRef.current?.click();
  };

  return (
    <div className={styles.sectionContainer}>
      <h2>Upload images</h2>
      <p>Upload between 3 and 5 images wearing the same outfit.</p>
      <div
        className={`${styles.customFileLabel} ${dragActive ? styles.dragActive : ""}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className={styles.visible_desktop}>
          DRAG AND DROP 3 TO 5 IMAGES HERE
        </div>
        <div className={styles.visible_mobile}>UPLOAD 3 TO 5 IMAGES</div>
        <div className={styles.visible_desktop}>or</div>
        <button onClick={handleButtonClick} className={styles.addGarmentBtn}>
          Click to Browse
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          className={styles.fileInput}
          style={{ display: "none" }}
        />
      </div>
      {files && files.length > 0 && (
        <div className={styles.imagePreviewList}>
          {Array.from(files).map((file) => (
            <div key={file.name} className={styles.imagePreviewItem}>
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className={styles.imagePreview}
                onLoad={(e) =>
                  URL.revokeObjectURL((e.target as HTMLImageElement).src)
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
