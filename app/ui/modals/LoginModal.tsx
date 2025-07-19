import React from "react";
import { useRouter } from "next/navigation";
import { useLockScreen } from "@/app/utils";
import styles from "./LoginModal.module.css";

interface LoginModalProps {
  setIsActive: (active: boolean) => void;
  title: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ setIsActive, title }) => {
  const router = useRouter();
  useLockScreen();

  return (
    <div
      data-testid="login-modal-container"
      onClick={() => setIsActive(false)}
      className={styles.loginModalContainer}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={styles.loginModalContent}
      >
        <button
          onClick={() => setIsActive(false)}
          className={styles.closeButton}
        >
          X
        </button>
        <h2>{title}</h2>
        <button
          onClick={() => router.push("/login")}
          className={styles.loginModalButton}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
