import ForgotPasswordForm from "./ForgotPasswordForm";
import { checkAuthAction } from "./actions";
import styles from "./page.module.css";

const ResetPasswordPage = async () => {
  await checkAuthAction();
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <h1>Forgot Password</h1>
        <p>
          Enter the email used for your Nedge account and we will send you a
          link to reset your password.
        </p>
        <ForgotPasswordForm />
        <div className={styles.loginLink}>
          Need help? <span>support@nedgestyle.com</span>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
