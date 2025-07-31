import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SlideshowHero from "./SlideshowHero";
import { ShootType } from "@/app/types";

type ImageType = {
  src: string;
  alt: string;
  className: string;
  "data-testid": string;
  [key: string]: string | number | boolean | undefined;
};

vi.mock("./@ui", () => ({
  ImgList: () => <div data-testid="img-list">Image List Component</div>,
}));

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    className,
    "data-testid": testId,
    ...props
  }: ImageType) => (
    <img
      src={src}
      alt={alt}
      className={className}
      data-testid={testId}
      {...props}
    />
  ),
}));

const mockShootData: ShootType = {
  id: 1,
  name: "Test Shoot",
  description: "A test shoot description",
  slug: "test-shoot",
  preview_slug: "test-preview",
  publication_date: "2024-01-15",
  city: {
    name: "Test City",
    country: "Test Country",
  },
  stylist: {
    name: "Test Stylist",
    slug: "test-stylist",
    description: "A test stylist",
    instagram_url: "https://instagram.com/test",
  },
  shoot_style_tags: [
    { name: "Casual", slug: "casual" },
    { name: "Street", slug: "street" },
  ],
  shoot_images: [
    { image_url: "https://example.com/image1.jpg" },
    { image_url: "https://example.com/image2.jpg" },
    { image_url: "https://example.com/image3.jpg" },
  ],
  shoot_garments: [
    {
      id: 1,
      name: "Test Garment",
      type: "shirt",
      brand: {
        name: "Test Brand",
        instagram_url: "https://instagram.com/testbrand",
      },
      affiliate_link: "https://example.com/affiliate",
    },
  ],
};

describe("SlideshowHero Component", () => {
  beforeEach(() => {
    render(<SlideshowHero shootData={mockShootData} />);
  });

  it("renders without crashing", () => {
    expect(screen.getByTestId("slideshow-hero")).toBeInTheDocument();
  });
  it("renders the image and blur image", () => {
    expect(screen.getByTestId("image")).toBeInTheDocument();
    expect(screen.getByTestId("image-blur")).toBeInTheDocument();
  });
  it("renders the shade gradient", () => {
    expect(screen.getByTestId("shade-gradient")).toBeInTheDocument();
  });
  it("renders ImgList component", () => {
    expect(screen.getByTestId("img-list")).toBeInTheDocument();
  });
});
