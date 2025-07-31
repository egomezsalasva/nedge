import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccessCodePage, { SubmissionType } from "./AccessCodePage";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
}));

const mockSubmission: SubmissionType = {
  submitted: false,
  access_code: "TEST123",
  name: "John Doe",
  slug: "john-doe",
};

const mockSubmittedSubmission: SubmissionType = {
  submitted: true,
  access_code: "TEST123",
  name: "John Doe",
  slug: "john-doe",
};

describe("AccessCodePage Component", () => {
  beforeEach(() => {
    push.mockClear();
  });

  it("renders the access code form with correct elements and greeting", () => {
    render(<AccessCodePage submission={mockSubmission} />);
    expect(screen.getByText("Hi John Doe")).toBeInTheDocument();
    expect(
      screen.getByText(
        /You have recieved this form because a member of Nedge has contacted you to be featured on Nedge./,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Please enter the access code provided to you to continue.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Enter Access Code")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Access code")).toBeInTheDocument();
  });

  it("renders the submitted page when submission is already submitted", () => {
    render(<AccessCodePage submission={mockSubmittedSubmission} />);
    expect(
      screen.getByText(/your submission has been sent!/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Thank you for submitting your feature request/),
    ).toBeInTheDocument();
    expect(screen.getByText("shoots@nedgestyle.com")).toBeInTheDocument();
  });

  it("transitions to form page when correct access code is entered", async () => {
    const user = userEvent.setup();
    render(<AccessCodePage submission={mockSubmission} />);
    expect(screen.getByText("Enter Access Code")).toBeInTheDocument();
    expect(screen.getByText("Hi John Doe")).toBeInTheDocument();
    const accessCodeInput = screen.getByPlaceholderText("Access code");
    await user.type(accessCodeInput, "TEST123");
    const submitButton = screen.getByRole("button", { name: /access/i });
    await user.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText("Get Featured on Nedge")).toBeInTheDocument();
    });
    expect(screen.getByText(/Hey there John Doe/)).toBeInTheDocument();
    expect(
      screen.getByText(/Please fill out the form below/),
    ).toBeInTheDocument();
    expect(screen.queryByText("Enter Access Code")).not.toBeInTheDocument();
  });

  it("handles different submission names correctly", () => {
    const customSubmission: SubmissionType = {
      submitted: false,
      access_code: "CUSTOM123",
      name: "Jane Smith",
      slug: "jane-smith",
    };
    render(<AccessCodePage submission={customSubmission} />);
    expect(screen.getByText("Hi Jane Smith")).toBeInTheDocument();
  });

  it("handles edge case with empty submission data", () => {
    const emptySubmission: SubmissionType = {
      submitted: false,
      access_code: "",
      name: "",
      slug: "",
    };
    render(<AccessCodePage submission={emptySubmission} />);
    expect(screen.getByText("Hi")).toBeInTheDocument();
    expect(screen.getByText("Enter Access Code")).toBeInTheDocument();
  });
});
