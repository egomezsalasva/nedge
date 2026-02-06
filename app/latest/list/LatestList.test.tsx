import { render, screen, waitFor } from "@testing-library/react";
import { formatDate } from "@/app/utils";
import LatestList from "./LatestList";
import { CardType } from "@/app/ui";

vi.mock("./@utils/getLatestShootsListData", () => ({
  getLatestShootsListData: vi.fn(),
}));

const mockApiResponse = [
  {
    name: "Test Title 1",
    slug: "test-title-1",
    publication_date: "2025-05-19T00:00:00.000Z",
    description: "Test Description 1",
    stylist: { name: "Test Stylist 1", slug: "test-stylist-1" },
    city: { name: "Test City 1" },
    shoot_style_tags: [
      {
        name: "Tag1",
        slug: "tag-1",
      },
      {
        name: "Tag2",
        slug: "tag-2",
      },
    ],
    first_image: "/test-img-1.png",
  },
  {
    name: "Test Title 2",
    slug: "test-title-2",
    publication_date: "2025-05-19T00:00:00.000Z",
    description: "Test Description 2",
    stylist: { name: "Test Stylist 2", slug: "test-stylist-2" },
    city: { name: "Test City 2" },
    shoot_style_tags: [
      {
        name: "Tag3",
        slug: "tag-3",
      },
      {
        name: "Tag4",
        slug: "tag-4",
      },
    ],
    first_image: "/test-img-2.png",
  },
  {
    name: "Test Title 3",
    slug: "test-title-3",
    publication_date: "2025-05-09T00:00:00.000Z",
    description: "Test Description 3",
    stylist: { name: "Test Stylist 3", slug: "test-stylist-3" },
    city: { name: "Test City 3" },
    shoot_style_tags: [
      {
        name: "Tag5",
        slug: "tag-5",
      },
      {
        name: "Tag6",
        slug: "tag-6",
      },
    ],
    first_image: "/test-img-3.png",
  },
];

describe("Latest List Component", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { getLatestShootsListData } =
      await import("./@utils/getLatestShootsListData");
    vi.mocked(getLatestShootsListData).mockResolvedValue(mockApiResponse);
  });

  describe("Basic Rendering", () => {
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

    it("removes loading text once data is loaded", async () => {
      render(<LatestList />);
      expect(screen.getByText("Loading...")).toBeInTheDocument();
      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      });
    });
  });

  describe("Data Fetching", () => {
    it("calls getLatestShootsListData function", async () => {
      render(<LatestList />);
      await waitFor(async () => {
        const { getLatestShootsListData } =
          await import("./@utils/getLatestShootsListData");
        expect(getLatestShootsListData).toHaveBeenCalled();
      });
    });

    it("shows loading state during data fetch", async () => {
      const { getLatestShootsListData } =
        await import("./@utils/getLatestShootsListData");
      let resolvePromise: (value: CardType[]) => void;
      const promise = new Promise<CardType[]>((resolve) => {
        resolvePromise = resolve;
      });
      vi.mocked(getLatestShootsListData).mockReturnValue(promise);

      render(<LatestList />);
      expect(screen.getByText("Loading...")).toBeInTheDocument();

      resolvePromise!(mockApiResponse);
      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      });
    });

    it("maintains loading state until data resolves", async () => {
      const { getLatestShootsListData } =
        await import("./@utils/getLatestShootsListData");
      let resolvePromise: (value: CardType[]) => void;
      const promise = new Promise<CardType[]>((resolve) => {
        resolvePromise = resolve;
      });
      vi.mocked(getLatestShootsListData).mockReturnValue(promise);
      render(<LatestList />);
      expect(screen.getByText("Loading...")).toBeInTheDocument();
      expect(screen.queryByTestId("shoot-card")).not.toBeInTheDocument();
      resolvePromise!(mockApiResponse);
      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
        expect(screen.getAllByTestId("shoot-card")).toHaveLength(2);
      });
    });
  });

  describe("Card Rendering", () => {
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
            expect(card).toHaveTextContent(tag.name);
          });
          const img = card.querySelector("img");
          expect(img).toBeTruthy();
          expect(img?.getAttribute("src")).toBe(shoot.first_image);
          expect(img?.getAttribute("alt")).toBe(shoot.name);
        });
      });
    });

    it("renders cards with correct navigation links", async () => {
      render(<LatestList />);
      await waitFor(() => {
        const links = screen.getAllByRole("link");
        const expectedShoots = mockApiResponse.slice(1);
        expectedShoots.forEach((shoot) => {
          const expectedHref = `/stylists/${shoot.stylist.slug}/${shoot.slug}`;
          const cardLinks = links.filter(
            (link) => link.getAttribute("href") === expectedHref,
          );
          expect(cardLinks.length).toBeGreaterThanOrEqual(2);
        });
      });
    });
  });

  describe("Empty States", () => {
    it("handles empty API response", async () => {
      const { getLatestShootsListData } =
        await import("./@utils/getLatestShootsListData");
      vi.mocked(getLatestShootsListData).mockResolvedValue([]);
      render(<LatestList />);
      await waitFor(() => {
        expect(getLatestShootsListData).toHaveBeenCalled();
        expect(screen.queryByTestId("shoot-card")).not.toBeInTheDocument();
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      });
    });

    it("handles single shoot in response", async () => {
      const { getLatestShootsListData } =
        await import("./@utils/getLatestShootsListData");
      vi.mocked(getLatestShootsListData).mockResolvedValue([
        mockApiResponse[0],
      ]);
      render(<LatestList />);
      await waitFor(() => {
        expect(screen.queryByTestId("shoot-card")).not.toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("handles error state when API call fails", async () => {
      const { getLatestShootsListData } =
        await import("./@utils/getLatestShootsListData");
      vi.mocked(getLatestShootsListData).mockRejectedValue(
        new Error("Network error"),
      );
      render(<LatestList />);
      await waitFor(() => {
        expect(screen.getByText(/unable to load shoots/i)).toBeInTheDocument();
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: /try again/i }),
        ).toBeInTheDocument();
      });
    });

    it("handles retry button click", async () => {
      const { getLatestShootsListData } =
        await import("./@utils/getLatestShootsListData");
      vi.mocked(getLatestShootsListData).mockRejectedValue(
        new Error("Network error"),
      );
      const mockReload = vi.fn();
      Object.defineProperty(window, "location", {
        value: { reload: mockReload },
        writable: true,
      });
      render(<LatestList />);
      await waitFor(() => {
        const retryButton = screen.getByRole("button", { name: /try again/i });
        retryButton.click();
      });
      expect(mockReload).toHaveBeenCalled();
    });

    it("handles undefined error gracefully", async () => {
      const { getLatestShootsListData } =
        await import("./@utils/getLatestShootsListData");
      vi.mocked(getLatestShootsListData).mockRejectedValue(undefined);
      render(<LatestList />);
      await waitFor(() => {
        expect(screen.getByText(/unable to load shoots/i)).toBeInTheDocument();
        expect(
          screen.getByText(/an unexpected error occurred/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles shoots with missing optional fields", async () => {
      const { getLatestShootsListData } =
        await import("./@utils/getLatestShootsListData");
      const incompleteShoot = {
        ...mockApiResponse[0],
        shoot_style_tags: [],
        first_image: "",
      };
      vi.mocked(getLatestShootsListData).mockResolvedValue([
        incompleteShoot,
        mockApiResponse[1],
      ]);
      render(<LatestList />);
      await waitFor(() => {
        const cards = screen.getAllByTestId("shoot-card");
        expect(cards.length).toBe(1);
      });
    });
  });

  describe("Component Lifecycle", () => {
    it("cleans up properly on unmount", async () => {
      const { unmount } = render(<LatestList />);
      unmount();
    });
  });

  describe("Accessibility", () => {
    it("has proper heading hierarchy", async () => {
      render(<LatestList />);
      const heading = screen.getByRole("heading", { name: /latest shoots/i });
      expect(heading.tagName).toBe("H2");
    });

    it("has proper alt text for images", async () => {
      render(<LatestList />);
      await waitFor(() => {
        const images = screen.getAllByRole("img");
        images.forEach((img) => {
          expect(img).toHaveAttribute("alt");
        });
      });
    });
  });

  describe("Performance", () => {
    it("does not re-fetch data on re-render", async () => {
      const { getLatestShootsListData } =
        await import("./@utils/getLatestShootsListData");
      const { rerender } = render(<LatestList />);
      await waitFor(() => {
        expect(getLatestShootsListData).toHaveBeenCalledTimes(1);
      });
      rerender(<LatestList />);
      await waitFor(() => {
        expect(getLatestShootsListData).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Data Validation", () => {
    it("handles malformed date strings", async () => {
      const { getLatestShootsListData } =
        await import("./@utils/getLatestShootsListData");
      const malformedData = [
        {
          ...mockApiResponse[0],
          publication_date: "invalid-date",
        },
      ];
      vi.mocked(getLatestShootsListData).mockResolvedValue(malformedData);
      render(<LatestList />);
      await waitFor(() => {
        expect(screen.queryByTestId("shoot-card")).not.toBeInTheDocument();
      });
    });
  });

  describe("Memory Management", () => {
    it("does not cause memory leaks on rapid re-renders", async () => {
      const { rerender, unmount } = render(<LatestList />);
      for (let i = 0; i < 10; i++) {
        rerender(<LatestList />);
      }
      unmount();
    });
  });

  describe("State Management", () => {
    it("maintains state consistency during rapid interactions", async () => {
      const { rerender } = render(<LatestList />);
      await waitFor(() => {
        expect(screen.getAllByTestId("shoot-card")).toHaveLength(2);
      });
      for (let i = 0; i < 5; i++) {
        rerender(<LatestList />);
      }
      await waitFor(() => {
        expect(screen.getAllByTestId("shoot-card")).toHaveLength(2);
      });
    });
  });
});
