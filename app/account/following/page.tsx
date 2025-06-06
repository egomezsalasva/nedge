"use client";
import { useUserContext } from "@/app/@contexts/UserContext";
import styles from "./page.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AccountFollowing() {
  const { following, removeFollowing } = useUserContext();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        {following.length === 0 ? (
          <p>No following yet</p>
        ) : (
          <div className={styles.followingContainer}>
            {following.map((stylist) => (
              <div key={stylist.name} className={styles.followingRow}>
                <div className={styles.followingName}>
                  {stylist.link ? (
                    <Link href={stylist.link}>{stylist.name}</Link>
                  ) : (
                    stylist.name
                  )}
                </div>
                <div className={styles.followingRemove}>
                  <button onClick={() => removeFollowing(stylist.name)}>
                    Unfollow
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
