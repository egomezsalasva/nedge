import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { SlideshowIndicators } from "../";
import { testImgs } from "../../@testData";

function SlideshowIndicatorsTestHarness() {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  return (
    <SlideshowIndicators
      imgs={testImgs}
      activeImgIndex={activeImgIndex}
      setActiveImgIndex={setActiveImgIndex}
    />
  );
}

describe("SlideshowIndicators Component", () => {
  beforeEach(() => {
    render(<SlideshowIndicatorsTestHarness />);
  });

  const getActiveIndex = () => {
    const indicators = getAllByTestId("indicator");
    return indicators.findIndex((indicator) =>
      indicator.className.includes("indicator_active"),
    );
  };

  const { getAllByTestId, getByTestId } = screen;

  it("should render 3 indicators", () => {
    const indicators = getAllByTestId("indicator");
    expect(indicators).toHaveLength(3);
  });

  describe("previous handler", () => {
    it("should render previous button", () => {
      const previousButton = getByTestId("previous-button");
      expect(previousButton).toBeInTheDocument();
    });
    it("wraps to the last indicator when prev is clicked at the start, and decrements otherwise", () => {
      expect(getActiveIndex()).toBe(0);
      fireEvent.click(getByTestId("previous-button"));
      expect(getActiveIndex()).toBe(2);
      fireEvent.click(getByTestId("previous-button"));
      expect(getActiveIndex()).toBe(1);
      fireEvent.click(getByTestId("previous-button"));
      expect(getActiveIndex()).toBe(0);
    });
  });
  describe("next handler", () => {
    it("should render next button", () => {
      const nextButton = getByTestId("next-button");
      expect(nextButton).toBeInTheDocument();
    });
    it("wraps to the first indicator when next is clicked at the end, and increments otherwise", () => {
      expect(getActiveIndex()).toBe(0);
      fireEvent.click(getByTestId("next-button"));
      expect(getActiveIndex()).toBe(1);
      fireEvent.click(getByTestId("next-button"));
      expect(getActiveIndex()).toBe(2);
      fireEvent.click(getByTestId("next-button"));
      expect(getActiveIndex()).toBe(0);
    });
  });
});
