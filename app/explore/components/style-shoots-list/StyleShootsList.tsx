"use client";
import { useEffect, useState } from "react";
import { Card, CardType } from "@/app/ui";
import styles from "./StyleShootsList.module.css";

const StyleShootsList = ({ subStyle }: { subStyle: string }) => {
  const [shoots, setShoots] = useState<CardType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(
      `/api/explore/shoots-by-style?subStyle=${encodeURIComponent(subStyle)}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setShoots(Array.isArray(data.shoots) ? data.shoots : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load shoots.");
        setLoading(false);
      });
  }, [subStyle]);

  return (
    <div className={styles.container}>
      {loading && <div data-testid="loading">Loading...</div>}
      {error && <div data-testid="error">{error}</div>}
      {!loading && !error && shoots && shoots.length === 0 && (
        <div data-testid="no-shoots">No shoots found.</div>
      )}
      <div className={styles.cardsContainer} data-testid="shoot-cards-list">
        {shoots?.map((shoot) => <Card key={shoot.slug} shoot={shoot} />)}
      </div>
    </div>
  );
};

export default StyleShootsList;
