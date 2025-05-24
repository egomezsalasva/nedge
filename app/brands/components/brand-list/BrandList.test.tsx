import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { testBrandsData } from "../../@testBrandsData";
import { testShootsData } from "@/app/@testShootsData";
vi.mock("../../@data", () => ({
  brands: testBrandsData,
}));
vi.mock("../../../@data", () => ({
  shoots: testShootsData,
}));
import BrandList from "./BrandList";

describe("BrandList Component", () => {
  beforeEach(() => {
    render(<BrandList />);
  });

  it("should render the brand list", () => {
    expect(screen.getByTestId("brand-list")).toBeInTheDocument();
  });
  it("should render the correct number of brands", () => {
    expect(screen.getAllByRole("link").length).toBe(
      Object.keys(testBrandsData).length,
    );
  });
});
