"use client";
import { useState, useEffect } from "react";
import { Card, CardType } from "../../ui";
import styles from "./LatestList.module.css";

const LatestList = () => {
  const [latestShoots, setLatestShoots] = useState<CardType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestShoots = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/latest/list");
        if (!response.ok) {
          throw new Error(`Failed to fetch shoots: ${response.status}`);
        }
        const data = await response.json();
        setLatestShoots(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred",
        );
        console.error("Error fetching latest shoots:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatestShoots();
  }, []);

  if (error) {
    return (
      <div className={styles.container}>
        <h2>Latest Shoots</h2>
        <div className={styles.cardsContainer}>
          <div className={styles.error}>
            <p>Unable to load shoots: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className={styles.retryButton}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>Latest Shoots</h2>
      <div className={styles.cardsContainer}>
        {isLoading ? (
          <div className={styles.loading}>Loading...</div>
        ) : latestShoots && latestShoots.length > 0 ? (
          latestShoots
            .slice(1)
            .map((shoot, index) => <Card key={index} shoot={shoot} />)
        ) : (
          <div className={styles.empty}>No shoots available</div>
        )}
      </div>
    </div>
  );
};

export default LatestList;
