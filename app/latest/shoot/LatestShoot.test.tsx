import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import LatestShoot from "./LatestShoot";
import { ComponentProps } from "react";

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
  } & ComponentProps<"img">) => <img src={src} alt={alt} {...props} />,
}));

vi.mock("./@utils/imgConstraints", () => ({
  imgConstraints: vi.fn((imgs) => imgs || []),
}));

vi.mock("./@ui", () => ({
  Details: ({ shootData }: { shootData: { name: string } }) => (
    <div data-testid="details">Details for {shootData.name}</div>
  ),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Latest Shoot Component", () => {
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
  it("should fetch the latest shoot", async () => {
    render(<LatestShoot />);
    expect(mockFetch).toHaveBeenCalledWith("/api/latest/shoot");
  });
  it("should have an image", async () => {
    render(<LatestShoot />);
    const image = await screen.findByRole("img", { name: /latest shoot/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/test-image.jpg");
  });
  it("should have a shade gradient", () => {
    render(<LatestShoot />);
    const shadeGradient = screen.getByTestId("shade-gradient");
    expect(shadeGradient).toBeInTheDocument();
  });
  it("includes Details component", async () => {
    render(<LatestShoot />);
    const details = await screen.findByTestId("details");
    expect(details).toBeInTheDocument();
    expect(details).toHaveTextContent("Details for Test Shoot");
  });
  it("shows loading states initially one for image and one for details", () => {
    render(<LatestShoot />);
    const loadingTexts = screen.getAllByText("Loading...");
    expect(loadingTexts).toHaveLength(2);
  });
});
