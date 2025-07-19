"use client";
import { useEffect } from "react";

export const useLockScreen = () => {
  useEffect(() => {
    const className = "lock-screen";
    document.documentElement.classList.add(className);
    return () => {
      document.documentElement.classList.remove(className);
    };
  }, []);
};
