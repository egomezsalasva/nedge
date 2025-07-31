import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import StyleShootsList from "./StyleShootsList";

vi.mock("@/app/ui", () => ({
  Card: ({ shoot }: { shoot: { name: string } }) => (
    <div data-testid="mock-card">{shoot.name}</div>
  ),
}));

const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    replace: mockReplace,
  })),
}));

vi.mock("./@utils/getStyleShootsList", () => ({
  getStyleShootsList: vi.fn(),
}));

import { getStyleShootsList } from "./@utils/getStyleShootsList";

describe("StyleShootsList", () => {
  const mockGetStyleShootsList = getStyleShootsList as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockReplace.mockClear();
  });

  it("redirects when no shoots are found", async () => {
    mockGetStyleShootsList.mockResolvedValue({ shoots: [] });
    const { container } = render(<StyleShootsList subStyle="casual" />);
    await vi.waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/explore");
    });
    expect(container.firstChild).toBeNull();
  });

  it("renders loading state initially", () => {
    mockGetStyleShootsList.mockImplementation(() => new Promise(() => {}));
    render(<StyleShootsList subStyle="casual" />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders cards when valid shoots are loaded", async () => {
    const mockShoots = [
      {
        slug: "shoot-1",
        name: "Shoot 1",
        preview_slug: null,
      },
      {
        slug: "shoot-2",
        name: "Shoot 2",
        preview_slug: "",
      },
    ];
    mockGetStyleShootsList.mockResolvedValue({ shoots: mockShoots });
    render(<StyleShootsList subStyle="casual" />);
    const cards = await screen.findAllByTestId("mock-card");
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent("Shoot 1");
    expect(cards[1]).toHaveTextContent("Shoot 2");
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("redirects when all shoots have preview_slug values", async () => {
    const mockShoots = [
      {
        slug: "shoot-1",
        name: "Shoot 1",
        preview_slug: "preview-1",
      },
    ];
    mockGetStyleShootsList.mockResolvedValue({ shoots: mockShoots });
    const { container } = render(<StyleShootsList subStyle="casual" />);
    await vi.waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/explore");
    });
    expect(container.firstChild).toBeNull();
  });

  it("shows error message when fetch fails", async () => {
    mockGetStyleShootsList.mockRejectedValue(new Error("Network error"));
    render(<StyleShootsList subStyle="casual" />);
    const error = await screen.findByTestId("error");
    expect(error).toHaveTextContent("Failed to load shoots.");
  });
});
