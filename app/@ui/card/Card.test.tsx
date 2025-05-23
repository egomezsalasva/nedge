import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { testShoots } from "../../latest/list/@testData";
vi.mock("../../../@data", () => ({
  shoots: testShoots,
}));
import Card from "./Card";

describe("Card Component", () => {
  beforeEach(() => {
    render(<Card shoot={testShoots[1]} />);
  });
  it("renders the correct image", () => {
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", testShoots[1].imgs[0]);
    expect(img).toHaveAttribute("alt", testShoots[1].details.title);
  });
  it("renders the correct heading (title and stylist)", () => {
    const headingRegex = new RegExp(
      `${testShoots[1].details.title}\\s*:\\s*${testShoots[1].details.stylist}`,
      "i",
    );
    expect(screen.getByText(headingRegex)).toBeInTheDocument();
  });
  it("renders the city and date", () => {
    expect(screen.getByText(testShoots[1].details.city)).toBeInTheDocument();
    expect(screen.getByText(testShoots[1].details.date)).toBeInTheDocument();
  });
  it("renders all tags", () => {
    testShoots[1].details.tags.forEach((tag) => {
      expect(screen.getAllByText(tag).length).toBeGreaterThan(0);
    });
  });
});
