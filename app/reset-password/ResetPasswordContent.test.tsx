import { fireEvent, render, screen } from "@testing-library/react";
import ResetPasswordContent from "./ResetPasswordContent";
import { ReadonlyURLSearchParams } from "next/navigation";

vi.mock("./actions", () => ({
  resetPasswordAction: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

vi.mock("../ui/forms/@svgs", () => ({
  EyeOpenIcon: function MockEyeOpenIcon() {
    return <div data-testid="eye-open-icon">Eye Open</div>;
  },
  EyeClosedIcon: function MockEyeClosedIcon() {
    return <div data-testid="eye-closed-icon">Eye Closed</div>;
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
      <a href={href} data-testid="account-link">
        {children}
      </a>
    );
  },
}));

describe("ResetPasswordContent", () => {
  beforeEach(async () => {
    const mockUseSearchParams = vi.mocked(
      await import("next/navigation"),
    ).useSearchParams;
    mockUseSearchParams.mockReturnValue({
      get: vi.fn().mockReturnValue("Reset Password"),
    } as unknown as ReadonlyURLSearchParams);
  });

  it("renders reset password form with correct content", () => {
    render(<ResetPasswordContent />);
    expect(screen.getByText("Reset Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("New password")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirm new password"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Set New Password" }),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("eye-closed-icon")).toHaveLength(2);
  });

  it("validates password matching", async () => {
    render(<ResetPasswordContent />);
    const passwordInput = screen.getByPlaceholderText("New password");
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm new password",
    );
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password456" },
    });
    fireEvent.blur(passwordInput);
    fireEvent.blur(confirmPasswordInput);
    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
  });

  it("handles successful password reset", async () => {
    const mockResetPasswordAction = vi.mocked(
      await import("./actions"),
    ).resetPasswordAction;
    mockResetPasswordAction.mockResolvedValue({ success: true });
    render(<ResetPasswordContent />);
    const passwordInput = screen.getByPlaceholderText("New password");
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm new password",
    );
    const submitButton = screen.getByRole("button", {
      name: "Set New Password",
    });
    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "newpassword123" },
    });
    fireEvent.click(submitButton);
    await screen.findByText("Password updated successfully!");
    expect(screen.getByTestId("account-link")).toBeInTheDocument();
  });

  it("handles password reset errors", async () => {
    const mockResetPasswordAction = vi.mocked(
      await import("./actions"),
    ).resetPasswordAction;
    mockResetPasswordAction.mockResolvedValue({ error: "Invalid token" });
    render(<ResetPasswordContent />);
    const passwordInput = screen.getByPlaceholderText("New password");
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm new password",
    );
    const submitButton = screen.getByRole("button", {
      name: "Set New Password",
    });
    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "newpassword123" },
    });
    fireEvent.click(submitButton);
    await screen.findByText("Invalid token");
  });

  it("validates minimum password length", async () => {
    render(<ResetPasswordContent />);
    const passwordInput = screen.getByPlaceholderText("New password");
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm new password",
    );
    const submitButton = screen.getByRole("button", {
      name: "Set New Password",
    });
    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "123" } });
    expect(submitButton).toBeDisabled();
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });
    expect(submitButton).not.toBeDisabled();
  });

  it("handles loading state during submission", async () => {
    const mockResetPasswordAction = vi.mocked(
      await import("./actions"),
    ).resetPasswordAction;
    mockResetPasswordAction.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ success: true }), 100),
        ),
    );
    render(<ResetPasswordContent />);
    const passwordInput = screen.getByPlaceholderText("New password");
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm new password",
    );
    const submitButton = screen.getByRole("button", {
      name: "Set New Password",
    });
    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "newpassword123" },
    });
    fireEvent.click(submitButton);
    expect(screen.getByText("Setting Password...")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("handles password visibility toggle", async () => {
    render(<ResetPasswordContent />);
    const passwordInput = screen.getByPlaceholderText("New password");
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm new password",
    );
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(confirmPasswordInput).toHaveAttribute("type", "password");
    expect(screen.getAllByTestId("eye-closed-icon")).toHaveLength(2);
    expect(screen.queryByTestId("eye-open-icon")).not.toBeInTheDocument();
    const firstEyeIcon = screen.getAllByTestId("eye-closed-icon")[0];
    fireEvent.click(firstEyeIcon);
    expect(passwordInput).toHaveAttribute("type", "text");
    expect(confirmPasswordInput).toHaveAttribute("type", "text");
    expect(screen.getAllByTestId("eye-open-icon")).toHaveLength(2);
    expect(screen.queryByTestId("eye-closed-icon")).not.toBeInTheDocument();
    const eyeOpenIcon = screen.getAllByTestId("eye-open-icon")[0];
    fireEvent.click(eyeOpenIcon);
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(confirmPasswordInput).toHaveAttribute("type", "password");
    expect(screen.getAllByTestId("eye-closed-icon")).toHaveLength(2);
  });

  it("handles form submission when disabled", async () => {
    const mockResetPasswordAction = vi.mocked(
      await import("./actions"),
    ).resetPasswordAction;
    render(<ResetPasswordContent />);
    const passwordInput = screen.getByPlaceholderText("New password");
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm new password",
    );
    const submitButton = screen.getByRole("button", {
      name: "Set New Password",
    });
    const form = submitButton.closest("form");
    expect(submitButton).toBeDisabled();
    fireEvent.submit(form!);
    expect(mockResetPasswordAction).toHaveBeenCalled();
    fireEvent.change(passwordInput, { target: { value: "short" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "diff" } });
    fireEvent.blur(passwordInput);
    fireEvent.blur(confirmPasswordInput);
    expect(submitButton).toBeDisabled();
    mockResetPasswordAction.mockClear();
    fireEvent.submit(form!);
    expect(mockResetPasswordAction).toHaveBeenCalled();
  });

  it("handles form submission when disabled", async () => {
    const mockResetPasswordAction = vi.mocked(
      await import("./actions"),
    ).resetPasswordAction;
    render(<ResetPasswordContent />);
    const passwordInput = screen.getByPlaceholderText("New password");
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm new password",
    );
    const submitButton = screen.getByRole("button", {
      name: "Set New Password",
    });
    const form = submitButton.closest("form");
    expect(submitButton).toBeDisabled();
    fireEvent.submit(form!);
    expect(mockResetPasswordAction).toHaveBeenCalled();
    fireEvent.change(passwordInput, { target: { value: "short" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "diff" } });
    fireEvent.blur(passwordInput);
    fireEvent.blur(confirmPasswordInput);
    expect(submitButton).toBeDisabled();
    mockResetPasswordAction.mockClear();
    fireEvent.submit(form!);
    expect(mockResetPasswordAction).toHaveBeenCalled();
  });

  it("handles different title from search params", async () => {
    const mockUseSearchParams = vi.mocked(
      await import("next/navigation"),
    ).useSearchParams;
    mockUseSearchParams.mockReturnValue({
      get: vi.fn().mockReturnValue("Custom Reset Title"),
    } as unknown as ReadonlyURLSearchParams);
    render(<ResetPasswordContent />);
    expect(screen.getByText("Custom Reset Title")).toBeInTheDocument();
    expect(screen.queryByText("Reset Password")).not.toBeInTheDocument();
  });

  it("handles form reset after successful submission", async () => {
    const mockResetPasswordAction = vi.mocked(
      await import("./actions"),
    ).resetPasswordAction;
    mockResetPasswordAction.mockResolvedValue({ success: true });
    render(<ResetPasswordContent />);
    const passwordInput = screen.getByPlaceholderText("New password");
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm new password",
    );
    const submitButton = screen.getByRole("button", {
      name: "Set New Password",
    });
    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "newpassword123" },
    });
    fireEvent.blur(passwordInput);
    fireEvent.blur(confirmPasswordInput);
    fireEvent.click(submitButton);
    await screen.findByText("Password updated successfully!");
    expect(passwordInput).toHaveValue("");
    expect(confirmPasswordInput).toHaveValue("");
    expect(submitButton).toBeDisabled();
  });

  it("handles concurrent submissions", async () => {
    const mockResetPasswordAction = vi.mocked(
      await import("./actions"),
    ).resetPasswordAction;
    mockResetPasswordAction.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ success: true }), 200),
        ),
    );
    render(<ResetPasswordContent />);
    const passwordInput = screen.getByPlaceholderText("New password");
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm new password",
    );
    const submitButton = screen.getByRole("button", {
      name: "Set New Password",
    });
    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "newpassword123" },
    });
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);
    expect(screen.getByText("Setting Password...")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    await screen.findByText("Password updated successfully!");
    expect(mockResetPasswordAction).toHaveBeenCalledTimes(3);
  });

  it("handles component unmounting during submission", async () => {
    const mockResetPasswordAction = vi.mocked(
      await import("./actions"),
    ).resetPasswordAction;
    mockResetPasswordAction.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ success: true }), 200),
        ),
    );
    const { unmount } = render(<ResetPasswordContent />);
    const passwordInput = screen.getByPlaceholderText("New password");
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm new password",
    );
    const submitButton = screen.getByRole("button", {
      name: "Set New Password",
    });
    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "newpassword123" },
    });
    fireEvent.click(submitButton);
    unmount();
    expect(mockResetPasswordAction).toHaveBeenCalled();
  });
});
