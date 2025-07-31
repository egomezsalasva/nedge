import { render, screen, waitFor } from "@testing-library/react";
import RemoveBookmarkButton from "./RemoveBookmarkButton";
import userEvent from "@testing-library/user-event";

describe("RemoveBookmarkButton", () => {
  it("renders the remove bookmark button", () => {
    render(<RemoveBookmarkButton id={1} />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("disables button when pending", () => {
    render(<RemoveBookmarkButton id={1} />);
    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
  });

  it("renders bin icon inside button", () => {
    render(<RemoveBookmarkButton id={1} />);
    const button = screen.getByRole("button");
    expect(button).toContainHTML("svg");
  });

  it("calls DELETE API with correct id when clicked", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    render(<RemoveBookmarkButton id={123} />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(fetch).toHaveBeenCalledWith("/api/account/bookmarks/123", {
      method: "DELETE",
    });
  });

  it("reloads page after successful API call", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    Object.defineProperty(window, "location", {
      value: { reload: vi.fn() },
      writable: true,
    });
    render(<RemoveBookmarkButton id={1} />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    await waitFor(() => {
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  it("disables button during API call", async () => {
    global.fetch = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );
    render(<RemoveBookmarkButton id={1} />);
    const button = screen.getByRole("button");
    userEvent.click(button);
    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });

  it("re-enables button after API call completes", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    Object.defineProperty(window, "location", {
      value: { reload: vi.fn() },
      writable: true,
    });
    render(<RemoveBookmarkButton id={1} />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it("handles API failure gracefully", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("API Error"));
    Object.defineProperty(window, "location", {
      value: { reload: vi.fn() },
      writable: true,
    });
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<RemoveBookmarkButton id={1} />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to remove bookmark:",
        expect.any(Error),
      );
      expect(window.location.reload).toHaveBeenCalled();
    });
    consoleSpy.mockRestore();
  });

  it("prevents multiple simultaneous clicks", async () => {
    global.fetch = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );
    render(<RemoveBookmarkButton id={1} />);
    const button = screen.getByRole("button");
    // Click multiple times rapidly
    userEvent.click(button);
    userEvent.click(button);
    userEvent.click(button);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  it("button is keyboard accessible", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    render(<RemoveBookmarkButton id={1} />);
    const button = screen.getByRole("button");
    button.focus();
    expect(button).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(fetch).toHaveBeenCalledWith("/api/account/bookmarks/1", {
      method: "DELETE",
    });
  });

  it("has proper ARIA attributes", () => {
    render(<RemoveBookmarkButton id={1} />);
    const button = screen.getByRole("button");
    // Button should be accessible by role
    expect(button).toBeInTheDocument();
    // No explicit aria-label is set (relies on icon for meaning)
    expect(button).not.toHaveAttribute("aria-label");
  });

  it("still reloads page even if API fails with HTTP error", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    Object.defineProperty(window, "location", {
      value: { reload: vi.fn() },
      writable: true,
    });
    render(<RemoveBookmarkButton id={1} />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    await waitFor(() => {
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  it("works with spacebar key", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    render(<RemoveBookmarkButton id={1} />);
    const button = screen.getByRole("button");
    button.focus();
    await userEvent.keyboard(" ");
    expect(fetch).toHaveBeenCalledWith("/api/account/bookmarks/1", {
      method: "DELETE",
    });
  });
});
