import { render, screen } from "@testing-library/react";
import GarmsList from "./GarmsList";
import { ShootGarmentType } from "@/app/types";

vi.mock("./@ui/SaveGarmentButton", () => ({
  default: ({ garmId }: { garmId: number }) => (
    <button data-testid={`save-button-${garmId}`}>Save</button>
  ),
}));

vi.mock("@/app/svgs", () => ({
  Insta: ({ className }: { className: string }) => (
    <svg data-testid="insta-icon" className={className} />
  ),
}));

vi.mock("../../../../../utils", () => ({
  useFindWidestElement: () => "100px",
}));

const mockGarmsData: ShootGarmentType[] = [
  {
    id: 1,
    name: "Item Name 1",
    type: "Dress",
    brand: {
      name: "Brand 1",
      instagram_url: "",
    },
    affiliate_link: "https://www.brand.com/item-1",
  },
  {
    id: 2,
    name: "Item Name 2",
    type: "Top",
    brand: {
      name: "Brand 2",
      instagram_url: "",
    },
    affiliate_link: "https://www.brand.com/item-2",
  },
  {
    id: 3,
    name: "Item Name 3",
    type: "Pants",
    brand: {
      name: "Brand 3",
      instagram_url: "",
    },
    affiliate_link: "https://www.brand.com/item-3",
  },
  {
    id: 4,
    name: "Item Name 4",
    type: "Shoes",
    brand: {
      name: "Brand 4",
      instagram_url: "https://www.instagram.com/brand-4",
    },
    affiliate_link: "",
  },
  {
    id: 5,
    name: "Item Name 5",
    type: "Accessory",
    brand: {
      name: "Brand 5",
      instagram_url: "",
    },
    affiliate_link: "",
  },
];

describe("GarmsList Component", async () => {
  it("renders the garms list container", () => {
    render(<GarmsList garmsData={mockGarmsData} />);
    expect(screen.getByTestId("garms-list")).toBeInTheDocument();
  });
  it("renders the correct number of garms", () => {
    render(<GarmsList garmsData={mockGarmsData} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(mockGarmsData.length);
  });
  it("renders type, name and brand for each garm", () => {
    render(<GarmsList garmsData={mockGarmsData} />);
    expect(screen.getByText("Dress")).toBeInTheDocument();
    expect(screen.getByText("Item Name 1")).toBeInTheDocument();
    expect(screen.getByText("Brand 1")).toBeInTheDocument();
    expect(screen.getByText("Top")).toBeInTheDocument();
    expect(screen.getByText("Item Name 2")).toBeInTheDocument();
    expect(screen.getByText("Brand 2")).toBeInTheDocument();
  });
  it("renders Buy button if affiliateLink exists", () => {
    render(<GarmsList garmsData={mockGarmsData} />);
    const buyLinks = screen.getAllByRole("link", { name: "Buy" });
    expect(buyLinks).toHaveLength(3);
    expect(buyLinks[0]).toHaveAttribute("href", "https://www.brand.com/item-1");
    expect(buyLinks[1]).toHaveAttribute("href", "https://www.brand.com/item-2");
    expect(buyLinks[2]).toHaveAttribute("href", "https://www.brand.com/item-3");
  });
  it("renders Save button for each garm", () => {
    render(<GarmsList garmsData={mockGarmsData} />);
    const saveButtons = screen.getAllByRole("button", { name: "Save" });
    expect(saveButtons).toHaveLength(5);
  });
  it("renders Insta button if it exists and no affiliateLink", () => {
    render(<GarmsList garmsData={mockGarmsData} />);
    const instaLinks = screen.queryAllByTestId("insta-link");
    expect(instaLinks).toHaveLength(1);
    expect(instaLinks[0]).toHaveAttribute(
      "href",
      "https://www.instagram.com/brand-4",
    );
  });
  it("renders nothing if no affiliateLink or instaLink", () => {
    render(<GarmsList garmsData={mockGarmsData} />);
    const buyLinks = screen.getAllByRole("link", { name: "Buy" });
    const instaLinks = screen.queryAllByTestId("insta-link");
    expect(buyLinks).toHaveLength(3);
    expect(instaLinks).toHaveLength(1);
    const item5 = screen.getByText("Item Name 5").closest("li");
    expect(item5!.querySelector('a[role="link"][name="Buy"]')).toBeNull();
    expect(item5!.querySelector('[data-testid="insta-link"]')).toBeNull();
  });

  it("renders Save button with correct garmId for each garm", () => {
    render(<GarmsList garmsData={mockGarmsData} />);
    expect(screen.getByTestId("save-button-1")).toBeInTheDocument();
    expect(screen.getByTestId("save-button-2")).toBeInTheDocument();
    expect(screen.getByTestId("save-button-3")).toBeInTheDocument();
    expect(screen.getByTestId("save-button-4")).toBeInTheDocument();
    expect(screen.getByTestId("save-button-5")).toBeInTheDocument();
  });

  it("renders nothing when garmsData is empty", () => {
    const { container } = render(<GarmsList garmsData={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when garmsData is null", () => {
    const { container } = render(
      <GarmsList garmsData={null as unknown as ShootGarmentType[]} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when garmsData is undefined", () => {
    const { container } = render(
      <GarmsList garmsData={undefined as unknown as ShootGarmentType[]} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders all garment types correctly", () => {
    render(<GarmsList garmsData={mockGarmsData} />);
    expect(screen.getByText("Dress")).toBeInTheDocument();
    expect(screen.getByText("Top")).toBeInTheDocument();
    expect(screen.getByText("Pants")).toBeInTheDocument();
    expect(screen.getByText("Shoes")).toBeInTheDocument();
    expect(screen.getByText("Accessory")).toBeInTheDocument();
  });

  it("renders all brand names correctly", () => {
    render(<GarmsList garmsData={mockGarmsData} />);
    expect(screen.getByText("Brand 1")).toBeInTheDocument();
    expect(screen.getByText("Brand 2")).toBeInTheDocument();
    expect(screen.getByText("Brand 3")).toBeInTheDocument();
    expect(screen.getByText("Brand 4")).toBeInTheDocument();
    expect(screen.getByText("Brand 5")).toBeInTheDocument();
  });

  it("renders all garment names correctly", () => {
    render(<GarmsList garmsData={mockGarmsData} />);
    expect(screen.getByText("Item Name 1")).toBeInTheDocument();
    expect(screen.getByText("Item Name 2")).toBeInTheDocument();
    expect(screen.getByText("Item Name 3")).toBeInTheDocument();
    expect(screen.getByText("Item Name 4")).toBeInTheDocument();
    expect(screen.getByText("Item Name 5")).toBeInTheDocument();
  });

  it("renders Buy links with correct target and rel attributes", () => {
    render(<GarmsList garmsData={mockGarmsData} />);
    const buyLinks = screen.getAllByRole("link", { name: "Buy" });
    buyLinks.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("renders Instagram links with correct target and rel attributes", () => {
    render(<GarmsList garmsData={mockGarmsData} />);
    const instaLinks = screen.queryAllByTestId("insta-link");
    instaLinks.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("renders Instagram icon inside insta-link", () => {
    render(<GarmsList garmsData={mockGarmsData} />);
    const instaLinks = screen.queryAllByTestId("insta-link");
    instaLinks.forEach((link) => {
      expect(
        link.querySelector('[data-testid="insta-icon"]'),
      ).toBeInTheDocument();
    });
  });

  it("renders each garment with unique id attribute", () => {
    render(<GarmsList garmsData={mockGarmsData} />);
    expect(screen.getByText("Item Name 1").closest("li")).toHaveAttribute(
      "id",
      "1",
    );
    expect(screen.getByText("Item Name 2").closest("li")).toHaveAttribute(
      "id",
      "2",
    );
    expect(screen.getByText("Item Name 3").closest("li")).toHaveAttribute(
      "id",
      "3",
    );
    expect(screen.getByText("Item Name 4").closest("li")).toHaveAttribute(
      "id",
      "4",
    );
    expect(screen.getByText("Item Name 5").closest("li")).toHaveAttribute(
      "id",
      "5",
    );
  });

  it("renders container with correct data-testid", () => {
    render(<GarmsList garmsData={mockGarmsData} />);
    const container = screen.getByTestId("garms-list");
    expect(container).toBeInTheDocument();
    expect(container.tagName).toBe("DIV");
  });

  it("renders ul element with correct number of li children", () => {
    render(<GarmsList garmsData={mockGarmsData} />);
    const ul = screen.getByTestId("garms-list").querySelector("ul");
    expect(ul).toBeInTheDocument();
    expect(ul!.children).toHaveLength(mockGarmsData.length);
  });

  it("handles malformed data gracefully", () => {
    const malformedData = [
      {
        id: 1,
        name: "Item Name 1",
        type: "Dress",
        brand: {
          name: "Brand 1",
          instagram_url: "",
        },
        affiliate_link: "https://www.brand.com/item-1",
      },
      {
        id: 2,
        name: null,
        type: undefined,
        brand: null,
        affiliate_link: "",
      },
    ] as unknown as ShootGarmentType[];
    render(<GarmsList garmsData={malformedData} />);
    expect(screen.getByText("Item Name 1")).toBeInTheDocument();
    expect(screen.getByText("Dress")).toBeInTheDocument();
    expect(screen.getByText("Brand 1")).toBeInTheDocument();
  });

  it("renders with proper accessibility attributes", () => {
    render(<GarmsList garmsData={mockGarmsData} />);
    const container = screen.getByTestId("garms-list");
    const ul = container.querySelector("ul");
    const listItems = screen.getAllByRole("listitem");
    expect(ul).toBeInTheDocument();
    expect(listItems).toHaveLength(mockGarmsData.length);
    listItems.forEach((li, index) => {
      expect(li).toHaveAttribute("id", mockGarmsData[index].id.toString());
    });
  });

  it("renders data-measurewidth attribute on type elements", () => {
    render(<GarmsList garmsData={mockGarmsData} />);
    const typeElements = screen.getAllByText(/Dress|Top|Pants|Shoes|Accessory/);
    typeElements.forEach((element) => {
      expect(element).toHaveAttribute("data-measurewidth");
    });
  });

  it("renders with proper link structure for Buy buttons", () => {
    render(<GarmsList garmsData={mockGarmsData} />);
    const buyLinks = screen.getAllByRole("link", { name: "Buy" });
    buyLinks.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link.textContent).toBe("Buy");
      expect(link.className).toMatch(/garmLink/);
    });
  });

  it("renders with proper link structure for Instagram buttons", () => {
    render(<GarmsList garmsData={mockGarmsData} />);
    const instaLinks = screen.queryAllByTestId("insta-link");
    instaLinks.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link.className).toMatch(/garmLink/);
    });
  });

  it("renders with proper structure for garment info section", () => {
    render(<GarmsList garmsData={mockGarmsData} />);
    const listItems = screen.getAllByRole("listitem");
    listItems.forEach((li) => {
      const garmInfo = li.querySelector('[class*="garmInfo"]');
      const garmNameBrand = li.querySelector('[class*="garmNameBrand"]');
      const garmName = li.querySelector('[class*="garmName"]');
      const garmBrand = li.querySelector('[class*="garmBrand"]');
      expect(garmInfo).toBeInTheDocument();
      expect(garmNameBrand).toBeInTheDocument();
      expect(garmName).toBeInTheDocument();
      expect(garmBrand).toBeInTheDocument();
    });
  });

  it("renders with proper structure for garment links section", () => {
    render(<GarmsList garmsData={mockGarmsData} />);
    const listItems = screen.getAllByRole("listitem");
    listItems.forEach((li) => {
      const garmLinks = li.querySelector('[class*="garmLinks"]');
      expect(garmLinks).toBeInTheDocument();
    });
  });

  it("handles long text content gracefully", () => {
    const longTextData: ShootGarmentType[] = [
      {
        id: 1,
        name: "This is a very long garment name that might overflow the container and should be handled gracefully by the component",
        type: "This is a very long garment type name that might overflow",
        brand: {
          name: "This is a very long brand name that might overflow the container",
          instagram_url: "",
        },
        affiliate_link: "https://www.brand.com/item-1",
      },
    ];
    render(<GarmsList garmsData={longTextData} />);
    expect(screen.getByText(longTextData[0].name)).toBeInTheDocument();
    expect(screen.getByText(longTextData[0].type)).toBeInTheDocument();
    expect(screen.getByText(longTextData[0].brand.name)).toBeInTheDocument();
  });

  it("renders with proper width calculation attributes", () => {
    render(<GarmsList garmsData={mockGarmsData} />);
    const typeElements = screen.getAllByText(/Dress|Top|Pants|Shoes|Accessory/);
    typeElements.forEach((element) => {
      expect(element).toHaveAttribute("data-measurewidth");
      expect(element).toHaveStyle({ width: "100px" });
    });
  });

  it("handles special characters and emojis in text content", () => {
    const specialCharData: ShootGarmentType[] = [
      {
        id: 1,
        name: "Item with special chars: !@#$%^&*()",
        type: "Type with emojis: 👗��👖",
        brand: {
          name: "Brand with symbols: ©®™",
          instagram_url: "",
        },
        affiliate_link: "https://www.brand.com/item-1",
      },
    ];
    render(<GarmsList garmsData={specialCharData} />);
    expect(screen.getByText(specialCharData[0].name)).toBeInTheDocument();
    expect(screen.getByText(specialCharData[0].type)).toBeInTheDocument();
    expect(screen.getByText(specialCharData[0].brand.name)).toBeInTheDocument();
  });

  it("handles large dataset performance", () => {
    const largeDataset: ShootGarmentType[] = Array.from(
      { length: 100 },
      (_, index) => ({
        id: index + 1,
        name: `Item Name ${index + 1}`,
        type: `Type ${index + 1}`,
        brand: {
          name: `Brand ${index + 1}`,
          instagram_url:
            index % 3 === 0 ? "https://www.instagram.com/brand" : "",
        },
        affiliate_link:
          index % 2 === 0 ? `https://www.brand.com/item-${index + 1}` : "",
      }),
    );
    render(<GarmsList garmsData={largeDataset} />);
    expect(screen.getByTestId("garms-list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(100);
    expect(screen.getAllByRole("button", { name: "Save" })).toHaveLength(100);
  });
});
