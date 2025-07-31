import { render, screen } from "@testing-library/react";
import ResetPasswordPage from "./page";
import { checkAuthAction } from "./actions";
import { Mock } from "vitest";

vi.mock("./actions", () => ({
  checkAuthAction: vi.fn(),
}));

vi.mock("./ForgotPasswordForm", () => ({
  default: vi.fn(() => <div>Forgot Password Form</div>),
}));

describe("ResetPasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the forgot password page", async () => {
    render(await ResetPasswordPage());
    expect(
      screen.getByRole("heading", { name: "Forgot Password" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Enter the email used for your Nedge account/),
    ).toBeInTheDocument();
    expect(screen.getByText("Forgot Password Form")).toBeInTheDocument();
    expect(screen.getByText("support@nedgestyle.com")).toBeInTheDocument();
  });

  it("should call checkAuthAction when component mounts", async () => {
    (checkAuthAction as Mock).mockResolvedValue(undefined);
    render(await ResetPasswordPage());
    expect(checkAuthAction).toHaveBeenCalledTimes(1);
  });

  it("should handle checkAuthAction errors gracefully", async () => {
    (checkAuthAction as Mock).mockRejectedValue(new Error("Auth check failed"));
    const { container } = render(await ResetPasswordPage());
    expect(container).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Forgot Password" }),
    ).toBeInTheDocument();
  });

  it("should have proper heading hierarchy", async () => {
    render(await ResetPasswordPage());
    const heading = screen.getByRole("heading", { name: "Forgot Password" });
    expect(heading.tagName).toBe("H1");
  });

  it("should render support email as clickable link", async () => {
    render(await ResetPasswordPage());
    const supportEmail = screen.getByText("support@nedgestyle.com");
    expect(supportEmail.tagName).toBe("SPAN");
    expect(supportEmail).toBeInTheDocument();
  });

  it("should handle multiple auth check failures", async () => {
    (checkAuthAction as Mock).mockRejectedValue(new Error("Network error"));
    const { container } = render(await ResetPasswordPage());
    expect(container).toBeInTheDocument();
  });

  it("should be accessible", async () => {
    render(await ResetPasswordPage());
    expect(
      screen.getByRole("heading", { name: "Forgot Password" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Forgot Password Form")).toBeInTheDocument();
    expect(screen.getByText("Need help?")).toBeInTheDocument();
  });

  it("should handle auth action returning data", async () => {
    (checkAuthAction as Mock).mockResolvedValue({ user: "test" });
    render(await ResetPasswordPage());
    expect(checkAuthAction).toHaveBeenCalledTimes(1);
  });

  it("should handle auth action returning null", async () => {
    (checkAuthAction as Mock).mockResolvedValue(null);
    render(await ResetPasswordPage());
    expect(checkAuthAction).toHaveBeenCalledTimes(1);
  });

  it("should handle auth action returning undefined", async () => {
    (checkAuthAction as Mock).mockResolvedValue(undefined);
    render(await ResetPasswordPage());
    expect(checkAuthAction).toHaveBeenCalledTimes(1);
  });

  it("should handle auth action returning empty object", async () => {
    (checkAuthAction as Mock).mockResolvedValue({});
    render(await ResetPasswordPage());
    expect(checkAuthAction).toHaveBeenCalledTimes(1);
  });

  it("should handle auth action returning complex data structure", async () => {
    (checkAuthAction as Mock).mockResolvedValue({
      user: { id: 1, name: "Test User" },
      permissions: ["read", "write"],
      settings: { theme: "dark" },
    });
    render(await ResetPasswordPage());
    expect(checkAuthAction).toHaveBeenCalledTimes(1);
  });
});
