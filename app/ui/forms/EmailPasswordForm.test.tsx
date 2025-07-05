import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmailPasswordForm from "./EmailPasswordForm";

describe("EmailPasswordForm", () => {
  it("renders email and password fields and submit button", () => {
    render(
      <EmailPasswordForm
        submitHandler={vi.fn()}
        submitText="Sign In"
        isSubmitting={false}
        message=""
      />,
    );
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("updates email and password values on change", async () => {
    render(
      <EmailPasswordForm
        submitHandler={vi.fn()}
        submitText="Sign In"
        isSubmitting={false}
        message=""
      />,
    );
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "mypassword");
    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("mypassword");
  });

  it("toggles password visibility when the button is clicked", async () => {
    render(
      <EmailPasswordForm
        submitHandler={vi.fn()}
        submitText="Sign In"
        isSubmitting={false}
        message=""
      />,
    );
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const toggleButton = screen.getByLabelText(/show password/i);
    expect(passwordInput).toHaveAttribute("type", "password");
    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
    expect(toggleButton).toHaveAttribute("aria-label", "Hide password");
    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(toggleButton).toHaveAttribute("aria-label", "Show password");
  });

  it("shows the correct icon depending on password visibility", async () => {
    render(
      <EmailPasswordForm
        submitHandler={vi.fn()}
        submitText="Sign In"
        isSubmitting={false}
        message=""
      />,
    );
    expect(screen.getByTestId("eye-closed-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("eye-open-icon")).not.toBeInTheDocument();
    const toggleButton = screen.getByLabelText(/show password/i);
    await userEvent.click(toggleButton);
    expect(screen.getByTestId("eye-open-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("eye-closed-icon")).not.toBeInTheDocument();
  });

  it("disables submit button when both fields are empty", () => {
    render(
      <EmailPasswordForm
        submitHandler={vi.fn()}
        submitText="Sign In"
        isSubmitting={false}
        message=""
      />,
    );

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    expect(submitButton).toBeDisabled();
  });

  it("disables submit button when email is invalid", async () => {
    render(
      <EmailPasswordForm
        submitHandler={vi.fn()}
        submitText="Sign In"
        isSubmitting={false}
        message=""
      />,
    );
    const submitButton = screen.getByRole("button", { name: /sign in/i });
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    await userEvent.type(emailInput, "invalid-email");
    await userEvent.type(passwordInput, "somepassword");
    expect(submitButton).toBeDisabled();
  });

  it("disables submit button when password is empty", async () => {
    render(
      <EmailPasswordForm
        submitHandler={vi.fn()}
        submitText="Sign In"
        isSubmitting={false}
        message=""
      />,
    );
    const submitButton = screen.getByRole("button", { name: /sign in/i });
    const emailInput = screen.getByPlaceholderText(/email/i);
    await userEvent.type(emailInput, "test@example.com");
    expect(submitButton).toBeDisabled();
  });

  it("enables submit button when both email and password are valid", async () => {
    render(
      <EmailPasswordForm
        submitHandler={vi.fn()}
        submitText="Sign In"
        isSubmitting={false}
        message=""
      />,
    );
    const submitButton = screen.getByRole("button", { name: /sign in/i });
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "somepassword");
    expect(submitButton).toBeEnabled();
  });

  it("disables submit button when isSubmitting is true", async () => {
    render(
      <EmailPasswordForm
        submitHandler={vi.fn()}
        submitText="Sign In"
        isSubmitting={true}
        message=""
      />,
    );
    const submitButton = screen.getByRole("button", { name: /sign in/i });
    expect(submitButton).toBeDisabled();
  });

  it("calls submitHandler when the form is submitted", async () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());
    render(
      <EmailPasswordForm
        submitHandler={handleSubmit}
        submitText="Sign In"
        isSubmitting={false}
        message=""
      />,
    );
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "somepassword");
    await userEvent.click(submitButton);
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("displays the message when provided", () => {
    render(
      <EmailPasswordForm
        submitHandler={vi.fn()}
        submitText="Sign In"
        isSubmitting={false}
        message="This is a test message"
      />,
    );
    expect(screen.getByText("This is a test message")).toBeInTheDocument();
  });

  it("does not display a message when message is empty", () => {
    render(
      <EmailPasswordForm
        submitHandler={vi.fn()}
        submitText="Sign In"
        isSubmitting={false}
        message=""
      />,
    );

    expect(screen.queryByTestId("form-message")).not.toBeInTheDocument();
  });

  it("password input has autocomplete set to current-password by default", () => {
    render(
      <EmailPasswordForm
        submitHandler={vi.fn()}
        submitText="Sign In"
        isSubmitting={false}
        message=""
      />,
    );
    const passwordInput = screen.getByPlaceholderText(/password/i);
    expect(passwordInput).toHaveAttribute("autocomplete", "current-password");
  });

  it("email input has autocomplete set to email", () => {
    render(
      <EmailPasswordForm
        submitHandler={vi.fn()}
        submitText="Sign In"
        isSubmitting={false}
        message=""
      />,
    );
    const emailInput = screen.getByPlaceholderText(/email/i);
    expect(emailInput).toHaveAttribute("autocomplete", "email");
  });

  it("allows toggling password visibility with keyboard", async () => {
    render(
      <EmailPasswordForm
        submitHandler={vi.fn()}
        submitText="Sign In"
        isSubmitting={false}
        message=""
      />,
    );
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const toggleButton = screen.getByLabelText(/show password/i);
    toggleButton.focus();
    expect(toggleButton).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(passwordInput).toHaveAttribute("type", "text");
  });
});
