import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BrandPage from "./page";

vi.mock("./@utils/getShootsFromBrandData", () => ({
  getShootsFromBrandData: vi.fn().mockResolvedValue({
    brandData: { id: 1, name: "Test Brand", instagram_url: null },
    garmentsData: [{ id: 1 }],
    transformedShoots: [{ id: 1, name: "Test Shoot" }],
  }),
}));

vi.mock("next/link", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock("next/navigation", () => ({ notFound: vi.fn() }));
vi.mock("@/app/svgs", () => ({ Insta: () => <span>Instagram</span> }));
vi.mock("@/app/ui/card-with-items/CardWithItems", () => ({
  default: () => <div>Card</div>,
}));
vi.mock("@/app/ui/card-with-items/CardWithItems", () => ({
  default: ({ shoot, brand }: { shoot: { name: string }; brand: string }) => (
    <div data-testid="shoot-card">
      <h3>{shoot.name}</h3>
      <p>Brand: {brand}</p>
    </div>
  ),
}));

describe("BrandPage", () => {
  it("renders without crashing", async () => {
    const params = Promise.resolve({ brand: "test" });
    expect(() => render(<BrandPage params={params} />)).not.toThrow();
  });

  it("renders brand name", async () => {
    const params = Promise.resolve({ brand: "test" });
    const component = await BrandPage({ params });
    const { container } = render(component);
    console.log("Container HTML:", container.innerHTML);
    console.log("Text content:", container.textContent);
    await vi.waitFor(() => {
      expect(container.textContent).toContain("Test Brand");
    });
  });

  it("calls notFound when no shoots exist", async () => {
    const { getShootsFromBrandData } =
      await import("./@utils/getShootsFromBrandData");
    vi.mocked(getShootsFromBrandData).mockResolvedValue({
      brandData: { id: 1, name: "Test Brand", instagram_url: null },
      garmentsData: [],
      transformedShoots: [],
    });
    const params = Promise.resolve({ brand: "test" });
    const { notFound } = await import("next/navigation");
    vi.mocked(notFound).mockImplementation(() => {
      throw new Error("NOT_FOUND");
    });
    await expect(BrandPage({ params })).rejects.toThrow("NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });

  it("displays Instagram icon when brand has Instagram URL", async () => {
    const { getShootsFromBrandData } =
      await import("./@utils/getShootsFromBrandData");
    vi.mocked(getShootsFromBrandData).mockResolvedValue({
      brandData: {
        id: 1,
        name: "Test Brand",
        instagram_url: "https://instagram.com/testbrand",
      },
      garmentsData: [{ id: 1 }],
      transformedShoots: [
        {
          id: 1,
          name: "Test Shoot",
          slug: "test-shoot",
          publication_date: "2024-01-01",
          preview_slug: null,
          stylist: { name: "Test Stylist", slug: "test-stylist" },
          city: { name: "Test City" },
          shoot_style_tags: [{ name: "Casual", slug: "casual" }],
          first_image: "test-image.jpg",
          brandItemTypes: ["Shirt"],
        },
      ],
    });
    const params = Promise.resolve({ brand: "test" });
    const component = await BrandPage({ params });
    const { container } = render(component);
    await vi.waitFor(() => {
      expect(container.textContent).toContain("Instagram");
    });
  });

  it("renders correct number of shoot cards", async () => {
    const { getShootsFromBrandData } =
      await import("./@utils/getShootsFromBrandData");
    vi.mocked(getShootsFromBrandData).mockResolvedValue({
      brandData: { id: 1, name: "Test Brand", instagram_url: null },
      garmentsData: [{ id: 1 }],
      transformedShoots: [
        {
          id: 1,
          name: "Test Shoot 1",
          slug: "test-shoot-1",
          publication_date: "2024-01-01",
          preview_slug: null,
          stylist: { name: "Test Stylist", slug: "test-stylist" },
          city: { name: "Test City" },
          shoot_style_tags: [{ name: "Casual", slug: "casual" }],
          first_image: "test-image.jpg",
          brandItemTypes: ["Shirt"],
        },
        {
          id: 2,
          name: "Test Shoot 2",
          slug: "test-shoot-2",
          publication_date: "2024-01-02",
          preview_slug: null,
          stylist: { name: "Test Stylist", slug: "test-stylist" },
          city: { name: "Test City" },
          shoot_style_tags: [{ name: "Casual", slug: "casual" }],
          first_image: "test-image2.jpg",
          brandItemTypes: ["Pants"],
        },
      ],
    });
    const params = Promise.resolve({ brand: "test" });
    const component = await BrandPage({ params });
    const { container } = render(component);
    await vi.waitFor(() => {
      expect(container.textContent).toContain("Test Shoot 1");
      expect(container.textContent).toContain("Test Shoot 2");
    });
  });

  it("handles null brand data gracefully", async () => {
    const { getShootsFromBrandData } =
      await import("./@utils/getShootsFromBrandData");
    vi.mocked(getShootsFromBrandData).mockResolvedValue({
      brandData: null,
      garmentsData: [],
      transformedShoots: [],
    });
    const params = Promise.resolve({ brand: "test" });
    const { notFound } = await import("next/navigation");
    vi.mocked(notFound).mockImplementation(() => {
      throw new Error("NOT_FOUND");
    });
    await expect(BrandPage({ params })).rejects.toThrow("NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });

  it("handles null garments data gracefully", async () => {
    const { getShootsFromBrandData } =
      await import("./@utils/getShootsFromBrandData");
    vi.mocked(getShootsFromBrandData).mockResolvedValue({
      brandData: { id: 1, name: "Test Brand", instagram_url: null },
      garmentsData: null,
      transformedShoots: [
        {
          id: 1,
          name: "Test Shoot",
          slug: "test-shoot",
          publication_date: "2024-01-01",
          preview_slug: null,
          stylist: { name: "Test Stylist", slug: "test-stylist" },
          city: { name: "Test City" },
          shoot_style_tags: [{ name: "Casual", slug: "casual" }],
          first_image: "test-image.jpg",
          brandItemTypes: ["Shirt"],
        },
      ],
    });
    const params = Promise.resolve({ brand: "test" });
    const component = await BrandPage({ params });
    const { container } = render(component);
    await vi.waitFor(() => {
      expect(container.textContent).toContain("Test Brand");
      // Check for undefined/null handling - might show empty string or default value
      expect(container.textContent).toContain("items");
    });
  });

  it("handles null transformedShoots data gracefully", async () => {
    const { getShootsFromBrandData } =
      await import("./@utils/getShootsFromBrandData");
    vi.mocked(getShootsFromBrandData).mockResolvedValue({
      brandData: { id: 1, name: "Test Brand", instagram_url: null },
      garmentsData: [{ id: 1 }],
      transformedShoots: null as unknown as [],
    });
    const params = Promise.resolve({ brand: "test" });
    const { notFound } = await import("next/navigation");
    vi.mocked(notFound).mockImplementation(() => {
      throw new Error("NOT_FOUND");
    });
    await expect(BrandPage({ params })).rejects.toThrow("NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });

  it("handles empty garments array", async () => {
    const { getShootsFromBrandData } =
      await import("./@utils/getShootsFromBrandData");
    vi.mocked(getShootsFromBrandData).mockResolvedValue({
      brandData: { id: 1, name: "Test Brand", instagram_url: null },
      garmentsData: [],
      transformedShoots: [
        {
          id: 1,
          name: "Test Shoot",
          slug: "test-shoot",
          publication_date: "2024-01-01",
          preview_slug: null,
          stylist: { name: "Test Stylist", slug: "test-stylist" },
          city: { name: "Test City" },
          shoot_style_tags: [{ name: "Casual", slug: "casual" }],
          first_image: "test-image.jpg",
          brandItemTypes: ["Shirt"],
        },
      ],
    });
    const params = Promise.resolve({ brand: "test" });
    const component = await BrandPage({ params });
    const { container } = render(component);
    await vi.waitFor(() => {
      expect(container.textContent).toContain("0");
      expect(container.textContent).toContain("items");
    });
  });

  it("handles single item and shoot correctly", async () => {
    const { getShootsFromBrandData } =
      await import("./@utils/getShootsFromBrandData");
    vi.mocked(getShootsFromBrandData).mockResolvedValue({
      brandData: { id: 1, name: "Test Brand", instagram_url: null },
      garmentsData: [{ id: 1 }],
      transformedShoots: [
        {
          id: 1,
          name: "Test Shoot",
          slug: "test-shoot",
          publication_date: "2024-01-01",
          preview_slug: null,
          stylist: { name: "Test Stylist", slug: "test-stylist" },
          city: { name: "Test City" },
          shoot_style_tags: [{ name: "Casual", slug: "casual" }],
          first_image: "test-image.jpg",
          brandItemTypes: ["Shirt"],
        },
      ],
    });
    const params = Promise.resolve({ brand: "test" });
    const component = await BrandPage({ params });
    const { container } = render(component);
    await vi.waitFor(() => {
      expect(container.textContent).toContain("1");
      expect(container.textContent).toContain("item");
      expect(container.textContent).toContain("1");
      expect(container.textContent).toContain("shoot");
    });
  });
});
