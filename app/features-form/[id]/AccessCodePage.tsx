"use client";
import { useState } from "react";
import FormPage from "./FormPage";
import AccessForm from "./@ui/access/AccessForm";
import SubmittedPage from "./SubmittedPage";
import styles from "./page.module.css";

export type SubmissionType = {
  submitted: boolean;
  access_code: string;
  name: string;
  slug: string;
};

const AccessCodePage = ({ submission }: { submission: SubmissionType }) => {
  const [access, setAccess] = useState(false);

  if (submission.submitted) {
    return <SubmittedPage />;
  }

  if (!access) {
    return (
      <div className={styles.container}>
        <h1>Hi {submission.name}</h1>
        <p>
          You have recieved this form because a member of Nedge has contacted
          you to be featured on Nedge.
        </p>
        <p>Please enter the access code provided to you to continue.</p>
        <AccessForm
          submissionCode={submission.access_code}
          setAccess={setAccess}
        />
      </div>
    );
  }

  return <FormPage submission={submission} />;
};

export default AccessCodePage;
