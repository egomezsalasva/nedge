import FeaturesForm from "./@ui/FeaturesForm";
import { SubmissionType } from "./AccessCodePage";
import styles from "./page.module.css";

const FormPage = ({ submission }: { submission: SubmissionType }) => {
  const handleScroll = () => {
    document.getElementById("benefits")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className={styles.container}>
      <h1>Get Featured on Nedge</h1>
      <p>
        Hey there {submission.name}, you have recieved this form because a
        memeber of Nedge has contacted you to be featured on Nedge.
      </p>
      <p>
        Please fill out the form below which has the required information Nedge
        needs to be able to feature you on the website. We will review the form
        and upload it as soon as possible if everything is in order. We always
        try to send a preview to you before we upload it.
      </p>
      <p>
        Read more about the benefits of joining Nedge{" "}
        <span style={{ textDecoration: "underline" }} onClick={handleScroll}>
          HERE
        </span>
        .
      </p>
      <FeaturesForm submission={submission} />
      <div id="benefits" className={styles.benefitsSection}>
        <h2>Benefits of being featured on Nedge</h2>
        <p>
          First off a brief explanation of what Nedge is. Nedge is a platform
          for showcasing outfits and styling. We want to help users of the site
          find inspiraiton and easily find and buy the items they see.
        </p>
        <p>
          For stylists like yourself, we want the platform to be both an offical
          place to showcase your work, as well as a place to generate some
          passive revenue through the sale of the affiliate links.
        </p>
        <p>
          As of now, we are still building enough traction to be able to go to
          brands with a strong offer. But the aim is to be able to support both
          the platform itself as well as the stylists.
        </p>
      </div>
    </div>
  );
};

export default FormPage;
