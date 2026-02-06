import { render, screen } from "@testing-library/react";
import Shoot from "./page";
import { notFound } from "next/navigation";

type GarmsDataType = {
  id: number;
  name: string;
  type: string;
  brand: { name: string; instagram_url: string };
  affiliate_link: string;
};

type ShootDataType = {
  id: number;
  name: string;
  description: string;
  slug: string;
  preview_slug: string;
  publication_date: string;
};

vi.mock("./components", () => ({
  GarmsList: ({ garmsData }: { garmsData: GarmsDataType[] }) => (
    <div data-testid="garms-list">GarmsList ({garmsData.length} items)</div>
  ),
  ShootDetails: ({ shootData }: { shootData: ShootDataType }) => (
    <div data-testid="shoot-details">ShootDetails: {shootData.name}</div>
  ),
  SlideshowHero: ({ shootData }: { shootData: ShootDataType }) => (
    <div data-testid="slideshow-hero">SlideshowHero: {shootData.name}</div>
  ),
}));

vi.mock("./(utils)/getShootData", () => ({
  getShootData: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

describe("Shoot Page Component", () => {
  const mockShootData = {
    id: 1,
    name: "Test Shoot",
    description: "Test description",
    slug: "test-shoot",
    preview_slug: "",
    publication_date: "2024-01-01",
    city: { name: "Test City", country: "Test Country" },
    stylist: {
      name: "Test Stylist",
      slug: "test-stylist",
      description: "Test stylist description",
      instagram_url: "https://instagram.com/test",
    },
    shoot_style_tags: [{ name: "Casual", slug: "casual" }],
    shoot_images: [{ image_url: "test-image.jpg" }],
    shoot_garments: [
      {
        id: 1,
        name: "Test Garment",
        type: "Shirt",
        brand: {
          name: "Test Brand",
          instagram_url: "https://instagram.com/brand",
        },
        affiliate_link: "https://test.com",
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setupShootComponent = async (
    shootData = mockShootData,
    params = { stylists: "test-stylist", shoot: "test-shoot" },
  ) => {
    const { getShootData } = await import("./(utils)/getShootData");
    vi.mocked(getShootData).mockResolvedValue(shootData);

    const paramsPromise = Promise.resolve(params);
    return render(await Shoot({ params: paramsPromise }));
  };

  it("renders main element for valid params", async () => {
    await setupShootComponent();
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("calls notFound for invalid params", async () => {
    vi.mocked(notFound).mockImplementation(() => {
      throw new Error("NEXT_NOT_FOUND");
    });

    const { getShootData } = await import("./(utils)/getShootData");
    vi.mocked(getShootData).mockResolvedValue(null);

    const params = Promise.resolve({
      stylists: "non-existent-stylist",
      shoot: "non-existent-shoot",
    });

    await expect(Shoot({ params })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });

  it("matches shoot regardless of case and dashes", async () => {
    await setupShootComponent(mockShootData, {
      stylists: "STYLIST-1",
      shoot: "SHOOT-1",
    });
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders GarmsList component with garments data", async () => {
    await setupShootComponent();
    expect(screen.getByTestId("garms-list")).toBeInTheDocument();
    expect(screen.getByText("GarmsList (1 items)")).toBeInTheDocument();
  });

  it("renders ShootDetails component with shoot data", async () => {
    await setupShootComponent();
    expect(screen.getByTestId("shoot-details")).toBeInTheDocument();
    expect(screen.getByText("ShootDetails: Test Shoot")).toBeInTheDocument();
  });
});
