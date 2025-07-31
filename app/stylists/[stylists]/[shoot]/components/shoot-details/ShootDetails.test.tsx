import { cleanup, render, screen } from "@testing-library/react";
import ShootDetails from "./ShootDetails";
import { formatDate } from "@/app/utils";
import { ShootType } from "@/app/types";

vi.mock("./@ui/BookmarkButton", () => ({
  default: ({ shootId }: { shootId: number }) => (
    <button data-testid="bookmark" data-shoot-id={shootId}>
      Bookmark
    </button>
  ),
}));

vi.mock("@/app/svgs", () => ({
  Insta: () => <svg data-testid="insta-icon">Instagram Icon</svg>,
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    target,
    className,
  }: {
    children: React.ReactNode;
    href:
      | string
      | { pathname: string; query?: Record<string, string | number> };
    target?: string;
    className?: string;
  }) => {
    let hrefValue: string = typeof href === "string" ? href : "";
    if (typeof href === "object" && href.pathname) {
      const queryString = href.query
        ? "?" +
          Object.entries(href.query)
            .map(([key, value]) => `${key}=${value}`)
            .join("&")
        : "";
      hrefValue = href.pathname + queryString;
    }

    return (
      <a href={hrefValue} target={target} className={className}>
        {children}
      </a>
    );
  },
}));

vi.mock("@/app/utils", () => ({
  formatDate: vi.fn((date: string) => `Formatted ${date}`),
}));

const mockShootData: ShootType = {
  id: 1,
  name: "Test Shoot",
  description: "Test shoot description",
  slug: "test-shoot",
  preview_slug: "",
  publication_date: "2024-01-15",
  city: {
    name: "Test City",
    country: "Test Country",
  },
  stylist: {
    name: "Test Stylist",
    slug: "test-stylist",
    description: "Test stylist description",
    instagram_url: "https://www.instagram.com/test-stylist",
  },
  shoot_style_tags: [
    { name: "Style 1", slug: "style-1" },
    { name: "Style 2", slug: "style-2" },
  ],
  shoot_images: [
    { image_url: "https://example.com/image1.jpg" },
    { image_url: "https://example.com/image2.jpg" },
  ],
  shoot_garments: [
    {
      id: 1,
      name: "Test Garment",
      type: "Dress",
      brand: {
        name: "Test Brand",
        instagram_url: "https://www.instagram.com/test-brand",
      },
      affiliate_link: "https://example.com/affiliate",
    },
  ],
};

describe("ShootDetails Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    render(<ShootDetails shootData={mockShootData} />);
  });

  it("renders without crashing", () => {
    expect(screen.getByTestId("shoot-details")).toBeInTheDocument();
  });

  it("renders the header with date, city and bookmark button", () => {
    expect(screen.getByText("Formatted 2024-01-15")).toBeInTheDocument();
    expect(screen.getByText("Test City")).toBeInTheDocument();
    expect(screen.getByTestId("bookmark")).toBeInTheDocument();
    expect(screen.getByTestId("bookmark")).toHaveAttribute(
      "data-shoot-id",
      "1",
    );
  });

  it("renders the stylist name, description and Instagram link", () => {
    expect(screen.getByText("Test Stylist")).toBeInTheDocument();
    expect(screen.getByText("Test stylist description")).toBeInTheDocument();
    const instaLink = screen.getByRole("link", { name: /instagram icon/i });
    expect(instaLink).toBeInTheDocument();
    expect(instaLink).toHaveAttribute(
      "href",
      "https://www.instagram.com/test-stylist",
    );
    expect(instaLink).toHaveAttribute("target", "_blank");
  });
  it("renders the shoot name and description", () => {
    expect(screen.getByText("Test Shoot")).toBeInTheDocument();
    expect(screen.getByText("Test shoot description")).toBeInTheDocument();
  });

  it("renders style tags as links", () => {
    expect(screen.getByText("Style 1")).toBeInTheDocument();
    expect(screen.getByText("Style 2")).toBeInTheDocument();
    const style1Link = screen.getByRole("link", { name: "Style 1" });
    const style2Link = screen.getByRole("link", { name: "Style 2" });
    expect(style1Link).toHaveAttribute("href", "/explore?substyle=style-1");
    expect(style2Link).toHaveAttribute("href", "/explore?substyle=style-2");
  });

  it("does not render stylist description when it's empty", () => {
    cleanup();
    const shootDataWithoutDescription = {
      ...mockShootData,
      stylist: {
        ...mockShootData.stylist,
        description: "",
      },
    };
    render(<ShootDetails shootData={shootDataWithoutDescription} />);
    expect(screen.getByText("Test Stylist")).toBeInTheDocument();
    expect(
      screen.queryByText("Test stylist description"),
    ).not.toBeInTheDocument();
  });

  it("handles empty style tags array", () => {
    cleanup();
    const shootDataWithoutTags = {
      ...mockShootData,
      shoot_style_tags: [],
    };
    render(<ShootDetails shootData={shootDataWithoutTags} />);
    expect(screen.getByText("Test Shoot")).toBeInTheDocument();
    expect(screen.getByText("Test shoot description")).toBeInTheDocument();
  });

  it("calls formatDate with the correct publication date", () => {
    expect(formatDate).toHaveBeenCalledWith("2024-01-15");
    expect(formatDate).toHaveBeenCalledTimes(1);
  });

  it("handles missing city data gracefully", () => {
    cleanup();
    const shootDataWithoutCity = {
      ...mockShootData,
      city: {
        name: "",
        country: "Test Country",
      },
    };
    render(<ShootDetails shootData={shootDataWithoutCity} />);
    expect(screen.getByTestId("shoot-details")).toBeInTheDocument();
  });

  it("handles missing stylist Instagram URL", () => {
    cleanup();
    const shootDataWithoutInsta = {
      ...mockShootData,
      stylist: {
        ...mockShootData.stylist,
        instagram_url: "",
      },
    };
    render(<ShootDetails shootData={shootDataWithoutInsta} />);
    expect(screen.getByText("Test Stylist")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /instagram icon/i }),
    ).not.toBeInTheDocument();
  });

  it("renders multiple style tags correctly", () => {
    cleanup();
    const shootDataWithManyTags = {
      ...mockShootData,
      shoot_style_tags: [
        { name: "Style 1", slug: "style-1" },
        { name: "Style 2", slug: "style-2" },
        { name: "Style 3", slug: "style-3" },
        { name: "Style 4", slug: "style-4" },
      ],
    };
    render(<ShootDetails shootData={shootDataWithManyTags} />);

    expect(screen.getByText("Style 1")).toBeInTheDocument();
    expect(screen.getByText("Style 2")).toBeInTheDocument();
    expect(screen.getByText("Style 3")).toBeInTheDocument();
    expect(screen.getByText("Style 4")).toBeInTheDocument();

    const style3Link = screen.getByRole("link", { name: "Style 3" });
    const style4Link = screen.getByRole("link", { name: "Style 4" });
    expect(style3Link).toHaveAttribute("href", "/explore?substyle=style-3");
    expect(style4Link).toHaveAttribute("href", "/explore?substyle=style-4");
  });

  it("handles empty shoot description", () => {
    cleanup();
    const shootDataWithoutDescription = {
      ...mockShootData,
      description: "",
    };
    render(<ShootDetails shootData={shootDataWithoutDescription} />);
    expect(screen.getByText("Test Shoot")).toBeInTheDocument();
    const paragraphs = screen.getAllByText((content, element) => {
      return element?.tagName.toLowerCase() === "p";
    });
    expect(paragraphs.length).toBeGreaterThan(0);
  });

  it("renders list items for style tags", () => {
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
  });

  it("renders unordered list for style tags", () => {
    const lists = screen.getAllByRole("list");
    expect(lists).toHaveLength(1);
  });

  it("passes correct shootId to BookmarkButton", () => {
    const bookmarkButton = screen.getByTestId("bookmark");
    expect(bookmarkButton).toHaveAttribute("data-shoot-id", "1");
  });

  it("renders Instagram icon inside link", () => {
    const instaIcon = screen.getByTestId("insta-icon");
    expect(instaIcon).toBeInTheDocument();
    const instaLink = screen.getByRole("link", { name: /instagram icon/i });
    expect(instaLink).toContainElement(instaIcon);
  });

  it("handles special characters in style tag names", () => {
    cleanup();
    const shootDataWithSpecialChars = {
      ...mockShootData,
      shoot_style_tags: [
        { name: "Style & Design", slug: "style-design" },
        { name: "Fashion 2024!", slug: "fashion-2024" },
      ],
    };
    render(<ShootDetails shootData={shootDataWithSpecialChars} />);
    expect(screen.getByText("Style & Design")).toBeInTheDocument();
    expect(screen.getByText("Fashion 2024!")).toBeInTheDocument();
    const styleDesignLink = screen.getByRole("link", {
      name: "Style & Design",
    });
    const fashionLink = screen.getByRole("link", { name: "Fashion 2024!" });
    expect(styleDesignLink).toHaveAttribute(
      "href",
      "/explore?substyle=style-design",
    );
    expect(fashionLink).toHaveAttribute(
      "href",
      "/explore?substyle=fashion-2024",
    );
  });

  it("handles null or undefined stylist Instagram URL", () => {
    cleanup();
    const shootDataWithNullInsta = {
      ...mockShootData,
      stylist: {
        ...mockShootData.stylist,
        instagram_url: null,
      },
    };
    render(<ShootDetails shootData={shootDataWithNullInsta} />);
    expect(screen.getByText("Test Stylist")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /instagram icon/i }),
    ).not.toBeInTheDocument();
  });

  it("handles missing city name gracefully", () => {
    cleanup();
    const shootDataWithNullCity = {
      ...mockShootData,
      city: {
        name: null,
        country: "Test Country",
      },
    };
    render(<ShootDetails shootData={shootDataWithNullCity} />);
    expect(screen.getByTestId("shoot-details")).toBeInTheDocument();
  });

  it("renders all required sections", () => {
    expect(screen.getByTestId("shoot-details")).toBeInTheDocument();
    expect(screen.getByText("Test Shoot")).toBeInTheDocument(); // Shoot name
    expect(screen.getByText("Test Stylist")).toBeInTheDocument(); // Stylist name
    expect(screen.getByText("Test City")).toBeInTheDocument(); // City name
    expect(screen.getByText("Formatted 2024-01-15")).toBeInTheDocument(); // Date
  });
});
