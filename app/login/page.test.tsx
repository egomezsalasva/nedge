import { render, screen } from "@testing-library/react";
import LoginPage from "./page";

vi.mock("./LoginForm", () => ({
  default: function MockLoginForm() {
    return <div data-testid="login-form">Login Form</div>;
  },
}));

vi.mock("./actions", () => ({
  checkAuthAction: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("next/link", () => ({
  default: function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return (
      <a href={href} data-testid="link">
        {children}
      </a>
    );
  },
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login page with all content", async () => {
    render(await LoginPage());
    expect(screen.getByText("NEDGE ACCOUNT")).toBeInTheDocument();
    expect(
      screen.getByText(/Sign up or log in to bookmark/),
    ).toBeInTheDocument();
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.getByText("Forgot password?")).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account?/)).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });

  it("renders navigation links with correct hrefs", async () => {
    render(await LoginPage());
    const forgotPasswordLink = screen.getByText("Forgot password?");
    const signupLink = screen.getByText("Sign up");
    expect(forgotPasswordLink.closest("a")).toHaveAttribute(
      "href",
      "/forgot-password",
    );
    expect(signupLink.closest("a")).toHaveAttribute("href", "/signup");
  });

  it("calls checkAuthAction on page load", async () => {
    const mockCheckAuthAction = vi.mocked(
      await import("./actions"),
    ).checkAuthAction;
    render(await LoginPage());
    expect(mockCheckAuthAction).toHaveBeenCalled();
  });

  it("renders with proper page structure", async () => {
    render(await LoginPage());
    const title = screen.getByText("NEDGE ACCOUNT");
    expect(title.tagName).toBe("H1");
    expect(title.parentElement).toBeInTheDocument();
  });

  it("renders with proper accessibility structure", async () => {
    render(await LoginPage());
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveTextContent("NEDGE ACCOUNT");
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });
});
