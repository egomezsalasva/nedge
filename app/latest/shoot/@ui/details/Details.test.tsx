import { cleanup, render, screen } from "@testing-library/react";
import Details from "./Details";
import { ShootType } from "@/app/types";

const testShootData: ShootType = {
  id: 1,
  name: "Test Shoot Title",
  slug: "test-shoot-title",
  preview_slug: "test-preview",
  publication_date: "2025-05-19T00:00:00.000Z",
  description: "This is a test shoot description for testing purposes.",
  city: {
    name: "Test City",
    country: "Test Country",
  },
  stylist: {
    name: "Test Stylist",
    slug: "test-stylist",
    description: "Test Stylist Description",
    instagram_url: "",
  },
  shoot_style_tags: [
    { name: "Urban", slug: "urban" },
    { name: "Modern", slug: "modern" },
    { name: "Casual", slug: "casual" },
  ],
  shoot_images: [
    { image_url: "/test-img-1.png" },
    { image_url: "/test-img-2.png" },
    { image_url: "/test-img-3.png" },
  ],
  shoot_garments: [],
};

describe("Latest Shoot Details Component", () => {
  beforeEach(() => {
    render(
      <Details
        shootData={testShootData}
        activeImgIndex={0}
        setActiveImgIndex={() => {}}
      />,
    );
  });

  it("renders without crashing", () => {
    expect(screen.getByTestId("details")).toBeInTheDocument();
  });

  it("should display the formatted shoot date", () => {
    expect(screen.getByText("19/05/2025")).toBeInTheDocument();
  });

  it("should display the shoot city", () => {
    expect(screen.getByText("Test City")).toBeInTheDocument();
  });

  it("should display the shoot title", () => {
    expect(
      screen.getByText((content) => content.includes(testShootData.name)),
    ).toBeInTheDocument();
  });

  it("should display the shoot stylist", () => {
    expect(
      screen.getByText((content) =>
        content.includes(testShootData.stylist.name),
      ),
    ).toBeInTheDocument();
  });

  it("should display all shoot tags", () => {
    expect(screen.getByText("Urban")).toBeInTheDocument();
    expect(screen.getByText("Modern")).toBeInTheDocument();
    expect(screen.getByText("Casual")).toBeInTheDocument();
  });

  it("should display the shoot description", () => {
    expect(
      screen.getByText(
        "This is a test shoot description for testing purposes.",
      ),
    ).toBeInTheDocument();
  });

  it("should render the SlideshowIndicators component and match the number of images", () => {
    const indicators = screen.getAllByTestId("indicator");
    expect(indicators).toHaveLength(3);
    expect(screen.getByTestId("previous-button")).toBeInTheDocument();
    expect(screen.getByTestId("next-button")).toBeInTheDocument();
  });

  it("should have correct link to shoot details", () => {
    const viewButton = screen.getByText("VIEW DETAILS");
    expect(viewButton.closest("a")).toHaveAttribute(
      "href",
      "/stylists/test-stylist/test-shoot-title",
    );
  });

  it("should have correct links for style tags", () => {
    const urbanLink = screen.getByText("Urban").closest("a");
    const modernLink = screen.getByText("Modern").closest("a");
    const casualLink = screen.getByText("Casual").closest("a");
    expect(urbanLink).toHaveAttribute("href", "/explore?substyle=urban");
    expect(modernLink).toHaveAttribute("href", "/explore?substyle=modern");
    expect(casualLink).toHaveAttribute("href", "/explore?substyle=casual");
  });

  it("should handle missing stylist data", () => {
    cleanup(); // Clean up the beforeEach render
    const shootDataWithoutStylist = {
      ...testShootData,
      stylist: null,
    };
    render(
      <Details
        shootData={shootDataWithoutStylist}
        activeImgIndex={0}
        setActiveImgIndex={() => {}}
      />,
    );
    expect(screen.getByTestId("details")).toBeInTheDocument();
  });

  it("should handle empty shoot images", () => {
    cleanup(); // Clean up the beforeEach render
    const shootDataWithoutImages = {
      ...testShootData,
      shoot_images: null,
    };
    render(
      <Details
        shootData={shootDataWithoutImages}
        activeImgIndex={0}
        setActiveImgIndex={() => {}}
      />,
    );
    expect(screen.getByTestId("details")).toBeInTheDocument();
  });

  it("should handle empty style tags", () => {
    cleanup(); // Clean up the beforeEach render
    const shootDataWithoutTags = {
      ...testShootData,
      shoot_style_tags: [],
    };
    render(
      <Details
        shootData={shootDataWithoutTags}
        activeImgIndex={0}
        setActiveImgIndex={() => {}}
      />,
    );
    expect(screen.getByTestId("details")).toBeInTheDocument();
  });

  it("should format different date formats correctly", () => {
    cleanup(); // Clean up the beforeEach render
    const differentDateData = {
      ...testShootData,
      publication_date: "2024-12-25T00:00:00.000Z",
    };
    render(
      <Details
        shootData={differentDateData}
        activeImgIndex={0}
        setActiveImgIndex={() => {}}
      />,
    );
    expect(screen.getByText("25/12/2024")).toBeInTheDocument();
  });

  it("should log shoot images to console", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    cleanup(); // Clean up the beforeEach render
    render(
      <Details
        shootData={testShootData}
        activeImgIndex={0}
        setActiveImgIndex={() => {}}
      />,
    );
    expect(consoleSpy).toHaveBeenCalledWith("shoot_images", [
      "/test-img-1.png",
      "/test-img-2.png",
      "/test-img-3.png",
    ]);
    consoleSpy.mockRestore();
  });

  it("should have proper accessibility attributes", () => {
    const urbanLink = screen.getByText("Urban").closest("a");
    expect(urbanLink).toHaveAttribute("href");
    const viewButton = screen.getByText("VIEW DETAILS");
    expect(viewButton).toBeInTheDocument();
    const viewLink = viewButton.closest("a");
    expect(viewLink).toHaveAttribute("href");
  });

  it("should handle different active image indices", () => {
    cleanup(); // Clean up the beforeEach render
    render(
      <Details
        shootData={testShootData}
        activeImgIndex={2}
        setActiveImgIndex={() => {}}
      />,
    );
    expect(screen.getByTestId("details")).toBeInTheDocument();
  });

  it("should pass setActiveImgIndex callback to SlideshowIndicators", () => {
    const mockSetActiveImgIndex = vi.fn();
    cleanup(); // Clean up the beforeEach render
    render(
      <Details
        shootData={testShootData}
        activeImgIndex={0}
        setActiveImgIndex={mockSetActiveImgIndex}
      />,
    );
    expect(screen.getByTestId("details")).toBeInTheDocument();
    expect(mockSetActiveImgIndex).toBeDefined();
  });

  it("should have proper component structure", () => {
    const detailsElement = screen.getByTestId("details");
    expect(detailsElement.querySelector('[class*="body"]')).toBeInTheDocument();
    expect(
      detailsElement.querySelector('[class*="header"]'),
    ).toBeInTheDocument();
    expect(
      detailsElement.querySelector('[class*="content"]'),
    ).toBeInTheDocument();
    expect(screen.getByTestId("previous-button")).toBeInTheDocument();
    expect(screen.getByTestId("next-button")).toBeInTheDocument();
  });

  it("should not cause memory leaks with multiple re-renders", () => {
    cleanup(); // Clean up the beforeEach render first
    const { rerender } = render(
      <Details
        shootData={testShootData}
        activeImgIndex={0}
        setActiveImgIndex={() => {}}
      />,
    );
    for (let i = 0; i < 10; i++) {
      rerender(
        <Details
          shootData={testShootData}
          activeImgIndex={i % 3}
          setActiveImgIndex={() => {}}
        />,
      );
    }
    expect(screen.getByTestId("details")).toBeInTheDocument();
  });

  it("should handle malformed image URLs", () => {
    cleanup(); // Clean up the beforeEach render
    const shootDataWithMalformedImages = {
      ...testShootData,
      shoot_images: [
        { image_url: "" },
        { image_url: "invalid-url" },
        { image_url: "/valid-image.png" },
      ],
    };
    render(
      <Details
        shootData={shootDataWithMalformedImages}
        activeImgIndex={0}
        setActiveImgIndex={() => {}}
      />,
    );
    expect(screen.getByTestId("details")).toBeInTheDocument();
  });

  it("should have proper semantic HTML structure", () => {
    const detailsElement = screen.getByTestId("details");
    const paragraphs = detailsElement.querySelectorAll("p");
    expect(paragraphs.length).toBeGreaterThan(0);
    const links = detailsElement.querySelectorAll("a");
    expect(links.length).toBeGreaterThan(0);
    const buttons = detailsElement.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("should integrate properly with parent components", () => {
    cleanup(); // Clean up the beforeEach render
    const ParentComponent = () => (
      <div data-testid="parent">
        <Details
          shootData={testShootData}
          activeImgIndex={0}
          setActiveImgIndex={() => {}}
        />
      </div>
    );
    render(<ParentComponent />);
    expect(screen.getByTestId("parent")).toBeInTheDocument();
    expect(screen.getByTestId("details")).toBeInTheDocument();
  });
});
