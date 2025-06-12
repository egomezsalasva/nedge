import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { formatDate } from "@/app/@utils";
import LatestList from "./LatestList";

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockApiResponse = [
  {
    name: "Test Title 1",
    slug: "test-title-1",
    publication_date: "2025-05-19T00:00:00.000Z",
    description: "Test Description 1",
    stylist: { name: "Test Stylist 1", slug: "test-stylist-1" },
    city: { name: "Test City 1" },
    shoot_style_tags: ["Tag1", "Tag2"],
    first_image: "/test-img-1.png",
  },
  {
    name: "Test Title 2",
    slug: "test-title-2",
    publication_date: "2025-05-19T00:00:00.000Z",
    description: "Test Description 2",
    stylist: { name: "Test Stylist 2", slug: "test-stylist-2" },
    city: { name: "Test City 2" },
    shoot_style_tags: ["Tag3", "Tag4"],
    first_image: "/test-img-2.png",
  },
  {
    name: "Test Title 3",
    slug: "test-title-3",
    publication_date: "2025-05-09T00:00:00.000Z",
    description: "Test Description 3",
    stylist: { name: "Test Stylist 3", slug: "test-stylist-3" },
    city: { name: "Test City 3" },
    shoot_style_tags: ["Tag5", "Tag6"],
    first_image: "/test-img-3.png",
  },
];

describe("Latest List Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    });
  });

  it("renders the heading 'Latest Shoots'", async () => {
    render(<LatestList />);
    expect(
      screen.getByRole("heading", { name: /latest shoots/i }),
    ).toBeInTheDocument();
  });

  it("shows loading state initially", () => {
    render(<LatestList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("fetches data from the correct API endpoint", async () => {
    render(<LatestList />);
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/latest/list");
    });
  });

  it("renders the correct number of Card components (excludes first shoot)", async () => {
    render(<LatestList />);
    await waitFor(() => {
      const shoots = screen.getAllByTestId("shoot-card");
      expect(shoots.length).toBe(mockApiResponse.length - 1);
      expect(shoots.length).toBe(2);
    });
  });

  it("each Card receives the correct shoot props", async () => {
    render(<LatestList />);
    await waitFor(() => {
      const expectedShoots = mockApiResponse.slice(1);
      const cards = screen.getAllByTestId("shoot-card");
      expectedShoots.forEach((shoot, idx) => {
        const card = cards[idx];
        const headingRegex = new RegExp(
          `${shoot.name}:\\s*${shoot.stylist.name}`,
          "i",
        );
        expect(card).toHaveTextContent(headingRegex);
        expect(card).toHaveTextContent(shoot.city.name);
        const expectedDate = formatDate(shoot.publication_date);
        expect(card).toHaveTextContent(expectedDate);
        shoot.shoot_style_tags.forEach((tag) => {
          expect(card).toHaveTextContent(tag);
        });
        const img = card.querySelector("img");
        expect(img).toBeTruthy();
        expect(img?.getAttribute("src")).toBe(shoot.first_image);
        expect(img?.getAttribute("alt")).toBe(shoot.name);
      });
    });
  });

  it("handles empty API response", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => null,
    });
    render(<LatestList />);
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/latest/list");
      expect(screen.getByText("Loading...")).toBeInTheDocument();
      expect(screen.queryByTestId("shoot-card")).not.toBeInTheDocument();
    });
  });

  it("handles empty array response", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });
    render(<LatestList />);

    await waitFor(() => {
      expect(screen.queryByTestId("shoot-card")).not.toBeInTheDocument();
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
  });

  it("removes loading text once data is loaded", async () => {
    render(<LatestList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
  });
});
