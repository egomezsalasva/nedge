import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { testShootsData } from "@/app/@testShootsData";
vi.mock("../../../@data", () => ({
  shoots: testShootsData,
}));
import CardWithItems from "./CardWithItems";

describe("CardWithItems Component", () => {
  beforeEach(() => {
    render(
      <CardWithItems
        shoot={testShootsData[1]}
        brand="brand"
        brandItemsType={["item1", "item2"]}
      />,
    );
  });
  it("renders the correct image", () => {
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", testShootsData[1].imgs[0]);
    expect(img).toHaveAttribute("alt", testShootsData[1].details.title);
  });
  it("renders the correct heading (title and stylist)", () => {
    const headingRegex = new RegExp(
      `${testShootsData[1].details.title}\\s*:\\s*${testShootsData[1].details.stylist}`,
      "i",
    );
    expect(screen.getByText(headingRegex)).toBeInTheDocument();
  });
  it("renders the city and date", () => {
    expect(
      screen.getByText(testShootsData[1].details.city),
    ).toBeInTheDocument();
    expect(
      screen.getByText(testShootsData[1].details.date),
    ).toBeInTheDocument();
  });
  it("renders all tags", () => {
    testShootsData[1].details.tags.forEach((tag) => {
      expect(screen.getAllByText(tag).length).toBeGreaterThan(0);
    });
  });
});
