import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CardWithItems, { CardWithItemsType } from "./CardWithItems";

const mockShoot: CardWithItemsType = {
  id: "1",
  name: "Shoot Title",
  publication_date: "2023-01-01",
  city: { name: "London" },
  stylist: { name: "Jane Stylist", slug: "jane-stylist" },
  shoot_style_tags: [
    { name: "Street", slug: "street" },
    { name: "Casual", slug: "casual" },
  ],
  first_image: "https://example.com/image.jpg",
  slug: "shoot-title",
  brandItemTypes: ["Jacket", "Pants"],
};

describe("CardWithItems Component", () => {
  beforeEach(() => {
    render(<CardWithItems shoot={mockShoot} brand="TestBrand" />);
  });

  it("renders the correct image", () => {
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", mockShoot.first_image);
    expect(img).toHaveAttribute("alt", mockShoot.name);
  });

  it("renders the correct heading (title and stylist)", () => {
    const headingRegex = new RegExp(
      `${mockShoot.name}:\\s*${mockShoot.stylist.name}`,
      "i",
    );
    expect(screen.getByText(headingRegex)).toBeInTheDocument();
  });

  it("renders the city and date", () => {
    expect(screen.getByText(mockShoot.city.name)).toBeInTheDocument();
    expect(screen.getByText(mockShoot.publication_date)).toBeInTheDocument();
  });

  it("renders all tags", () => {
    mockShoot.shoot_style_tags.forEach((tag) => {
      expect(screen.getAllByText(tag.name).length).toBeGreaterThan(0);
    });
  });

  it("renders brand and item types", () => {
    expect(screen.getByText("TestBrand:")).toBeInTheDocument();
    mockShoot.brandItemTypes.forEach((itemType) => {
      expect(screen.getByText(itemType)).toBeInTheDocument();
    });
    expect(
      screen.getByText(mockShoot.brandItemTypes.length.toString()),
    ).toBeInTheDocument();
  });

  it("renders the brand name", () => {
    expect(screen.getByText("TestBrand:")).toBeInTheDocument();
  });

  it("links the image and heading to the correct shoot URL", () => {
    const shootLinks = screen
      .getAllByRole("link")
      .filter(
        (link) =>
          link.getAttribute("href") === "/stylists/jane-stylist/shoot-title",
      );
    expect(shootLinks).toHaveLength(2);
    expect(shootLinks.some((link) => link.querySelector("img"))).toBe(true);
    expect(shootLinks.some((link) => link.querySelector("h3"))).toBe(true);
  });

  it("renders all style tags as links with correct hrefs", () => {
    mockShoot.shoot_style_tags.forEach((tag) => {
      const tagLink = screen.getByText(tag.name).closest("a");
      expect(tagLink).toHaveAttribute("href", `/explore?substyle=${tag.slug}`);
    });
  });

  it("renders commas between brand item types except after the last", () => {
    const brandItems = screen.getByText("Jacket").parentElement;
    expect(brandItems?.textContent).toContain("Jacket,");
    expect(brandItems?.textContent).toContain("Pants");
    expect(brandItems?.textContent?.trim().endsWith(",")).toBe(false);
  });

  it("renders the correct count of brand item types", () => {
    expect(
      screen.getByText(mockShoot.brandItemTypes.length.toString()),
    ).toBeInTheDocument();
  });

  it("renders correctly with no brand item types", () => {
    render(
      <CardWithItems
        shoot={{ ...mockShoot, brandItemTypes: [] }}
        brand="TestBrand"
      />,
    );
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
