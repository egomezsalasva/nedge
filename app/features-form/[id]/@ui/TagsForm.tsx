"use client";
import { useState } from "react";
import { stylesData } from "./@tagsData";
import styles from "./FeaturesForm.module.css";

type Props = {
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function TagsForm({ selectedTags, setSelectedTags }: Props) {
  const [input, setInput] = useState("");
  const [showAllTags, setShowAllTags] = useState(false);

  // Filter tags for autocomplete, excluding already selected
  const filtered =
    input.length > 0
      ? stylesData.filter(
          (tag) =>
            tag.toLowerCase().startsWith(input.toLowerCase()) &&
            !selectedTags.includes(tag),
        )
      : [];

  function addTag(tag: string) {
    if (!selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
    setInput("");
  }

  function removeTag(tag: string) {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (
      e.key === "Enter" &&
      input.trim() &&
      !selectedTags.includes(input.trim())
    ) {
      addTag(input.trim());
      e.preventDefault();
    }
  }

  const availableTags = stylesData.filter((tag) => !selectedTags.includes(tag));

  return (
    <div className={styles.sectionContainer}>
      <h2>Tags</h2>
      <p>
        You can either add a custom tag or select from the list of tags below.
      </p>
      {selectedTags.length > 0 && (
        <div className={styles.selectedTagsList}>
          <span>SELECTED:</span>
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className={styles.selectedTagItem}
              onClick={() => removeTag(tag)}
            >
              {tag}
              <span>X</span>
            </span>
          ))}
        </div>
      )}
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Type to search or add a tag..."
          className={styles.formInput}
        />
      </div>
      {filtered.length > 0 && (
        <ul className={styles.tagsList}>
          {filtered.map((tag) => (
            <li
              key={tag}
              className={styles.tagItem}
              onClick={() => addTag(tag)}
            >
              {tag}
              <span>+</span>
            </li>
          ))}
        </ul>
      )}
      {input.length > 0 &&
        filtered.length === 0 &&
        !selectedTags.includes(input.trim()) && (
          <div className={styles.adNewTagItemContainer}>
            <span>Add New:</span>
            <button
              type="button"
              onClick={() => addTag(input.trim())}
              className={styles.addTagItem}
            >
              {input.trim()}
            </button>
          </div>
        )}

      {!input && (
        <div className={styles.addGarmentBtnContainer}>
          <button
            type="button"
            onClick={() => setShowAllTags(!showAllTags)}
            className={styles.addGarmentBtn}
            style={{ marginBottom: "1rem" }}
          >
            {showAllTags ? "Hide All Tags" : "View All Tags"}
          </button>
        </div>
      )}
      {showAllTags && availableTags.length > 0 && (
        <ul className={styles.tagsList}>
          {availableTags.map((tag) => (
            <li
              key={tag}
              className={styles.tagItem}
              onClick={() => {
                addTag(tag);
                setShowAllTags(false);
              }}
            >
              {tag}
              <span>+</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
