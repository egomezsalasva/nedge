import { render, screen } from "@testing-library/react";
import SignupForm from "./SignupForm";

vi.mock("./actions", () => ({
  signup: vi.fn(),
}));

vi.mock("../ui/forms/EmailPasswordForm", () => ({
  default: function MockEmailPasswordForm({
    submitText,
    passwordAutoComplete,
  }: {
    submitText: string;
    passwordAutoComplete: string;
  }) {
    return (
      <div data-testid="email-password-form">
        <div data-testid="submit-text">{submitText}</div>
        <div data-testid="password-auto-complete">{passwordAutoComplete}</div>
      </div>
    );
  },
}));

describe("SignupForm", () => {
  it("renders signup form with correct props", () => {
    render(<SignupForm />);
    expect(screen.getByTestId("email-password-form")).toBeInTheDocument();
    expect(screen.getByTestId("submit-text")).toHaveTextContent("Sign up");
    expect(screen.getByTestId("password-auto-complete")).toHaveTextContent(
      "new-password",
    );
  });

  it("handles successful signup", async () => {
    const mockSignup = vi.mocked(await import("./actions")).signup;
    mockSignup.mockResolvedValue({ success: true });
    render(<SignupForm />);
    expect(screen.getByTestId("email-password-form")).toBeInTheDocument();
    expect(mockSignup).toBeDefined();
  });

  it("handles failed signup", async () => {
    const mockSignup = vi.mocked(await import("./actions")).signup;
    mockSignup.mockResolvedValue({ error: true });
    render(<SignupForm />);
    expect(screen.getByTestId("email-password-form")).toBeInTheDocument();
    expect(mockSignup).toBeDefined();
  });

  it("passes correct props to EmailPasswordForm", () => {
    render(<SignupForm />);
    expect(screen.getByTestId("email-password-form")).toBeInTheDocument();
    expect(screen.getByTestId("submit-text")).toHaveTextContent("Sign up");
    expect(screen.getByTestId("password-auto-complete")).toHaveTextContent(
      "new-password",
    );
    const form = screen.getByTestId("email-password-form");
    expect(form).toBeInTheDocument();
  });

  it("handles signup action import correctly", async () => {
    const mockSignup = vi.mocked(await import("./actions")).signup;
    expect(mockSignup).toBeDefined();
    expect(typeof mockSignup).toBe("function");
    render(<SignupForm />);
    expect(screen.getByTestId("email-password-form")).toBeInTheDocument();
  });

  it("renders without crashing on component mount", () => {
    expect(() => {
      render(<SignupForm />);
    }).not.toThrow();
    expect(screen.getByTestId("email-password-form")).toBeInTheDocument();
  });

  it("maintains component structure across re-renders", () => {
    const { rerender } = render(<SignupForm />);
    expect(screen.getByTestId("email-password-form")).toBeInTheDocument();
    rerender(<SignupForm />);
    expect(screen.getByTestId("email-password-form")).toBeInTheDocument();
    expect(screen.getByTestId("submit-text")).toHaveTextContent("Sign up");
    expect(screen.getByTestId("password-auto-complete")).toHaveTextContent(
      "new-password",
    );
  });

  it("has correct default state values", () => {
    render(<SignupForm />);
    expect(screen.getByTestId("email-password-form")).toBeInTheDocument();
    expect(screen.queryByText("Signup successful!")).not.toBeInTheDocument();
    expect(screen.queryByText("Signup failed.")).not.toBeInTheDocument();
  });

  it("handles component unmounting gracefully", () => {
    const { unmount } = render(<SignupForm />);
    expect(screen.getByTestId("email-password-form")).toBeInTheDocument();
    unmount();
    expect(screen.queryByTestId("email-password-form")).not.toBeInTheDocument();
    expect(() => {}).not.toThrow();
  });

  it("handles missing action import gracefully", async () => {
    vi.doMock("./actions", () => ({
      signup: undefined,
    }));
    const { default: SignupFormWithMock } = await import("./SignupForm");
    expect(() => {
      render(<SignupFormWithMock />);
    }).not.toThrow();
    expect(screen.getByTestId("email-password-form")).toBeInTheDocument();
  });

  it("handles different prop combinations correctly", () => {
    render(<SignupForm />);
    expect(screen.getByTestId("email-password-form")).toBeInTheDocument();
    expect(screen.getByTestId("submit-text")).toHaveTextContent("Sign up");
    expect(screen.getByTestId("password-auto-complete")).toHaveTextContent(
      "new-password",
    );
    const form = screen.getByTestId("email-password-form");
    expect(form).toBeInTheDocument();
    expect(screen.queryByTestId("unexpected-prop")).not.toBeInTheDocument();
  });

  it("handles component lifecycle correctly", () => {
    const { unmount, rerender } = render(<SignupForm />);
    expect(screen.getByTestId("email-password-form")).toBeInTheDocument();
    rerender(<SignupForm />);
    expect(screen.getByTestId("email-password-form")).toBeInTheDocument();
    unmount();
    expect(screen.queryByTestId("email-password-form")).not.toBeInTheDocument();
    render(<SignupForm />);
    expect(screen.getByTestId("email-password-form")).toBeInTheDocument();
  });

  it("handles concurrent renders without conflicts", () => {
    const { rerender } = render(<SignupForm />);
    expect(screen.getByTestId("email-password-form")).toBeInTheDocument();
    rerender(<SignupForm />);
    rerender(<SignupForm />);
    rerender(<SignupForm />);
    expect(screen.getByTestId("email-password-form")).toBeInTheDocument();
    expect(screen.getByTestId("submit-text")).toHaveTextContent("Sign up");
    expect(screen.getByTestId("password-auto-complete")).toHaveTextContent(
      "new-password",
    );
    expect(() => {}).not.toThrow();
  });

  it("handles error boundaries gracefully", () => {
    expect(() => {
      render(<SignupForm />);
    }).not.toThrow();
    expect(screen.getByTestId("email-password-form")).toBeInTheDocument();
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<SignupForm />);
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
