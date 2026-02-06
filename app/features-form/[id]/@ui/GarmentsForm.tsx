import React from "react";
import styles from "./FeaturesForm.module.css";

type Garment = {
  type: string;
  name: string;
  brand: string;
  refLink: string;
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
    setGarments([...garments, { type: "", name: "", brand: "", refLink: "" }]);
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
      refLink:
        "Garment Ref Link (e.g. https://www.maisonmargiela.com/wx/tabi-ankle-boots-S57WU0153PR058T8013.html)",
    },
    {
      type: "Garment Type (e.g. Bag)",
      name: "Garment Name (e.g. Carmen Small Crossbody Bag - Black)",
      brand: "Garment Brand (e.g. Michael Kors)",
      refLink:
        "Garment Ref Link (e.g. https://www.michaelkors.com/product/298378/carmen-small-crossbody-bag-black)",
    },
    {
      type: "Garment Type (e.g. Hat)",
      name: "Garment Name (e.g. Black Grandpa Beret)",
      brand: "Garment Brand (e.g. Minga London)",
      refLink:
        "Garment Ref Link (e.g. https://www.mingalondon.com/products/black-grandpa-beret)",
    },
    {
      type: "Garment Type (e.g. Shoes)",
      name: "Garment Name (e.g. Penton - Smooth Leather Loafers)",
      brand: "Garment Brand (e.g. Dr. Martens)",
      refLink:
        "Garment Ref Link (e.g. https://www.drmartens.com/products/penton-smooth-leather-loafers)",
    },
    {
      type: "Garment Type (e.g. Watch)",
      name: "Garment Name (e.g. A168WA-1)",
      brand: "Garment Brand (e.g. Dr. Casio)",
      refLink:
        "Garment Ref Link (e.g. https://www.casio.com/products/a168wa-1)",
    },
  ];

  return (
    <div className={styles.sectionContainer}>
      <h2>Garments</h2>
      <p>
        Add all the garments worn in the shoot. You can usually find the name of
        the garment either on the recipt or on the purchase email.
      </p>
      <ul>
        <li>
          If the item is out of stock in the official site you can add a
          referance to any other site that has the item.
        </li>
        <li>
          If the garment is from a thrift store make sure it is online somewhere
          and add the link and name of the brand
        </li>
        <li>
          Avoid items from mass produced stores(e.g. SHEIN, Amazon, etc.) with
          general overly descritive name like "Men's Fashionable Printed Loose
          Fit Short Sleeve T-Shirt"
        </li>
      </ul>
      <p style={{ marginTop: "1rem" }}>
        Add as many as you can since this will later be used to get the
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
      <p>
        Click the <span style={{ fontWeight: "bold" }}>&quot;X&quot;</span> to
        remove the placeholder garments if you have less than 5.
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
          <div>
            <div className={styles.inputContainer}>
              <input
                type="text"
                required
                value={garment.refLink}
                onChange={(e) => handleChange(idx, "refLink", e.target.value)}
                placeholder={
                  garmentPlaceholders[idx]?.refLink || "Garment Ref Link"
                }
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
