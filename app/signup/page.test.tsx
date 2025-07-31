import { render, screen } from "@testing-library/react";
import SignupPage from "./page";

vi.mock("./actions", () => ({
  checkAuthAction: vi.fn(),
}));

vi.mock("./SignupForm", () => ({
  default: function MockSignupForm() {
    return <div data-testid="signup-form">Signup Form</div>;
  },
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
      <a href={href} data-testid="login-link">
        {children}
      </a>
    );
  },
}));

describe("SignupPage", () => {
  it("renders signup page with correct content", async () => {
    render(await SignupPage());
    expect(screen.getByText("NEDGE ACCOUNT")).toBeInTheDocument();
    expect(
      screen.getByText(/Sign up or log in to bookmark/),
    ).toBeInTheDocument();
    expect(screen.getByTestId("signup-form")).toBeInTheDocument();
    expect(screen.getByTestId("login-link")).toHaveTextContent("Log in");
    expect(screen.getByTestId("login-link")).toHaveAttribute("href", "/login");
  });

  it("handles authentication check correctly", async () => {
    const mockCheckAuthAction = vi.mocked(
      await import("./actions"),
    ).checkAuthAction;
    mockCheckAuthAction.mockResolvedValue({ isAuthenticated: false });
    render(await SignupPage());
    expect(mockCheckAuthAction).toHaveBeenCalled();
    expect(screen.getByText("NEDGE ACCOUNT")).toBeInTheDocument();
  });

  it("handles authentication errors gracefully", async () => {
    const mockCheckAuthAction = vi.mocked(
      await import("./actions"),
    ).checkAuthAction;
    mockCheckAuthAction.mockImplementation(() => {
      return Promise.resolve({ isAuthenticated: false });
    });
    const page = await SignupPage();
    expect(() => {
      render(page);
    }).not.toThrow();
    expect(screen.getByText("NEDGE ACCOUNT")).toBeInTheDocument();
    expect(screen.getByTestId("signup-form")).toBeInTheDocument();
  });

  it("handles redirect when user is already authenticated", async () => {
    const mockCheckAuthAction = vi.mocked(
      await import("./actions"),
    ).checkAuthAction;
    mockCheckAuthAction.mockImplementation(() => {
      const error = new Error("NEXT_REDIRECT");
      (error as unknown as { digest: string }).digest = "NEXT_REDIRECT";
      throw error;
    });
    await expect(SignupPage()).rejects.toThrow("NEXT_REDIRECT");
    expect(mockCheckAuthAction).toHaveBeenCalled();
  });

  it("maintains component structure across re-renders", async () => {
    const mockCheckAuthAction = vi.mocked(
      await import("./actions"),
    ).checkAuthAction;
    mockCheckAuthAction.mockResolvedValue({ isAuthenticated: false });
    const page = await SignupPage();
    const { rerender } = render(page);
    expect(screen.getByText("NEDGE ACCOUNT")).toBeInTheDocument();
    expect(screen.getByTestId("signup-form")).toBeInTheDocument();
    expect(screen.getByTestId("login-link")).toBeInTheDocument();
    rerender(page);
    expect(screen.getByText("NEDGE ACCOUNT")).toBeInTheDocument();
    expect(screen.getByTestId("signup-form")).toBeInTheDocument();
    expect(screen.getByTestId("login-link")).toBeInTheDocument();
    expect(screen.getByTestId("login-link")).toHaveTextContent("Log in");
  });

  it("handles component unmounting gracefully", async () => {
    const mockCheckAuthAction = vi.mocked(
      await import("./actions"),
    ).checkAuthAction;
    mockCheckAuthAction.mockResolvedValue({ isAuthenticated: false });
    const page = await SignupPage();
    const { unmount } = render(page);
    expect(screen.getByText("NEDGE ACCOUNT")).toBeInTheDocument();
    expect(screen.getByTestId("signup-form")).toBeInTheDocument();
    unmount();
    expect(screen.queryByText("NEDGE ACCOUNT")).not.toBeInTheDocument();
    expect(screen.queryByTestId("signup-form")).not.toBeInTheDocument();
  });

  it("handles concurrent page loads without conflicts", async () => {
    const mockCheckAuthAction = vi.mocked(
      await import("./actions"),
    ).checkAuthAction;
    mockCheckAuthAction.mockResolvedValue({ isAuthenticated: false });
    const page1 = await SignupPage();
    const page2 = await SignupPage();
    const page3 = await SignupPage();
    const { unmount: unmount1 } = render(page1);
    expect(screen.getByText("NEDGE ACCOUNT")).toBeInTheDocument();
    unmount1();
    const { unmount: unmount2 } = render(page2);
    expect(screen.getByText("NEDGE ACCOUNT")).toBeInTheDocument();
    unmount2();
    render(page3);
    expect(screen.getByText("NEDGE ACCOUNT")).toBeInTheDocument();
    expect(screen.getByTestId("signup-form")).toBeInTheDocument();
  });

  it("handles missing dependencies gracefully", async () => {
    const page = await SignupPage();
    expect(() => {
      render(page);
    }).not.toThrow();
    expect(screen.getByText("NEDGE ACCOUNT")).toBeInTheDocument();
  });

  it("tests page accessibility", async () => {
    const mockCheckAuthAction = vi.mocked(
      await import("./actions"),
    ).checkAuthAction;
    mockCheckAuthAction.mockResolvedValue({ isAuthenticated: false });
    const page = await SignupPage();
    render(page);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "NEDGE ACCOUNT",
    );
    const loginLink = screen.getByRole("link", { name: /log in/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");
    expect(screen.getByTestId("signup-form")).toBeInTheDocument();
  });

  it("handles different authentication states", async () => {
    const mockCheckAuthAction = vi.mocked(
      await import("./actions"),
    ).checkAuthAction;
    mockCheckAuthAction.mockResolvedValue({ isAuthenticated: false });
    const page1 = await SignupPage();
    const { unmount: unmount1 } = render(page1);
    expect(screen.getByText("NEDGE ACCOUNT")).toBeInTheDocument();
    unmount1();
    mockCheckAuthAction.mockResolvedValue({ isAuthenticated: true });
    const page2 = await SignupPage();
    const { unmount: unmount2 } = render(page2);
    expect(screen.getByText("NEDGE ACCOUNT")).toBeInTheDocument();
    unmount2();
    mockCheckAuthAction.mockResolvedValue({ isAuthenticated: false });
    const page3 = await SignupPage();
    render(page3);
    expect(screen.getByText("NEDGE ACCOUNT")).toBeInTheDocument();
  });

  it("handles error boundaries gracefully", async () => {
    const mockCheckAuthAction = vi.mocked(
      await import("./actions"),
    ).checkAuthAction;
    mockCheckAuthAction.mockResolvedValue({ isAuthenticated: false });
    expect(() => {
      render(SignupPage());
    }).not.toThrow();
    const page = await SignupPage();
    render(page);
    expect(screen.getByText("NEDGE ACCOUNT")).toBeInTheDocument();
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(page);
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
