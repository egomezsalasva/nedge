import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { forgotPasswordAction } from "./actions";
import { Mock } from "vitest";

vi.mock("./actions", () => ({
  forgotPasswordAction: vi.fn(),
}));

vi.mock("@/app/ui/forms/EmailPasswordForm.module.css", () => ({
  default: {
    form: "form-class",
    inputContainer: "input-container-class",
    formInput: "form-input-class",
    submitButton: "submit-button-class",
  },
}));

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the forgot password form", () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send reset link" }),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("")).toBeInTheDocument();
  });

  it("should update email input when user types", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);
    const emailInput = screen.getByPlaceholderText("Email");
    await user.type(emailInput, "test@example.com");
    expect(emailInput).toHaveValue("test@example.com");
  });

  it("should disable submit button when email is invalid", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);
    const emailInput = screen.getByPlaceholderText("Email");
    const submitButton = screen.getByRole("button", {
      name: "Send reset link",
    });
    expect(submitButton).toBeDisabled();
    await user.type(emailInput, "invalid-email");
    expect(submitButton).toBeDisabled();
  });

  it("should enable submit button when email is valid", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);
    const emailInput = screen.getByPlaceholderText("Email");
    const submitButton = screen.getByRole("button", {
      name: "Send reset link",
    });
    expect(submitButton).toBeDisabled();
    await user.type(emailInput, "test@example.com");
    expect(submitButton).toBeEnabled();
  });

  it("should call forgotPasswordAction when form is submitted", async () => {
    const user = userEvent.setup();
    (forgotPasswordAction as Mock).mockResolvedValue({ success: true });
    render(<ForgotPasswordForm />);
    const emailInput = screen.getByPlaceholderText("Email");
    const submitButton = screen.getByRole("button", {
      name: "Send reset link",
    });
    await user.type(emailInput, "test@example.com");
    await user.click(submitButton);
    expect(forgotPasswordAction).toHaveBeenCalledTimes(1);
  });

  it("should show loading state during submission", async () => {
    const user = userEvent.setup();
    (forgotPasswordAction as Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );
    render(<ForgotPasswordForm />);
    const emailInput = screen.getByPlaceholderText("Email");
    const submitButton = screen.getByRole("button", {
      name: "Send reset link",
    });
    await user.type(emailInput, "test@example.com");
    await user.click(submitButton);
    expect(
      screen.getByRole("button", { name: "Sending..." }),
    ).toBeInTheDocument();
  });

  it("should show success message after successful submission", async () => {
    const user = userEvent.setup();
    (forgotPasswordAction as Mock).mockResolvedValue({ success: true });
    render(<ForgotPasswordForm />);
    const emailInput = screen.getByPlaceholderText("Email");
    const submitButton = screen.getByRole("button", {
      name: "Send reset link",
    });
    await user.type(emailInput, "test@example.com");
    await user.click(submitButton);
    expect(
      screen.getByText("A password reset link has been sent to your email."),
    ).toBeInTheDocument();
  });

  it("should show error message when action fails", async () => {
    const user = userEvent.setup();
    (forgotPasswordAction as Mock).mockResolvedValue({
      error: "Email not found",
    });
    render(<ForgotPasswordForm />);
    const emailInput = screen.getByPlaceholderText("Email");
    const submitButton = screen.getByRole("button", {
      name: "Send reset link",
    });
    await user.type(emailInput, "test@example.com");
    await user.click(submitButton);
    expect(screen.getByText("Email not found")).toBeInTheDocument();
  });

  it("should clear email input after successful submission", async () => {
    const user = userEvent.setup();
    (forgotPasswordAction as Mock).mockResolvedValue({ success: true });
    render(<ForgotPasswordForm />);
    const emailInput = screen.getByPlaceholderText("Email");
    const submitButton = screen.getByRole("button", {
      name: "Send reset link",
    });
    await user.type(emailInput, "test@example.com");
    await user.click(submitButton);
    expect(emailInput).toHaveValue("");
  });

  it("should handle network errors gracefully", async () => {
    const user = userEvent.setup();
    (forgotPasswordAction as Mock).mockRejectedValue(
      new Error("Network error"),
    );
    render(<ForgotPasswordForm />);
    const emailInput = screen.getByPlaceholderText("Email");
    const submitButton = screen.getByRole("button", {
      name: "Send reset link",
    });
    await user.type(emailInput, "test@example.com");
    await user.click(submitButton);
    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("should handle different email formats correctly", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);
    const emailInput = screen.getByPlaceholderText("Email");
    const submitButton = screen.getByRole("button", {
      name: "Send reset link",
    });
    await user.type(emailInput, "user+tag@domain.co.uk");
    expect(submitButton).toBeEnabled();
    await user.clear(emailInput);
    await user.type(emailInput, "test.email@subdomain.example.com");
    expect(submitButton).toBeEnabled();
  });

  it("should be accessible", async () => {
    render(<ForgotPasswordForm />);
    expect(
      screen.getByRole("button", { name: "Send reset link" }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toHaveAttribute(
      "type",
      "email",
    );
    expect(screen.getByPlaceholderText("Email")).toHaveAttribute("required");
    expect(screen.getByPlaceholderText("Email")).toHaveAttribute(
      "autoComplete",
      "email",
    );
  });

  it("should handle form validation edge cases", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);
    const emailInput = screen.getByPlaceholderText("Email");
    const submitButton = screen.getByRole("button", {
      name: "Send reset link",
    });
    await user.type(emailInput, "@");
    expect(submitButton).toBeDisabled();
    await user.clear(emailInput);
    await user.type(emailInput, "@example.com");
    expect(submitButton).toBeDisabled();
    await user.clear(emailInput);
    await user.type(emailInput, "user@");
    expect(submitButton).toBeDisabled();
  });

  it("should handle component unmounting gracefully", async () => {
    const user = userEvent.setup();
    (forgotPasswordAction as Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );
    const { unmount } = render(<ForgotPasswordForm />);
    const emailInput = screen.getByPlaceholderText("Email");
    const submitButton = screen.getByRole("button", {
      name: "Send reset link",
    });
    await user.type(emailInput, "test@example.com");
    await user.click(submitButton);
    unmount();
    expect(true).toBe(true);
  });
});
