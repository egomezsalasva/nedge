import { useEffect } from "react";

const useLockScreen = () => {
  useEffect(() => {
    const className = "lock-screen";
    document.documentElement.classList.add(className);
    return () => {
      document.documentElement.classList.remove(className);
    };
  }, []);
};

export default useLockScreen;
