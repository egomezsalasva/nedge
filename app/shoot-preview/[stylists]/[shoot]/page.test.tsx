import { render, screen } from "@testing-library/react";
import Shoot from "./page";
import { ShootGarmentType, ShootType } from "@/app/types";

// Mock the getShootData function
vi.mock("@/app/stylists/[stylists]/[shoot]/(utils)/getShootData", () => ({
  getShootData: vi.fn(),
}));

// Mock the components
vi.mock("@/app/stylists/[stylists]/[shoot]/components", () => ({
  GarmsList: function MockGarmsList({
    garmsData,
  }: {
    garmsData: ShootGarmentType[];
  }) {
    return (
      <div data-testid="garms-list">Garms List ({garmsData.length} items)</div>
    );
  },
  ShootDetails: function MockShootDetails({
    shootData,
  }: {
    shootData: ShootType;
  }) {
    return (
      <div data-testid="shoot-details">Shoot Details: {shootData.name}</div>
    );
  },
  SlideshowHero: function MockSlideshowHero({
    shootData,
  }: {
    shootData: ShootType;
  }) {
    return (
      <div data-testid="slideshow-hero">Slideshow Hero: {shootData.name}</div>
    );
  },
}));

// Mock Next.js notFound
vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

const mockShootData = {
  name: "Summer Collection 2024",
  preview_slug: "summer-preview",
  shoot_garments: [{ id: 1 }, { id: 2 }],
};

describe("Shoot", () => {
  it("renders shoot preview page with correct content", async () => {
    const mockGetShootData = vi.mocked(
      await import("@/app/stylists/[stylists]/[shoot]/(utils)/getShootData"),
    ).getShootData;
    mockGetShootData.mockResolvedValue(mockShootData as ShootType);
    const params = Promise.resolve({
      stylists: "jane-doe",
      shoot: "summer-collection",
    });
    render(await Shoot({ params }));
    expect(screen.getByTestId("slideshow-hero")).toBeInTheDocument();
    expect(screen.getByTestId("garms-list")).toBeInTheDocument();
    expect(screen.getByTestId("shoot-details")).toBeInTheDocument();
    expect(screen.getByText("Garms List (2 items)")).toBeInTheDocument();
    expect(
      screen.getByText("Shoot Details: Summer Collection 2024"),
    ).toBeInTheDocument();
  });

  it("handles notFound when shoot data is null", async () => {
    const mockGetShootData = vi.mocked(
      await import("@/app/stylists/[stylists]/[shoot]/(utils)/getShootData"),
    ).getShootData;
    mockGetShootData.mockResolvedValue(null);
    const params = Promise.resolve({
      stylists: "jane-doe",
      shoot: "non-existent-shoot",
    });
    const { notFound } = await import("next/navigation");
    await expect(Shoot({ params })).rejects.toThrow();
    expect(notFound).toHaveBeenCalled();
  });

  it("handles notFound when preview_slug is missing", async () => {
    const mockGetShootData = vi.mocked(
      await import("@/app/stylists/[stylists]/[shoot]/(utils)/getShootData"),
    ).getShootData;
    mockGetShootData.mockResolvedValue({
      ...mockShootData,
      preview_slug: undefined,
    } as unknown as ShootType);
    const params = Promise.resolve({
      stylists: "jane-doe",
      shoot: "summer-collection",
    });
    const { notFound } = await import("next/navigation");
    await Shoot({ params });
    expect(notFound).toHaveBeenCalled();
  });

  it("handles notFound when preview_slug is empty string", async () => {
    const mockGetShootData = vi.mocked(
      await import("@/app/stylists/[stylists]/[shoot]/(utils)/getShootData"),
    ).getShootData;
    mockGetShootData.mockResolvedValue({
      ...mockShootData,
      preview_slug: "",
    } as unknown as ShootType);
    const params = Promise.resolve({
      stylists: "jane-doe",
      shoot: "summer-collection",
    });
    const { notFound } = await import("next/navigation");
    await Shoot({ params });
    expect(notFound).toHaveBeenCalled();
  });

  it("handles empty garments array", async () => {
    const mockGetShootData = vi.mocked(
      await import("@/app/stylists/[stylists]/[shoot]/(utils)/getShootData"),
    ).getShootData;
    mockGetShootData.mockResolvedValue({
      ...mockShootData,
      shoot_garments: [],
    } as unknown as ShootType);
    const params = Promise.resolve({
      stylists: "jane-doe",
      shoot: "summer-collection",
    });
    render(await Shoot({ params }));
    expect(screen.getByTestId("slideshow-hero")).toBeInTheDocument();
    expect(screen.getByTestId("garms-list")).toBeInTheDocument();
    expect(screen.getByTestId("shoot-details")).toBeInTheDocument();
    expect(screen.getByText("Garms List (0 items)")).toBeInTheDocument();
  });

  it("handles getShootData errors gracefully", async () => {
    const mockGetShootData = vi.mocked(
      await import("@/app/stylists/[stylists]/[shoot]/(utils)/getShootData"),
    ).getShootData;
    mockGetShootData.mockRejectedValue(new Error("Database error"));
    const params = Promise.resolve({
      stylists: "jane-doe",
      shoot: "summer-collection",
    });
    await expect(Shoot({ params })).rejects.toThrow("Database error");
  });

  it("handles different parameter combinations", async () => {
    const mockGetShootData = vi.mocked(
      await import("@/app/stylists/[stylists]/[shoot]/(utils)/getShootData"),
    ).getShootData;
    mockGetShootData.mockResolvedValue(mockShootData as ShootType);
    const params = Promise.resolve({
      stylists: "john-smith",
      shoot: "winter-collection-2024",
    });
    render(await Shoot({ params }));
    expect(screen.getByTestId("slideshow-hero")).toBeInTheDocument();
    expect(screen.getByTestId("garms-list")).toBeInTheDocument();
    expect(screen.getByTestId("shoot-details")).toBeInTheDocument();
    expect(mockGetShootData).toHaveBeenCalledWith(
      "john-smith",
      "winter-collection-2024",
    );
  });
});
