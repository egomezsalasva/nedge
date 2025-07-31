import { render, screen } from "@testing-library/react";
import LoginForm from "./LoginForm";

vi.mock("./actions", () => ({
  login: vi.fn(),
}));

vi.mock("../ui/forms/EmailPasswordForm", () => ({
  default: function MockEmailPasswordForm({
    submitHandler,
    submitText,
    isSubmitting,
    message,
    passwordAutoComplete,
  }: {
    submitHandler: (event: React.FormEvent<HTMLFormElement>) => void;
    submitText: string;
    isSubmitting: boolean;
    message: string;
    passwordAutoComplete: string;
  }) {
    return (
      <form data-testid="email-password-form" onSubmit={submitHandler}>
        <div data-testid="submit-text">{submitText}</div>
        <div data-testid="is-submitting">{isSubmitting.toString()}</div>
        <div data-testid="message">{message}</div>
        <div data-testid="password-auto-complete">{passwordAutoComplete}</div>
        <button type="submit">{submitText}</button>
      </form>
    );
  },
}));

describe("LoginForm", () => {
  it("renders login form with correct props", () => {
    render(<LoginForm />);
    expect(screen.getByTestId("email-password-form")).toBeInTheDocument();
    expect(screen.getByTestId("submit-text")).toHaveTextContent("Log in");
    expect(screen.getByTestId("is-submitting")).toHaveTextContent("false");
    expect(screen.getByTestId("message")).toHaveTextContent("");
    expect(screen.getByTestId("password-auto-complete")).toHaveTextContent(
      "current-password",
    );
  });

  it("handles successful login", async () => {
    const mockLogin = vi.mocked(await import("./actions")).login;
    mockLogin.mockResolvedValue({ error: false });
    render(<LoginForm />);
    const submitButton = screen.getByRole("button", { name: "Log in" });
    submitButton.click();
    expect(mockLogin).toHaveBeenCalled();
  });

  it("handles login error", async () => {
    const mockLogin = vi.mocked(await import("./actions")).login;
    mockLogin.mockResolvedValue({ error: true });
    render(<LoginForm />);
    const submitButton = screen.getByRole("button", { name: "Log in" });
    submitButton.click();
    await screen.findByText("The email or password is incorrect.");
    expect(screen.getByTestId("message")).toHaveTextContent(
      "The email or password is incorrect.",
    );
  });

  it("handles loading state during submission", async () => {
    const mockLogin = vi.mocked(await import("./actions")).login;
    mockLogin.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ error: false }), 100),
        ),
    );
    render(<LoginForm />);
    const submitButton = screen.getByRole("button", { name: "Log in" });
    submitButton.click();
    await screen.findByText("true", {
      selector: '[data-testid="is-submitting"]',
    });
    expect(screen.getByTestId("is-submitting")).toHaveTextContent("true");
  });

  it("resets loading state after submission", async () => {
    const mockLogin = vi.mocked(await import("./actions")).login;
    mockLogin.mockResolvedValue({ error: false });
    render(<LoginForm />);
    const submitButton = screen.getByRole("button", { name: "Log in" });
    submitButton.click();
    await screen.findByText("false", {
      selector: '[data-testid="is-submitting"]',
    });
    expect(screen.getByTestId("is-submitting")).toHaveTextContent("false");
  });
});
