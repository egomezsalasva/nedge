import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { testSbShootsData } from "../../@testSbShootsData";
import Card from "./Card";
import { formatDate } from "@/app/@utils";

describe("Card Component", () => {
  const shoot = {
    ...testSbShootsData[1],
    first_image: testSbShootsData[1].shoot_images[0].image_url,
  };
  beforeEach(() => {
    render(<Card shoot={shoot} />);
  });
  it("renders the correct image", () => {
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", shoot.first_image);
    expect(img).toHaveAttribute("alt", shoot.name);
  });
  it("renders the correct heading (title and stylist)", () => {
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent(shoot.name);
    expect(heading).toHaveTextContent(shoot.stylist.name);
    expect(heading).toHaveTextContent(":");
  });
  it("renders the city and formatted date", () => {
    const formattedDate = formatDate(shoot.publication_date);
    expect(screen.getByText("Test City 2")).toBeInTheDocument();
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });
  it("renders all tags", () => {
    shoot.shoot_style_tags.forEach((tag) => {
      expect(screen.getAllByText(tag).length).toBeGreaterThan(0);
    });
  });
});
