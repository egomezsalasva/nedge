import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccessForm from "./AccessForm";

const mockSetAccess = vi.fn();

describe("AccessForm Component", () => {
  beforeEach(() => {
    mockSetAccess.mockClear();
  });

  it("renders the access form with correct elements", () => {
    render(<AccessForm submissionCode="TEST123" setAccess={mockSetAccess} />);
    expect(screen.getByText("Enter Access Code")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Access code")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /access/i })).toBeInTheDocument();
  });

  it("focuses the input field on mount", async () => {
    render(<AccessForm submissionCode="TEST123" setAccess={mockSetAccess} />);
    const input = screen.getByPlaceholderText("Access code");
    await waitFor(() => {
      expect(input).toHaveFocus();
    });
  });

  it("disables submit button initially", () => {
    render(<AccessForm submissionCode="TEST123" setAccess={mockSetAccess} />);
    const submitButton = screen.getByRole("button", { name: /access/i });
    expect(submitButton).toBeDisabled();
  });

  it("enables submit button when correct code is entered", async () => {
    const user = userEvent.setup();
    render(<AccessForm submissionCode="TEST123" setAccess={mockSetAccess} />);
    const input = screen.getByPlaceholderText("Access code");
    const submitButton = screen.getByRole("button", { name: /access/i });
    await user.type(input, "TEST123");
    expect(submitButton).not.toBeDisabled();
  });

  it("keeps button disabled for invalid codes and prevents submission", async () => {
    const user = userEvent.setup();
    render(<AccessForm submissionCode="TEST123" setAccess={mockSetAccess} />);
    const input = screen.getByPlaceholderText("Access code");
    const submitButton = screen.getByRole("button", { name: /access/i });
    await user.type(input, "WRONG");
    expect(submitButton).toBeDisabled();
    expect(input).toHaveFocus();
    await user.click(submitButton);
    expect(mockSetAccess).not.toHaveBeenCalled();
  });

  it("handles case-insensitive matching", async () => {
    const user = userEvent.setup();
    render(<AccessForm submissionCode="TEST123" setAccess={mockSetAccess} />);
    const input = screen.getByPlaceholderText("Access code");
    const submitButton = screen.getByRole("button", { name: /access/i });
    await user.type(input, "test123");
    expect(submitButton).not.toBeDisabled();
  });

  it("handles whitespace trimming", async () => {
    const user = userEvent.setup();
    render(<AccessForm submissionCode="TEST123" setAccess={mockSetAccess} />);
    const input = screen.getByPlaceholderText("Access code");
    const submitButton = screen.getByRole("button", { name: /access/i });
    await user.type(input, "  TEST123  ");
    expect(submitButton).not.toBeDisabled();
  });

  it("calls setAccess with true when correct code is submitted via button", async () => {
    const user = userEvent.setup();
    render(<AccessForm submissionCode="TEST123" setAccess={mockSetAccess} />);
    const input = screen.getByPlaceholderText("Access code");
    const submitButton = screen.getByRole("button", { name: /access/i });
    await user.type(input, "TEST123");
    await user.click(submitButton);
    expect(mockSetAccess).toHaveBeenCalledWith(true);
  });

  it("handles special characters in access codes", async () => {
    const user = userEvent.setup();
    render(<AccessForm submissionCode="TEST@123!" setAccess={mockSetAccess} />);
    const input = screen.getByPlaceholderText("Access code");
    const submitButton = screen.getByRole("button", { name: /access/i });
    await user.type(input, "test@123!");
    expect(submitButton).not.toBeDisabled();
    await user.click(submitButton);
    expect(mockSetAccess).toHaveBeenCalledWith(true);
  });

  it("handles empty submission codes", async () => {
    const user = userEvent.setup();
    render(<AccessForm submissionCode="" setAccess={mockSetAccess} />);
    const input = screen.getByPlaceholderText("Access code");
    const submitButton = screen.getByRole("button", { name: /access/i });
    expect(submitButton).not.toBeDisabled();
    await user.type(input, "anything");
    expect(submitButton).toBeDisabled();
    await user.clear(input);
    expect(submitButton).not.toBeDisabled();
  });

  it("handles form submission with Enter key", async () => {
    const user = userEvent.setup();
    render(<AccessForm submissionCode="TEST123" setAccess={mockSetAccess} />);
    const input = screen.getByPlaceholderText("Access code");
    await user.type(input, "TEST123");
    await user.keyboard("{Enter}");
    expect(mockSetAccess).toHaveBeenCalledWith(true);
  });
});
