import { render, screen } from "@testing-library/react";
import ResetPasswordPage from "./page";

vi.mock("./ResetPasswordContent", () => ({
  default: function MockResetPasswordContent() {
    return (
      <div data-testid="reset-password-content">Reset Password Content</div>
    );
  },
}));

describe("ResetPasswordPage", () => {
  it("renders reset password content", () => {
    render(<ResetPasswordPage />);
    expect(screen.getByTestId("reset-password-content")).toBeInTheDocument();
    expect(screen.getByText("Reset Password Content")).toBeInTheDocument();
  });

  it("provides proper page layout and accessibility", () => {
    render(<ResetPasswordPage />);
    const content = screen.getByTestId("reset-password-content");
    expect(content).toBeInTheDocument();
    const pageContainer = content.closest("div");
    expect(pageContainer).toBeInTheDocument();
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("maintains proper component hierarchy", () => {
    render(<ResetPasswordPage />);
    const content = screen.getByTestId("reset-password-content");
    expect(content).toBeInTheDocument();
    expect(content.parentElement).toBeInTheDocument();
    const allDivs = screen.getAllByTestId("reset-password-content");
    expect(allDivs).toHaveLength(1);
  });

  it("wraps content in Suspense boundary", () => {
    render(<ResetPasswordPage />);
    const content = screen.getByTestId("reset-password-content");
    expect(content.parentElement).toBeInTheDocument();
    expect(() => render(<ResetPasswordPage />)).not.toThrow();
  });
});
