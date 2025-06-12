import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./page";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Home Page", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        name: "Test Shoot",
        slug: "test-shoot",
        shoot_images: [{ image_url: "/test-image.jpg" }],
        stylist: { name: "Test Stylist" },
        city: { name: "Test City" },
      }),
    });
  });

  it("renders without crashing", () => {
    render(<Home />);
    expect(mockFetch).toHaveBeenCalledWith("/api/latest/list");
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
