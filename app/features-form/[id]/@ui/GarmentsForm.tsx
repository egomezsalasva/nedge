import React from "react";
import styles from "./FeaturesForm.module.css";

type Garment = {
  type: string;
  name: string;
  brand: string;
};

type GarmentsFormProps = {
  garments: Garment[];
  setGarments: React.Dispatch<React.SetStateAction<Garment[]>>;
};

export default function GarmentsForm({
  garments,
  setGarments,
}: GarmentsFormProps) {
  const handleChange = (index: number, field: keyof Garment, value: string) => {
    const updated = [...garments];
    updated[index][field] = value;
    setGarments(updated);
  };

  const addGarment = () => {
    setGarments([...garments, { type: "", name: "", brand: "" }]);
  };

  const removeGarment = (index: number) => {
    if (garments.length === 1) return;
    setGarments(garments.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.sectionContainer}>
      <h2>Garments</h2>
      {garments.map((garment, idx) => (
        <div key={idx} className={styles.garmentCard}>
          {garments.length > 1 && (
            <div
              className={styles.removeGarment}
              onClick={() => removeGarment(idx)}
            >
              <span>X</span>
            </div>
          )}
          <div>
            <div className={styles.inputContainer}>
              <input
                type="text"
                value={garment.type}
                onChange={(e) => handleChange(idx, "type", e.target.value)}
                placeholder="Garment Type"
                className={styles.formInput}
              />
            </div>
          </div>
          <div>
            <div className={styles.inputContainer}>
              <input
                type="text"
                value={garment.name}
                onChange={(e) => handleChange(idx, "name", e.target.value)}
                placeholder="Garment Name"
                className={styles.formInput}
              />
            </div>
          </div>
          <div>
            <div className={styles.inputContainer}>
              <input
                type="text"
                value={garment.brand}
                onChange={(e) => handleChange(idx, "brand", e.target.value)}
                placeholder="Garment Brand"
                className={styles.formInput}
              />
            </div>
          </div>
        </div>
      ))}
      <div className={styles.addGarmentBtnContainer}>
        <button
          type="button"
          onClick={addGarment}
          className={styles.addGarmentBtn}
        >
          Add Another Garment
        </button>
      </div>
    </div>
  );
}
