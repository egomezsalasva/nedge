import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import BookmarkButton from "./BookmarkButton";

vi.mock("@/app/svgs", () => ({
  Bookmark: ({ fill }: { fill: string }) => (
    <svg data-testid="bookmark-icon" fill={fill}>
      bookmark
    </svg>
  ),
}));

vi.mock("@/app/ui/modals/LoginModal", () => ({
  default: function MockLoginModal({
    setIsActive,
  }: {
    setIsActive: (active: boolean) => void;
  }) {
    return (
      <div data-testid="login-modal">
        <button onClick={() => setIsActive(false)}>Close Modal</button>
      </div>
    );
  },
}));

vi.mock("../ShootDetails.module.css", () => ({
  default: {
    bookmarkBtn: "bookmark-btn-class",
  },
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;
Object.defineProperty(window, "location", {
  value: {
    pathname: "/test/path",
  },
  writable: true,
});

describe("BookmarkButton Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders bookmark button with correct test id", () => {
    render(<BookmarkButton shootId={123} />);
    const button = screen.getByTestId("bookmark");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bookmark-btn-class");
  });

  it("renders bookmark icon", () => {
    render(<BookmarkButton shootId={123} />);
    const icon = screen.getByTestId("bookmark-icon");
    expect(icon).toBeInTheDocument();
  });

  it("does not render login modal initially", () => {
    expect(screen.queryByTestId("login-modal")).not.toBeInTheDocument();
  });

  it("checks bookmark status on mount", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isBookmarked: true }),
    });
    render(<BookmarkButton shootId={123} />);
    expect(mockFetch).toHaveBeenCalledWith(
      `/api/account/bookmarks?shoot_id=123&source_pathname=${encodeURIComponent("/test/path")}`,
    );
  });

  it("sets bookmark to true when API returns isBookmarked: true", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isBookmarked: true }),
    });
    render(<BookmarkButton shootId={123} />);
    await screen.findByTestId("bookmark-icon");
    const icon = screen.getByTestId("bookmark-icon");
    expect(icon).toHaveAttribute("fill", "currentColor");
  });

  it("sets bookmark to false when API returns isBookmarked: false", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isBookmarked: false }),
    });
    render(<BookmarkButton shootId={123} />);
    await screen.findByTestId("bookmark-icon");
    const icon = screen.getByTestId("bookmark-icon");
    expect(icon).toHaveAttribute("fill", "none");
  });

  it("sets bookmark to false when API returns 401", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });
    render(<BookmarkButton shootId={123} />);
    await screen.findByTestId("bookmark-icon");
    const icon = screen.getByTestId("bookmark-icon");
    expect(icon).toHaveAttribute("fill", "none");
  });

  it("handles fetch error gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    render(<BookmarkButton shootId={123} />);
    await screen.findByTestId("bookmark-icon");
    const icon = screen.getByTestId("bookmark-icon");
    expect(icon).toHaveAttribute("fill", "none");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error checking bookmark status:",
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });

  it("toggles bookmark when clicked and API returns inserted", async () => {
    // Initial status check
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isBookmarked: false }),
    });
    render(<BookmarkButton shootId={123} />);
    await screen.findByTestId("bookmark-icon");
    let icon = screen.getByTestId("bookmark-icon");
    expect(icon).toHaveAttribute("fill", "none");
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ action: "inserted" }),
    });
    const button = screen.getByTestId("bookmark");
    fireEvent.click(button);
    await screen.findByTestId("bookmark-icon");
    icon = screen.getByTestId("bookmark-icon");
    expect(icon).toHaveAttribute("fill", "currentColor");
    expect(mockFetch).toHaveBeenCalledWith("/api/account/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shoot_id: 123,
        source_pathname: "/test/path",
      }),
    });
  });

  it("toggles bookmark when clicked and API returns deleted", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isBookmarked: true }),
    });
    render(<BookmarkButton shootId={123} />);
    await screen.findByTestId("bookmark-icon");
    let icon = screen.getByTestId("bookmark-icon");
    expect(icon).toHaveAttribute("fill", "currentColor");
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ action: "deleted" }),
    });
    const button = screen.getByTestId("bookmark");
    fireEvent.click(button);
    await screen.findByTestId("bookmark-icon");
    icon = screen.getByTestId("bookmark-icon");
    expect(icon).toHaveAttribute("fill", "none");
  });

  it("shows login modal when API returns 401 on toggle", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isBookmarked: false }),
    });
    render(<BookmarkButton shootId={123} />);
    await screen.findByTestId("bookmark-icon");
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });
    const button = screen.getByTestId("bookmark");
    fireEvent.click(button);
    await screen.findByTestId("login-modal");
    expect(screen.getByTestId("login-modal")).toBeInTheDocument();
  });

  it("disables button during bookmark toggle", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isBookmarked: false }),
    });
    render(<BookmarkButton shootId={123} />);
    await screen.findByTestId("bookmark-icon");
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({ action: "inserted" }),
              }),
            100,
          ),
        ),
    );
    const button = screen.getByTestId("bookmark");
    fireEvent.click(button);
    expect(button).toBeDisabled();
  });

  it("uses the provided shootId in API calls", async () => {
    const customShootId = 456;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isBookmarked: false }),
    });
    render(<BookmarkButton shootId={customShootId} />);
    await screen.findByTestId("bookmark-icon");
    expect(mockFetch).toHaveBeenCalledWith(
      `/api/account/bookmarks?shoot_id=${customShootId}&source_pathname=${encodeURIComponent("/test/path")}`,
    );
  });

  it("handles fetch error during toggle gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isBookmarked: false }),
    });
    render(<BookmarkButton shootId={123} />);
    await screen.findByTestId("bookmark-icon");
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    const button = screen.getByTestId("bookmark");
    fireEvent.click(button);
    await screen.findByTestId("bookmark-icon");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error toggling bookmark:",
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });

  it("can close login modal", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isBookmarked: false }),
    });
    render(<BookmarkButton shootId={123} />);
    await screen.findByTestId("bookmark-icon");
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });
    const button = screen.getByTestId("bookmark");
    fireEvent.click(button);
    await screen.findByTestId("login-modal");
    expect(screen.getByTestId("login-modal")).toBeInTheDocument();
    const closeButton = screen.getByText("Close Modal");
    fireEvent.click(closeButton);
    await screen.findByTestId("bookmark-icon");
    expect(screen.queryByTestId("login-modal")).not.toBeInTheDocument();
  });

  it("disables button during initial loading", async () => {
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({ isBookmarked: false }),
              }),
            100,
          ),
        ),
    );
    render(<BookmarkButton shootId={123} />);
    const button = screen.getByTestId("bookmark");
    expect(button).toBeDisabled();
  });

  it("enables button after initial loading completes", async () => {
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({ isBookmarked: false }),
              }),
            100,
          ),
        ),
    );
    render(<BookmarkButton shootId={123} />);
    const button = screen.getByTestId("bookmark");
    expect(button).toBeDisabled();
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it("enables button after bookmark toggle completes", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isBookmarked: false }),
    });
    render(<BookmarkButton shootId={123} />);
    await screen.findByTestId("bookmark-icon");
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({ action: "inserted" }),
              }),
            100,
          ),
        ),
    );
    const button = screen.getByTestId("bookmark");
    fireEvent.click(button);
    expect(button).toBeDisabled();
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it("enables button after toggle error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isBookmarked: false }),
    });
    render(<BookmarkButton shootId={123} />);
    await screen.findByTestId("bookmark-icon");
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve, reject) =>
          setTimeout(() => {
            reject(new Error("Network error"));
          }, 100),
        ),
    );
    const button = screen.getByTestId("bookmark");
    fireEvent.click(button);
    expect(button).toBeDisabled();
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it("enables button after login modal is closed", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isBookmarked: false }),
    });
    render(<BookmarkButton shootId={123} />);
    await screen.findByTestId("bookmark-icon");
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });
    const button = screen.getByTestId("bookmark");
    fireEvent.click(button);
    expect(button).toBeDisabled();
    await screen.findByTestId("login-modal");
    const closeButton = screen.getByText("Close Modal");
    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it("handles different shootId values correctly", async () => {
    const shootId1 = 123;
    const shootId2 = 456;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isBookmarked: true }),
    });
    const { rerender } = render(<BookmarkButton shootId={shootId1} />);
    await screen.findByTestId("bookmark-icon");
    expect(mockFetch).toHaveBeenCalledWith(
      `/api/account/bookmarks?shoot_id=${shootId1}&source_pathname=${encodeURIComponent("/test/path")}`,
    );
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isBookmarked: false }),
    });
    rerender(<BookmarkButton shootId={shootId2} />);
    await screen.findByTestId("bookmark-icon");
    expect(mockFetch).toHaveBeenCalledWith(
      `/api/account/bookmarks?shoot_id=${shootId2}&source_pathname=${encodeURIComponent("/test/path")}`,
    );
  });

  it("uses correct pathname in API calls", async () => {
    Object.defineProperty(window, "location", {
      value: {
        pathname: "/different/path",
      },
      writable: true,
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isBookmarked: false }),
    });
    render(<BookmarkButton shootId={123} />);
    await screen.findByTestId("bookmark-icon");
    expect(mockFetch).toHaveBeenCalledWith(
      `/api/account/bookmarks?shoot_id=123&source_pathname=${encodeURIComponent("/different/path")}`,
    );
  });

  it("enables button after initial loading completes", async () => {
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({ isBookmarked: false }),
              }),
            100,
          ),
        ),
    );
    render(<BookmarkButton shootId={123} />);
    const button = screen.getByTestId("bookmark");
    expect(button).toBeDisabled();
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});
