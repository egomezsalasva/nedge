import { render, screen } from "@testing-library/react";
import Card, { CardType } from "./Card";
import { formatDate } from "@/app/utils";

const mockShoot: CardType = {
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
};

describe("Card Component", () => {
  beforeEach(() => {
    render(<Card shoot={mockShoot} />);
  });
  it("renders the correct image", () => {
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", mockShoot.first_image);
    expect(img).toHaveAttribute("alt", mockShoot.name);
  });
  it("renders the correct heading (title and stylist)", () => {
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent(mockShoot.name);
    expect(heading).toHaveTextContent(mockShoot.stylist.name);
    expect(heading).toHaveTextContent(":");
  });
  it("renders the city and formatted date", () => {
    const formattedDate = formatDate(mockShoot.publication_date);
    expect(screen.getByText(mockShoot.city.name)).toBeInTheDocument();
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });
  it("renders all tags and their slugs", () => {
    mockShoot.shoot_style_tags.forEach((tag) => {
      expect(screen.getByText(tag.name)).toBeInTheDocument();
    });
  });
});
