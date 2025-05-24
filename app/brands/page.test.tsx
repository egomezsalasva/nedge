import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BrandsPage from "./page";

describe("Brands Page", () => {
  it("should render the brands page", () => {
    render(<BrandsPage />);
    expect(screen.getByText("Brands")).toBeInTheDocument();
  });
  it("renders BrandList component", () => {
    render(<BrandsPage />);
    expect(screen.getByTestId("brand-list")).toBeInTheDocument();
  });
});
