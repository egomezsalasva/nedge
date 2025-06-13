import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import Details from "./Details";
import { ShootType } from "@/app/@types";

const testShootData: ShootType = {
  name: "Test Shoot Title",
  slug: "test-shoot-title",
  publication_date: "2025-05-19T00:00:00.000Z",
  description: "This is a test shoot description for testing purposes.",
  city: {
    name: "Test City",
    country: "Test Country",
  },
  stylist: {
    name: "Test Stylist",
    slug: "test-stylist",
    description: "Test Stylist Description",
    instagram_url: "",
  },
  shoot_style_tags: [
    { name: "Urban", slug: "urban" },
    { name: "Modern", slug: "modern" },
    { name: "Casual", slug: "casual" },
  ],
  shoot_images: [
    { image_url: "/test-img-1.png" },
    { image_url: "/test-img-2.png" },
    { image_url: "/test-img-3.png" },
  ],
};

describe("Latest Shoot Details Component", () => {
  beforeEach(() => {
    render(
      <Details
        shootData={testShootData}
        activeImgIndex={0}
        setActiveImgIndex={() => {}}
      />,
    );
  });

  it("renders without crashing", () => {
    expect(screen.getByTestId("details")).toBeInTheDocument();
  });

  it("should display the formatted shoot date", () => {
    expect(screen.getByText("19/05/2025")).toBeInTheDocument();
  });

  it("should display the shoot city", () => {
    expect(screen.getByText("Test City")).toBeInTheDocument();
  });

  it("should display the shoot title", () => {
    expect(
      screen.getByText((content) => content.includes(testShootData.name)),
    ).toBeInTheDocument();
  });

  it("should display the shoot stylist", () => {
    expect(
      screen.getByText((content) =>
        content.includes(testShootData.stylist.name),
      ),
    ).toBeInTheDocument();
  });

  it("should display all shoot tags", () => {
    expect(screen.getByText("Urban")).toBeInTheDocument();
    expect(screen.getByText("Modern")).toBeInTheDocument();
    expect(screen.getByText("Casual")).toBeInTheDocument();
  });

  it("should display the shoot description", () => {
    expect(
      screen.getByText(
        "This is a test shoot description for testing purposes.",
      ),
    ).toBeInTheDocument();
  });

  it("should render the SlideshowIndicators component and match the number of images", () => {
    const indicators = screen.getAllByTestId("indicator");
    expect(indicators).toHaveLength(3);
    expect(screen.getByTestId("previous-button")).toBeInTheDocument();
    expect(screen.getByTestId("next-button")).toBeInTheDocument();
  });
});
