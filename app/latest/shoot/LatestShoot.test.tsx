import { render, screen } from "@testing-library/react";
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
  imgConstraints: vi.fn(),
}));

vi.mock("./@utils/getLatestShootData", () => ({
  getLatestShootData: vi.fn(),
}));

vi.mock("./@ui", () => ({
  Details: ({ shootData }: { shootData: { name: string } }) => (
    <div data-testid="details">Details for {shootData.name}</div>
  ),
}));

const mockShootData = {
  name: "Test Shoot",
  slug: "test-shoot",
  publication_date: "2024-01-01",
  description: "Test description",
  city: { name: "Test City" },
  stylist: { name: "Test Stylist", slug: "test-stylist" },
  shoot_style_tags: [{ name: "Test Style", slug: "test-style" }],
  shoot_images: [{ image_url: "/test-image.jpg" }],
};

describe("Latest Shoot Component", () => {
  it("shows loading state initially", () => {
    render(<LatestShoot />);
    expect(screen.getAllByText("Loading...")).toHaveLength(2);
  });

  it("shows error state when no data is available", async () => {
    const mockGetLatestShootData = vi.mocked(
      await import("./@utils/getLatestShootData"),
    ).getLatestShootData;
    mockGetLatestShootData.mockResolvedValue(null);
    render(<LatestShoot />);
    await screen.findByText("Unable to Load Latest Shoot");
    expect(screen.getByText("No shoot data available")).toBeInTheDocument();
  });

  it("renders shoot data successfully", async () => {
    const mockGetLatestShootData = vi.mocked(
      await import("./@utils/getLatestShootData"),
    ).getLatestShootData;
    mockGetLatestShootData.mockResolvedValue(mockShootData);
    render(<LatestShoot />);
    await screen.findByTestId("details");
    expect(screen.getByTestId("details")).toHaveTextContent(
      "Details for Test Shoot",
    );
    expect(screen.getByTestId("shade-gradient")).toBeInTheDocument();
  });

  it("calls imgConstraints when shoot images are available", async () => {
    const mockGetLatestShootData = vi.mocked(
      await import("./@utils/getLatestShootData"),
    ).getLatestShootData;
    const mockImgConstraints = vi.mocked(
      await import("./@utils/imgConstraints"),
    ).imgConstraints;
    mockGetLatestShootData.mockResolvedValue(mockShootData);
    render(<LatestShoot />);
    await screen.findByTestId("details");
    expect(mockImgConstraints).toHaveBeenCalledWith(["/test-image.jpg"], 10);
  });

  it("handles data fetch errors gracefully", async () => {
    const mockGetLatestShootData = vi.mocked(
      await import("./@utils/getLatestShootData"),
    ).getLatestShootData;
    mockGetLatestShootData.mockRejectedValue(new Error("Network error"));
    render(<LatestShoot />);
    await screen.findByText("Unable to Load Latest Shoot");
    expect(screen.getByText("No shoot data available")).toBeInTheDocument();
  });

  it("should fetch the latest shoot", async () => {
    const mockGetLatestShootData = vi.mocked(
      await import("./@utils/getLatestShootData"),
    ).getLatestShootData;
    mockGetLatestShootData.mockResolvedValue(mockShootData);
    render(<LatestShoot />);
    expect(mockGetLatestShootData).toHaveBeenCalled();
  });

  it("should have an image", async () => {
    const mockGetLatestShootData = vi.mocked(
      await import("./@utils/getLatestShootData"),
    ).getLatestShootData;
    mockGetLatestShootData.mockResolvedValue(mockShootData);

    render(<LatestShoot />);

    const image = await screen.findByRole("img", { name: /latest shoot/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/test-image.jpg");
  });
});
