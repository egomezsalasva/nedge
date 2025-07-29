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

  const handleScroll = () => {
    document.getElementById("benefits")?.scrollIntoView({ behavior: "smooth" });
  };

  const garmentPlaceholders = [
    {
      type: "Garment Type (e.g. Boots)",
      name: "Garment Name (e.g. Tabi Ankle Boots)",
      brand: "Garment Brand (e.g. Maison Margiela)",
    },
    {
      type: "Garment Type (e.g. Bag)",
      name: "Garment Name (e.g. Carmen Small Crossbody Bag - Black)",
      brand: "Garment Brand (e.g. Michael Kors)",
    },
    {
      type: "Garment Type (e.g. Hat)",
      name: "Garment Name (e.g. Black Grandpa Beret)",
      brand: "Garment Brand (e.g. Minga London)",
    },
    {
      type: "Garment Type (e.g. Shoes)",
      name: "Garment Name (e.g. Penton - Smooth Leather Loafers)",
      brand: "Garment Brand (e.g. Dr. Martens)",
    },
    {
      type: "Garment Type (e.g. Watch)",
      name: "Garment Name (e.g. A168WA-1)",
      brand: "Garment Brand (e.g. Dr. Casio)",
    },
  ];

  return (
    <div className={styles.sectionContainer}>
      <h2>Garments</h2>
      <p>
        Add all the garments worn in the shoot. You can usually find the name of
        the garment either on the recipt or on the purchase email. The goal is
        to make items discoverable so we will check to see if we can find the
        items online. If you have the name but it&apos;s out of stock that is
        ok. Add as many as you can since this will later be used to get the
        affiliate links which will benefit you. Read more about the benefits{" "}
        <span style={{ textDecoration: "underline" }} onClick={handleScroll}>
          HERE
        </span>
      </p>
      <p>
        Click{" "}
        <span style={{ fontWeight: "bold" }}>
          &quot;Add Another Garment&quot;
        </span>{" "}
        for each garment you want to add.
      </p>
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
                placeholder={garmentPlaceholders[idx]?.type || "Garment Type"}
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
                placeholder={garmentPlaceholders[idx]?.name || "Garment Name"}
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
                placeholder={garmentPlaceholders[idx]?.brand || "Garment Brand"}
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
