import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import BrandList from "./BrandList";
import { afterEach } from "node:test";

const mockBrands = [
  {
    id: 1,
    name: "Test Brand 1",
    slug: "test-brand-1",
    itemCount: 2,
    shootCount: 1,
  },
  {
    id: 2,
    name: "Test Brand 2",
    slug: "test-brand-2",
    itemCount: 1,
    shootCount: 3,
  },
];

describe("BrandList Component", () => {
  beforeEach(() => {
    vi.spyOn(global, "fetch").mockImplementation((url) => {
      if (url === "/api/brands/brands-with-counts") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockBrands),
        } as Response);
      }
      return Promise.reject(new Error("Unknown endpoint"));
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows loading state initially", () => {
    render(<BrandList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders the brand list after fetch", async () => {
    render(<BrandList />);
    await waitFor(() =>
      expect(screen.getByTestId("brand-list")).toBeInTheDocument(),
    );
    expect(screen.getAllByRole("link")).toHaveLength(mockBrands.length);
    mockBrands.forEach((brand) => {
      expect(screen.getByText(brand.name)).toBeInTheDocument();
    });
  });

  it("shows error state if fetch fails", async () => {
    (global.fetch as Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
      }),
    );
    render(<BrandList />);
    await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
  });
});
