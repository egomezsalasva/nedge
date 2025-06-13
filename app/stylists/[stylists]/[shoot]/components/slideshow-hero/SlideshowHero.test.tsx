import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { testSbShootsData } from "../../../../../@testSbShootsData";
vi.mock("../../../../../@data", () => ({
  shoots: testSbShootsData,
}));
vi.mock("./@ui", () => ({
  ImgList: () => <div>Image List</div>,
}));
import SlideshowHero from "./SlideshowHero";

describe("SlideshowHero Component", () => {
  beforeEach(() => {
    render(<SlideshowHero shootData={testSbShootsData[0]} />);
  });
  it("renders without crashing", () => {
    expect(screen.getByTestId("slideshow-hero")).toBeInTheDocument();
  });
  it("renders the image and blur image", () => {
    expect(screen.getByTestId("image")).toBeInTheDocument();
    expect(screen.getByTestId("image-blur")).toBeInTheDocument();
  });
  it("renders the shade gradient", () => {
    expect(screen.getByTestId("shade-gradient")).toBeInTheDocument();
  });
  it("renders ImgList component", () => {
    expect(screen.getByText("Image List")).toBeInTheDocument();
  });
});
