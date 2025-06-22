import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { testSbShootsData } from "../../../../../../../testSbShootsData";
vi.mock("../../../../@data", () => ({
  shoots: testSbShootsData,
}));
import ImgList from "./ImgList";

describe("ImgList", () => {
  const setCurrentImgMock = vi.fn();

  beforeEach(() => {
    setCurrentImgMock.mockReset();
    render(
      <ImgList
        shootData={testSbShootsData[0]}
        currentImg={testSbShootsData[0].shoot_images[0].image_url}
        setCurrentImg={setCurrentImgMock}
      />,
    );
  });
  it("renders without crashing", () => {
    expect(screen.getByTestId("details")).toBeInTheDocument();
  });
  it("renders the details box with date, city, stylist and scroll button", () => {
    expect(screen.getByTestId("details-box")).toBeInTheDocument();
    const [year, month, day] = testSbShootsData[0].publication_date.split("-");
    const formattedDate = `${day}/${month}/${year}`;
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
    expect(screen.getByText(testSbShootsData[0].city.name)).toBeInTheDocument();
    expect(
      screen.getByText(`${testSbShootsData[0].name}:`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(testSbShootsData[0].stylist.name),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /scroll to details/i }),
    ).toBeInTheDocument();
  });
  it("renders at least 1 image", () => {
    expect(screen.getAllByTestId("img").length).toBeGreaterThan(0);
  });
  it("renders the image list with the correct number of images", () => {
    expect(screen.getAllByTestId("img").length).toBe(
      testSbShootsData[0].shoot_images.length,
    );
  });
  it("renders the current image as active", () => {
    const currentImgPath = testSbShootsData[0].shoot_images[0].image_url;
    const imgElements = screen.getAllByTestId("img");
    const activeImg = imgElements.find((img) =>
      img.className.includes("imgContainer_active"),
    );
    expect(activeImg).toBeTruthy();
    if (activeImg) {
      const firstImageIndex = imgElements.indexOf(activeImg);
      expect(firstImageIndex).toBe(0);
      const imgTag = activeImg.querySelector("img");
      expect(imgTag).toBeTruthy();
      if (imgTag) {
        expect(imgTag.getAttribute("src")).toContain(
          encodeURIComponent(currentImgPath),
        );
      }
    }
  });
  it("renders the other images as inactive and checks it's not the currentImgPath", () => {
    const currentImgPath = testSbShootsData[0].shoot_images[0].image_url;
    const imgElements = screen.getAllByTestId("img");
    const inactiveImgs = imgElements.filter(
      (img) => !img.className.includes("imgContainer_active"),
    );
    expect(inactiveImgs.length).toBe(
      testSbShootsData[0].shoot_images.length - 1,
    );
    inactiveImgs.forEach((img) => {
      expect(img.className).not.toContain("imgContainer_active");
      expect(img.className).toContain("imgContainer");
      const imgTag = img.querySelector("img");
      expect(imgTag).toBeTruthy();
      if (imgTag) {
        expect(imgTag.getAttribute("src")).not.toContain(
          encodeURIComponent(currentImgPath),
        );
      }
    });
  });
  it("changes the currentImg when an inactive image is clicked", () => {
    const imgElements = screen.getAllByTestId("img");
    const inactiveImg = imgElements[1];
    fireEvent.click(inactiveImg);
    expect(setCurrentImgMock).toHaveBeenCalledWith(
      testSbShootsData[0].shoot_images[1].image_url,
    );
  });
});
