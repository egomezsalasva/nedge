import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { testShoots } from "./@testData";
vi.mock("../../@data", () => ({
  shoots: testShoots,
}));
import LatestList from "./LatestList";

describe("Latest List Component", () => {
  beforeEach(() => {
    render(<LatestList />);
  });
  it("renders the heading 'Latest Shoots'", () => {
    expect(
      screen.getByRole("heading", { name: /latest shoots/i }),
    ).toBeInTheDocument();
  });
  it("renders the correct number of Card components", () => {
    const shoots = screen.getAllByTestId("shoot-card");
    expect(shoots.length).toBe(testShoots.length - 1);
    expect(shoots.length).toBe(2);
  });
  it("each Card receives the correct shoot props", () => {
    const expectedShoots = testShoots.slice(1);
    const cards = screen.getAllByTestId("shoot-card");
    expectedShoots.forEach((shoot, idx) => {
      const card = cards[idx];
      const headingRegex = new RegExp(
        `${shoot.details.title}\\s*:\\s*${shoot.details.stylist}`,
        "i",
      );
      expect(card).toHaveTextContent(headingRegex);
      expect(card).toHaveTextContent(shoot.details.city);
      expect(card).toHaveTextContent(shoot.details.date);
      shoot.details.tags.forEach((tag) => {
        expect(card).toHaveTextContent(tag);
      });
      const img = card.querySelector("img");
      expect(img).toBeTruthy();
      expect(img?.getAttribute("src")).toBe(shoot.imgs[0]);
      expect(img?.getAttribute("alt")).toBe(shoot.details.title);
    });
  });
});
