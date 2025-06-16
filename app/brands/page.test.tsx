import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BrandsPage from "./page";

describe("Brands Page", () => {
  it("should render the brands page heading", () => {
    render(<BrandsPage />);
    expect(
      screen.getByRole("heading", { name: /brands/i }),
    ).toBeInTheDocument();
  });
  it("renders BrandList component", async () => {
    render(<BrandsPage />);
    expect(await screen.findByTestId("brand-list")).toBeInTheDocument();
  });
});
