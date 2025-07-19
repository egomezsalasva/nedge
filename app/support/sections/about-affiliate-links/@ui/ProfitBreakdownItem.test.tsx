import { render, screen } from "@testing-library/react";
import ProfitBreakdownItem from "./ProfitBreakdownItem";

const testData = [
  {
    title: "Title 1",
    percentage: "33%",
    backgroundImgUrl: "./img-url-placeholder-1.png",
  },
  {
    title: "Title 2",
    percentage: "33%",
    backgroundImgUrl: "./img-url-placeholder-2.png",
  },
  {
    title: "Title 3",
    percentage: "33%",
    backgroundImgUrl: "./img-url-placeholder-3.png",
  },
];

describe("Profit Breakdown Item Component", () => {
  beforeEach(() => {
    render(<ProfitBreakdownItem {...testData[0]} />);
  });

  it("should display the title", () => {
    expect(screen.getByText(testData[0].title)).toBeInTheDocument();
  });

  it("should display the percentage", () => {
    expect(screen.getByText(testData[0].percentage)).toBeInTheDocument();
  });

  it("should display the background image", () => {
    const element = screen.getByTestId("profit-breakdown-item");
    expect(element).toHaveStyle(
      `--before-background-img: url(${testData[0].backgroundImgUrl})`,
    );
  });
});
