import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import LatestShoot from "./LatestShoot";
import { testShootsData } from "@/app/@testShootsData";

describe("Latest Shoot Component", () => {
  beforeEach(() => {
    render(<LatestShoot latestShootData={testShootsData[0]} />);
  });
  it("should have an image", () => {
    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
  });
  it("should have a shade gradient", () => {
    const shadeGradient = screen.getByTestId("shade-gradient");
    expect(shadeGradient).toBeInTheDocument();
  });
  it("includes Details component", () => {
    const details = screen.getByTestId("details");
    expect(details).toBeInTheDocument();
  });
});
