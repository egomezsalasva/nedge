import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import ImgList from "./ImgList";
import { ShootType } from "@/app/types";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string; fill?: boolean }) => (
    <img src={src} alt={alt} data-testid="next-image" />
  ),
}));

const mockScrollIntoView = vi.fn();
Object.defineProperty(window, "scrollIntoView", {
  value: mockScrollIntoView,
  writable: true,
});

Object.defineProperty(window, "scrollIntoView", {
  value: mockScrollIntoView,
  writable: true,
});

const mockGetElementById = vi.fn(() => ({
  scrollIntoView: mockScrollIntoView,
}));
Object.defineProperty(document, "getElementById", {
  value: mockGetElementById,
  writable: true,
});

vi.mock("@/app/utils", () => ({
  formatDate: (date: string) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  },
}));

describe("ImgList", () => {
  const mockShootData: ShootType = {
    id: 1,
    name: "Test Shoot",
    slug: "test-shoot",
    description: "Test description",
    preview_slug: "",
    publication_date: "2024-01-15",
    city: { name: "Test City", country: "Test Country" },
    stylist: {
      name: "Test Stylist",
      slug: "test-stylist",
      description: "Test stylist description",
      instagram_url: "https://instagram.com/test-stylist",
    },
    shoot_images: [
      { image_url: "test-image-1.jpg" },
      { image_url: "test-image-2.jpg" },
      { image_url: "test-image-3.jpg" },
    ],
    shoot_style_tags: [],
    shoot_garments: [],
  };

  const setCurrentImgMock = vi.fn();

  const renderImgList = () => {
    return render(
      <ImgList
        shootData={mockShootData}
        currentImg={mockShootData.shoot_images[0].image_url}
        setCurrentImg={setCurrentImgMock}
      />,
    );
  };

  beforeEach(() => {
    setCurrentImgMock.mockReset();
    mockScrollIntoView.mockReset();
    mockGetElementById.mockReset();
    renderImgList();
  });

  it("renders without crashing", () => {
    expect(screen.getByTestId("details")).toBeInTheDocument();
  });

  it("renders the details box with date, city, stylist and scroll button", () => {
    expect(screen.getByTestId("details-box")).toBeInTheDocument();
    expect(screen.getByText("15/01/2024")).toBeInTheDocument();
    expect(screen.getByText("Test City")).toBeInTheDocument();
    expect(screen.getByText("Test Shoot:")).toBeInTheDocument();
    expect(screen.getByText("Test Stylist")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /scroll to details/i }),
    ).toBeInTheDocument();
  });

  it("renders at least 1 image", () => {
    const imgElements = screen.getAllByTestId("img");
    expect(imgElements.length).toBeGreaterThan(0);
  });

  it("renders the image list with the correct number of images", () => {
    const imgElements = screen.getAllByTestId("img");
    expect(imgElements.length).toBe(mockShootData.shoot_images.length);
  });

  it("renders the current image as active", () => {
    const imgElements = screen.getAllByTestId("img");
    const activeImg = imgElements.find((img) =>
      img.className.includes("imgContainer_active"),
    );
    expect(activeImg).toBeTruthy();
    if (activeImg) {
      expect(imgElements.indexOf(activeImg)).toBe(0);
    }
  });

  it("renders other images as inactive and checks it's not the currentImgPath", () => {
    const imgElements = screen.getAllByTestId("img");
    const inactiveImgs = imgElements.filter(
      (img) => !img.className.includes("imgContainer_active"),
    );

    expect(inactiveImgs.length).toBe(mockShootData.shoot_images.length - 1);
    inactiveImgs.forEach((img) => {
      expect(img.className).not.toContain("imgContainer_active");
      expect(img.className).toContain("imgContainer");
      const imgTag = img.querySelector("img");
      expect(imgTag).toBeTruthy();
      if (imgTag) {
        expect(imgTag.getAttribute("src")).not.toContain(
          encodeURIComponent(mockShootData.shoot_images[0].image_url),
        );
      }
    });
  });

  it("changes the currentImg when an inactive image is clicked", () => {
    const imgElements = screen.getAllByTestId("img");
    const inactiveImg = imgElements[1];
    fireEvent.click(inactiveImg);
    expect(setCurrentImgMock).toHaveBeenCalledWith(
      mockShootData.shoot_images[1].image_url,
    );
  });

  it("calls scrollToDetails when scroll button is clicked", () => {
    const scrollButton = screen.getByRole("button", {
      name: /scroll to details/i,
    });
    fireEvent.click(scrollButton);
    expect(mockGetElementById).toHaveBeenCalledWith("info");
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("handles empty shoot_images array gracefully", () => {
    cleanup();
    const emptyShootData = {
      ...mockShootData,
      shoot_images: [],
    };
    render(
      <ImgList
        shootData={emptyShootData}
        currentImg=""
        setCurrentImg={setCurrentImgMock}
      />,
    );
    const imgElements = screen.queryAllByTestId("img");
    expect(imgElements.length).toBe(0);
  });

  it("handles scrollToDetails when info element is not found", () => {
    mockGetElementById.mockReturnValueOnce(
      null as unknown as { scrollIntoView: typeof mockScrollIntoView },
    );
    const scrollButton = screen.getByRole("button", {
      name: /scroll to details/i,
    });
    fireEvent.click(scrollButton);
    expect(mockGetElementById).toHaveBeenCalledWith("info");
    expect(mockScrollIntoView).not.toHaveBeenCalled();
  });

  it("handles clicking on the active image without changing state", () => {
    const imgElements = screen.getAllByTestId("img");
    const activeImg = imgElements[0];
    fireEvent.click(activeImg);
    expect(setCurrentImgMock).not.toHaveBeenCalled();
  });

  it("marks the clicked image as active after changing currentImg", () => {
    // Simulate clicking the second image
    const imgElements = screen.getAllByTestId("img");
    const secondImg = imgElements[1];
    fireEvent.click(secondImg);
    // Simulate re-render with updated currentImg
    cleanup();
    render(
      <ImgList
        shootData={mockShootData}
        currentImg={mockShootData.shoot_images[1].image_url}
        setCurrentImg={setCurrentImgMock}
      />,
    );
    const updatedImgElements = screen.getAllByTestId("img");
    const activeImg = updatedImgElements.find((img) =>
      img.className.includes("imgContainer_active"),
    );
    expect(activeImg).toBeTruthy();
    if (activeImg) {
      expect(updatedImgElements.indexOf(activeImg)).toBe(1);
    }
  });

  it("renders images with correct alt text", () => {
    const imgElements = screen.getAllByTestId("next-image");
    imgElements.forEach((img) => {
      expect(img).toHaveAttribute("alt", "img");
    });
  });

  it("renders the correct number of next/image elements", () => {
    const imgElements = screen.getAllByTestId("next-image");
    expect(imgElements.length).toBe(mockShootData.shoot_images.length);
  });

  it("handles undefined shoot_images gracefully", () => {
    cleanup();
    const incompleteShootData = {
      ...mockShootData,
      shoot_images: undefined,
    };
    render(
      <ImgList
        shootData={incompleteShootData as unknown as ShootType}
        currentImg=""
        setCurrentImg={setCurrentImgMock}
      />,
    );
    const imgElements = screen.queryAllByTestId("img");
    expect(imgElements.length).toBe(0);
  });

  it("handles missing stylist or city gracefully", () => {
    cleanup();
    const incompleteShootData = {
      ...mockShootData,
      stylist: undefined,
      city: undefined,
    };
    render(
      <ImgList
        shootData={incompleteShootData as unknown as ShootType}
        currentImg=""
        setCurrentImg={setCurrentImgMock}
      />,
    );
    expect(screen.getByTestId("details")).toBeInTheDocument();
  });

  it("renders long shoot and stylist names without crashing", () => {
    cleanup();
    const longNameData = {
      ...mockShootData,
      name: "A".repeat(200),
      stylist: { ...mockShootData.stylist, name: "B".repeat(200) },
    };
    render(
      <ImgList
        shootData={longNameData}
        currentImg={longNameData.shoot_images[0].image_url}
        setCurrentImg={setCurrentImgMock}
      />,
    );
    expect(screen.getByText(/A{200}/)).toBeInTheDocument();
    expect(screen.getByText(/B{200}/)).toBeInTheDocument();
  });
});
