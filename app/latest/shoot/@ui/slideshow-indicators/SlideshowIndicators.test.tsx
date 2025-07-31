import { useState } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import SlideshowIndicators from "./SlideshowIndicators";

const testImages = ["/image1.jpg", "/image2.jpg", "/image3.jpg"];

function SlideshowIndicatorsTestHarness() {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  return (
    <SlideshowIndicators
      imgs={testImages}
      activeImgIndex={activeImgIndex}
      setActiveImgIndex={setActiveImgIndex}
    />
  );
}

describe("SlideshowIndicators Component", () => {
  beforeEach(() => {
    render(<SlideshowIndicatorsTestHarness />);
  });

  afterEach(() => {
    cleanup();
  });

  it("should render 3 indicators", () => {
    const indicators = screen.getAllByTestId("indicator");
    expect(indicators).toHaveLength(3);
  });

  it("should render previous button", () => {
    const previousButton = screen.getByTestId("previous-button");
    expect(previousButton).toBeInTheDocument();
  });

  it("should render next button", () => {
    const nextButton = screen.getByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
  });

  const getActiveIndex = () => {
    const indicators = screen.getAllByTestId("indicator");
    return indicators.findIndex((indicator) =>
      indicator.className.includes("indicator_active"),
    );
  };

  it("should show first indicator as active initially", () => {
    expect(getActiveIndex()).toBe(0);
  });

  describe("previous handler", () => {
    it("wraps to the last indicator when prev is clicked at the start, and decrements otherwise", () => {
      expect(getActiveIndex()).toBe(0);
      fireEvent.click(screen.getByTestId("previous-button"));
      expect(getActiveIndex()).toBe(2);
      fireEvent.click(screen.getByTestId("previous-button"));
      expect(getActiveIndex()).toBe(1);
      fireEvent.click(screen.getByTestId("previous-button"));
      expect(getActiveIndex()).toBe(0);
    });
  });

  describe("next handler", () => {
    it("wraps to the first indicator when next is clicked at the end, and increments otherwise", () => {
      expect(getActiveIndex()).toBe(0);
      fireEvent.click(screen.getByTestId("next-button"));
      expect(getActiveIndex()).toBe(1);
      fireEvent.click(screen.getByTestId("next-button"));
      expect(getActiveIndex()).toBe(2);
      fireEvent.click(screen.getByTestId("next-button"));
      expect(getActiveIndex()).toBe(0);
    });
  });

  describe("edge cases", () => {
    it("handles single image correctly", () => {
      cleanup();
      const SingleImageTestHarness = () => {
        const [activeImgIndex, setActiveImgIndex] = useState(0);
        return (
          <SlideshowIndicators
            imgs={["/single-image.jpg"]}
            activeImgIndex={activeImgIndex}
            setActiveImgIndex={setActiveImgIndex}
          />
        );
      };
      render(<SingleImageTestHarness />);
      const indicators = screen.getAllByTestId("indicator");
      expect(indicators).toHaveLength(1);
      expect(getActiveIndex()).toBe(0);
      fireEvent.click(screen.getByTestId("next-button"));
      expect(getActiveIndex()).toBe(0);
      fireEvent.click(screen.getByTestId("previous-button"));
      expect(getActiveIndex()).toBe(0);
    });

    it("handles empty images array", () => {
      cleanup();
      const EmptyImagesTestHarness = () => {
        const [activeImgIndex, setActiveImgIndex] = useState(0);
        return (
          <SlideshowIndicators
            imgs={[]}
            activeImgIndex={activeImgIndex}
            setActiveImgIndex={setActiveImgIndex}
          />
        );
      };
      render(<EmptyImagesTestHarness />);
      const indicators = screen.queryAllByTestId("indicator");
      expect(indicators).toHaveLength(0);
    });
  });

  describe("accessibility", () => {
    it("has proper test IDs for testing", () => {
      expect(screen.getByTestId("previous-button")).toBeInTheDocument();
      expect(screen.getByTestId("next-button")).toBeInTheDocument();
      expect(screen.getAllByTestId("indicator")).toHaveLength(3);
    });

    it("buttons are clickable and have proper event handlers", () => {
      const prevButton = screen.getByTestId("previous-button");
      const nextButton = screen.getByTestId("next-button");
      expect(prevButton).toBeEnabled();
      expect(nextButton).toBeEnabled();
      fireEvent.click(prevButton);
      expect(getActiveIndex()).toBe(2);
      fireEvent.click(nextButton);
      expect(getActiveIndex()).toBe(0);
    });
  });

  describe("performance and stability", () => {
    it("handles rapid button clicks without errors", () => {
      const prevButton = screen.getByTestId("previous-button");
      const nextButton = screen.getByTestId("next-button");
      for (let i = 0; i < 10; i++) {
        fireEvent.click(prevButton);
        fireEvent.click(nextButton);
      }
      expect(getActiveIndex()).toBe(0);
    });
  });
});
