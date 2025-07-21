"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardType } from "@/app/ui";
import { getStyleShootsList } from "./@utils/getStyleShootsList";
import styles from "./StyleShootsList.module.css";

const StyleShootsList = ({ subStyle }: { subStyle: string }) => {
  const [shoots, setShoots] = useState<CardType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchShoots = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getStyleShootsList(subStyle);
        if (
          data.shoots.length === 0 ||
          data.shoots.every(
            (shoot: CardType) =>
              typeof shoot.preview_slug === "string" &&
              shoot.preview_slug.trim() !== "",
          )
        ) {
          setRedirecting(true);
          router.replace("/explore");
          return;
        }
        setShoots(data.shoots);
      } catch {
        setError("Failed to load shoots.");
      } finally {
        setLoading(false);
      }
    };
    fetchShoots();
  }, [subStyle, router]);

  if (redirecting) {
    return null;
  }

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
