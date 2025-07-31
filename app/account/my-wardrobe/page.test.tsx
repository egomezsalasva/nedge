import { render, screen, waitFor } from "@testing-library/react";
import AccountMyWardrobe from "./page";

vi.mock("./@ui/RemoveGarmentButton", () => ({
  default: () => <button>Remove</button>,
}));

vi.mock("next/link", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

global.fetch = vi.fn();

describe("AccountMyWardrobe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders wardrobe items when data is loaded", async () => {
    const mockWardrobe = [
      {
        garment_id: 1,
        garments: {
          brands: { name: "Nike" },
          garment_type: { name: "Sneaker" },
          name: "Air Max 90",
        },
        source_pathname: "/stylists/john/shoot1",
      },
    ];
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ wardrobe: mockWardrobe }),
    } as Response);
    render(<AccountMyWardrobe />);
    await waitFor(() => {
      expect(screen.getByText("Sneakers")).toBeInTheDocument();
      expect(screen.getByText("Air Max 90")).toBeInTheDocument();
      expect(screen.getByText("Nike")).toBeInTheDocument();
    });
  });

  it("shows empty state when no items", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ wardrobe: [] }),
    } as Response);
    render(<AccountMyWardrobe />);
    await waitFor(() => {
      expect(screen.getByText("No wardrobe items yet")).toBeInTheDocument();
    });
  });

  it("shows loading state initially", () => {
    vi.mocked(fetch).mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<AccountMyWardrobe />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("handles API error gracefully", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);
    render(<AccountMyWardrobe />);
    await waitFor(() => {
      expect(screen.getByText("No wardrobe items yet")).toBeInTheDocument();
    });
  });

  it("groups items by garment type correctly", async () => {
    const mockWardrobe = [
      {
        garment_id: 1,
        garments: {
          brands: { name: "Nike" },
          garment_type: { name: "Sneaker" },
          name: "Air Max",
        },
        source_pathname: "/shoot1",
      },
      {
        garment_id: 2,
        garments: {
          brands: { name: "Levi's" },
          garment_type: { name: "Jean" },
          name: "501",
        },
        source_pathname: "/shoot2",
      },
    ];
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ wardrobe: mockWardrobe }),
    } as Response);
    render(<AccountMyWardrobe />);
    await waitFor(() => {
      expect(screen.getByText("Sneakers")).toBeInTheDocument();
      expect(screen.getByText("Jeans")).toBeInTheDocument();
    });
  });

  it("removes duplicate items with same name and brand", async () => {
    const mockWardrobe = [
      {
        garment_id: 1,
        garments: {
          brands: { name: "Nike" },
          garment_type: { name: "Sneaker" },
          name: "Air Max",
        },
        source_pathname: "/shoot1",
      },
      {
        garment_id: 2,
        garments: {
          brands: { name: "Nike" },
          garment_type: { name: "Sneaker" },
          name: "Air Max",
        },
        source_pathname: "/shoot2",
      },
    ];
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ wardrobe: mockWardrobe }),
    } as Response);
    render(<AccountMyWardrobe />);
    await waitFor(() => {
      const airMaxElements = screen.getAllByText("Air Max");
      expect(airMaxElements).toHaveLength(1);
    });
  });

  it("handles items with missing garment type", async () => {
    const mockWardrobe = [
      {
        garment_id: 1,
        garments: {
          brands: { name: "Unknown Brand" },
          garment_type: { name: "" },
          name: "Mystery Item",
        },
        source_pathname: "/shoot1",
      },
    ];
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ wardrobe: mockWardrobe }),
    } as Response);
    render(<AccountMyWardrobe />);
    await waitFor(() => {
      expect(screen.getByText("Others")).toBeInTheDocument();
      expect(screen.getByText("Mystery Item")).toBeInTheDocument();
    });
  });

  it("tests addS function with words ending in 's'", async () => {
    const mockWardrobe = [
      {
        garment_id: 1,
        garments: {
          brands: { name: "Ray-Ban" },
          garment_type: { name: "Sunglasses" },
          name: "Aviator",
        },
        source_pathname: "/shoot1",
      },
    ];
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ wardrobe: mockWardrobe }),
    } as Response);
    render(<AccountMyWardrobe />);
    await waitFor(() => {
      expect(screen.getByText("Sunglasses")).toBeInTheDocument();
      expect(screen.getByText("Aviator")).toBeInTheDocument();
    });
  });

  it("handles network fetch error", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("Network error"));
    render(<AccountMyWardrobe />);
    await waitFor(() => {
      expect(screen.getByText("No wardrobe items yet")).toBeInTheDocument();
    });
  });

  it("handles response with null wardrobe data", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ wardrobe: null }),
    } as Response);
    render(<AccountMyWardrobe />);
    await waitFor(() => {
      expect(screen.getByText("No wardrobe items yet")).toBeInTheDocument();
    });
  });

  it("handles JSON parsing error", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.reject(new Error("Invalid JSON")),
    } as Response);
    render(<AccountMyWardrobe />);
    await waitFor(() => {
      expect(screen.getByText("No wardrobe items yet")).toBeInTheDocument();
    });
  });

  it("renders multiple items in same type group", async () => {
    const mockWardrobe = [
      {
        garment_id: 1,
        garments: {
          brands: { name: "Nike" },
          garment_type: { name: "Sneaker" },
          name: "Air Max",
        },
        source_pathname: "/shoot1",
      },
      {
        garment_id: 2,
        garments: {
          brands: { name: "Adidas" },
          garment_type: { name: "Sneaker" },
          name: "Stan Smith",
        },
        source_pathname: "/shoot2",
      },
    ];
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ wardrobe: mockWardrobe }),
    } as Response);
    render(<AccountMyWardrobe />);
    await waitFor(() => {
      expect(screen.getByText("Sneakers")).toBeInTheDocument();
      expect(screen.getByText("Air Max")).toBeInTheDocument();
      expect(screen.getByText("Nike")).toBeInTheDocument();
      expect(screen.getByText("Stan Smith")).toBeInTheDocument();
      expect(screen.getByText("Adidas")).toBeInTheDocument();
    });
  });

  it("handles items with empty garment properties", async () => {
    const mockWardrobe = [
      {
        garment_id: 1,
        garments: {
          brands: { name: "" }, // Empty name instead of null
          garment_type: { name: "" }, // Empty name instead of null
          name: "Mystery Garment",
        },
        source_pathname: "/shoot1",
      },
    ];
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ wardrobe: mockWardrobe }),
    } as Response);
    render(<AccountMyWardrobe />);
    await waitFor(() => {
      expect(screen.getByText("Others")).toBeInTheDocument();
      expect(screen.getByText("Mystery Garment")).toBeInTheDocument();
    });
  });

  it("renders remove buttons for each garment item", async () => {
    const mockWardrobe = [
      {
        garment_id: 1,
        garments: {
          brands: { name: "Nike" },
          garment_type: { name: "Sneaker" },
          name: "Air Max",
        },
        source_pathname: "/shoot1",
      },
      {
        garment_id: 2,
        garments: {
          brands: { name: "Adidas" },
          garment_type: { name: "Sneaker" },
          name: "Stan Smith",
        },
        source_pathname: "/shoot2",
      },
    ];
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ wardrobe: mockWardrobe }),
    } as Response);
    render(<AccountMyWardrobe />);
    await waitFor(() => {
      const removeButtons = screen.getAllByText("Remove");
      expect(removeButtons).toHaveLength(2);
    });
  });

  it("handles response with undefined wardrobe data", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ wardrobe: undefined }),
    } as Response);
    render(<AccountMyWardrobe />);
    await waitFor(() => {
      expect(screen.getByText("No wardrobe items yet")).toBeInTheDocument();
    });
  });

  it("handles very long garment names and brands", async () => {
    const mockWardrobe = [
      {
        garment_id: 1,
        garments: {
          brands: {
            name: "Very Long Brand Name That Might Cause UI Issues With Text Wrapping And Layout Problems",
          },
          garment_type: { name: "Sneaker" },
          name: "Super Ultra Mega Long Garment Name That Could Potentially Break The User Interface Layout",
        },
        source_pathname: "/shoot1",
      },
    ];
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ wardrobe: mockWardrobe }),
    } as Response);
    render(<AccountMyWardrobe />);
    await waitFor(() => {
      expect(screen.getByText("Sneakers")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Super Ultra Mega Long Garment Name That Could Potentially Break The User Interface Layout",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Very Long Brand Name That Might Cause UI Issues With Text Wrapping And Layout Problems",
        ),
      ).toBeInTheDocument();
    });
  });
});
