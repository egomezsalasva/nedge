import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import BrandsPage from "./page";

vi.mock("./components/brand-list/@utils/getBrandListData", () => ({
  getBrandListData: vi.fn().mockResolvedValue([
    {
      id: 1,
      name: "Test Brand",
      slug: "test-brand",
      itemCount: 5,
      shootCount: 2,
    },
  ]),
}));

describe("Brands Page", () => {
  it("should render the brands page", () => {
    render(<BrandsPage />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders BrandList component", async () => {
    render(<BrandsPage />);
    expect(await screen.findByTestId("brand-list")).toBeInTheDocument();
  });
});
