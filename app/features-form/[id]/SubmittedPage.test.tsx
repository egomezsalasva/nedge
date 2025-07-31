import { render, screen } from "@testing-library/react";
import SubmittedPage from "./SubmittedPage";

describe("SubmittedPage", () => {
  it("should render the submission confirmation page", () => {
    render(<SubmittedPage />);
    expect(
      screen.getByRole("heading", { name: "Your Submission has been Sent!" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Thank you for submitting your feature request/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/If you wish to resubmit please contanct/),
    ).toBeInTheDocument();
    expect(screen.getByText("shoots@nedgestyle.com")).toBeInTheDocument();
  });

  it("should have proper heading hierarchy", () => {
    render(<SubmittedPage />);
    const heading = screen.getByRole("heading", {
      name: "Your Submission has been Sent!",
    });
    expect(heading.tagName).toBe("H1");
  });

  it("should have proper text content structure", () => {
    render(<SubmittedPage />);
    const paragraphs = screen.getAllByText(/Thank you|If you wish/);
    expect(paragraphs).toHaveLength(2);
    const emailSpan = screen.getByText("shoots@nedgestyle.com");
    expect(emailSpan.tagName).toBe("SPAN");
  });
});
