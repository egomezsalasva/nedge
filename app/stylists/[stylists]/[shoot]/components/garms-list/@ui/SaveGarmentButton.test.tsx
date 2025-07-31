import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import SaveGarmentButton from "./SaveGarmentButton";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

vi.mock("../GarmsList.module.css", () => ({
  default: {
    garmSaveBtn: "garm-save-btn",
    garmSaveBtn_active: "garm-save-btn-active",
  },
}));

vi.mock("@/app/ui/modals/LoginModal", () => ({
  default: function MockLoginModal({
    title,
    setIsActive,
  }: {
    title: string;
    setIsActive: (active: boolean) => void;
  }) {
    return (
      <div data-testid="login-modal">
        <h2>{title}</h2>
        <button onClick={() => setIsActive(false)}>Close</button>
      </div>
    );
  },
}));

global.fetch = vi.fn();

describe("SaveGarmentButton", () => {
  const mockUsePathname = usePathname as ReturnType<typeof vi.fn>;
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue("/test-path");
    (global.fetch as ReturnType<typeof vi.fn>).mockClear();
  });

  it("renders with 'Save' text initially and shows loading state", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      status: 401,
      ok: false,
    });
    render(<SaveGarmentButton garmId={123} />);
    const button = screen.getByRole("button", { name: /save/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(button).toHaveClass("garm-save-btn");
  });

  it("shows 'Saved' state when garment is already saved", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: () => Promise.resolve({ isSaved: true }),
    });
    render(<SaveGarmentButton garmId={123} />);
    const button = await screen.findByRole("button", { name: /saved/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("garm-save-btn-active");
    expect(button).not.toBeDisabled();
  });

  it("shows 'Save' state when user is logged in but garment is not saved", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: () => Promise.resolve({ isSaved: false }),
    });
    render(<SaveGarmentButton garmId={123} />);
    const button = await screen.findByRole("button", { name: /save/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("garm-save-btn");
    expect(button).not.toHaveClass("garm-save-btn-active");
    expect(button).not.toBeDisabled();
  });

  it("opens login modal when clicking save button while not logged in", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      status: 401,
      ok: false,
    });
    render(<SaveGarmentButton garmId={123} />);
    const button = await screen.findByRole("button", { name: /save/i });
    expect(button).not.toBeDisabled();
    button.click();
    const modal = await screen.findByTestId("login-modal");
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent("You Need To Login To Save");
  });

  it("toggles saved state when clicking button while logged in", async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: () => Promise.resolve({ isSaved: false }),
      })
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: () => Promise.resolve({ action: "inserted" }),
      });
    render(<SaveGarmentButton garmId={123} />);
    const button = await screen.findByRole("button", { name: /save/i });
    expect(button).toHaveClass("garm-save-btn");
    button.click();
    const savedButton = await screen.findByRole("button", { name: /saved/i });
    expect(savedButton).toHaveClass("garm-save-btn-active");
  });

  it("toggles from saved to unsaved when clicking button while logged in", async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: () => Promise.resolve({ isSaved: true }),
      })
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: () => Promise.resolve({ action: "removed" }),
      });
    render(<SaveGarmentButton garmId={123} />);
    const savedButton = await screen.findByRole("button", { name: /saved/i });
    expect(savedButton).toHaveClass("garm-save-btn-active");
    savedButton.click();
    const unsavedButton = await screen.findByRole("button", { name: /save/i });
    expect(unsavedButton).toHaveClass("garm-save-btn");
    expect(unsavedButton).not.toHaveClass("garm-save-btn-active");
  });

  it("handles API error gracefully when checking wardrobe status", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Network error"),
    );
    render(<SaveGarmentButton garmId={123} />);
    const button = await screen.findByRole("button", { name: /save/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    expect(button).toHaveClass("garm-save-btn");
  });

  it("handles API error gracefully when toggling wardrobe item", async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: () => Promise.resolve({ isSaved: false }),
      })
      .mockRejectedValueOnce(new Error("Network error"));
    render(<SaveGarmentButton garmId={123} />);
    const button = await screen.findByRole("button", { name: /save/i });
    expect(button).toHaveClass("garm-save-btn");
    button.click();
    const saveButton = await screen.findByRole("button", { name: /save/i });
    expect(saveButton).toHaveClass("garm-save-btn");
    expect(saveButton).not.toHaveClass("garm-save-btn-active");
  });

  it("closes login modal when close button is clicked", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      status: 401,
      ok: false,
    });
    render(<SaveGarmentButton garmId={123} />);
    const button = await screen.findByRole("button", { name: /save/i });
    button.click();
    const modal = await screen.findByTestId("login-modal");
    expect(modal).toBeInTheDocument();
    const closeButton = screen.getByRole("button", { name: /close/i });
    closeButton.click();
    await screen.findByRole("button", { name: /save/i });
    expect(screen.queryByTestId("login-modal")).not.toBeInTheDocument();
  });

  it("works with different garment IDs", async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: () => Promise.resolve({ isSaved: false }),
      })
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: () => Promise.resolve({ action: "inserted" }),
      });
    render(<SaveGarmentButton garmId={999} />);
    const button = await screen.findByRole("button", { name: /save/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("garm-save-btn");
    button.click();
    const savedButton = await screen.findByRole("button", { name: /saved/i });
    expect(savedButton).toHaveClass("garm-save-btn-active");
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("handles rapid multiple clicks gracefully", async () => {
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: () => Promise.resolve({ isSaved: false }),
      })
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: () => Promise.resolve({ action: "inserted" }),
      })
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: () => Promise.resolve({ action: "removed" }),
      })
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: () => Promise.resolve({ action: "inserted" }),
      });
    render(<SaveGarmentButton garmId={123} />);
    const button = await screen.findByRole("button", { name: /save/i });
    button.click();
    button.click();
    button.click();
    const savedButton = await screen.findByRole("button", { name: /saved/i });
    expect(savedButton).toHaveClass("garm-save-btn-active");
    expect(global.fetch).toHaveBeenCalledTimes(4);
  });

  it("handles component unmounting during API call", async () => {
    const { unmount } = render(<SaveGarmentButton garmId={123} />);
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              status: 200,
              ok: true,
              json: () => Promise.resolve({ isSaved: true }),
            });
          }, 100);
        }),
    );
    unmount();
    expect(() => {}).not.toThrow();
  });
});
