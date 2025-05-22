import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { testData } from "../../../../@testData";
vi.mock("../../../../@data", () => ({
  shoots: testData,
}));
import ImgList from "./ImgList";

describe("ImgList", () => {
  const setCurrentImgMock = vi.fn();
  beforeEach(() => {
    setCurrentImgMock.mockReset();
    render(
      <ImgList
        shootData={testData[0]}
        currentImg={testData[0].imgs[0]}
        setCurrentImg={setCurrentImgMock}
      />,
    );
  });
  it("renders without crashing", () => {
    expect(screen.getByTestId("details")).toBeInTheDocument();
  });
  it("renders the details box with date, city, stylist and scroll button", () => {
    expect(screen.getByTestId("details-box")).toBeInTheDocument();
    expect(screen.getByText(testData[0].details.date)).toBeInTheDocument();
    expect(screen.getByText(testData[0].details.city)).toBeInTheDocument();
    expect(screen.getByText(testData[0].details.title)).toBeInTheDocument();
    expect(screen.getByText(testData[0].details.stylist)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Scroll To Details" }),
    ).toBeInTheDocument();
  });
  it("renders at least 1 image", () => {
    expect(screen.getAllByTestId("img").length).toBeGreaterThan(0);
  });
  it("renders the image list with the correct number of images", () => {
    expect(screen.getAllByTestId("img").length).toBe(testData[0].imgs.length);
  });
  it("renders the current image as active", () => {
    const currentImgPath = testData[0].imgs[0];
    const imgElements = screen.getAllByTestId("img");
    const activeImg = imgElements.find((img) =>
      img.className.includes("imgContainer_active"),
    );
    expect(activeImg).toBeTruthy();
    if (activeImg) {
      const firstImageIndex = imgElements.indexOf(activeImg);
      expect(firstImageIndex).toBe(0);
      expect(testData[0].imgs[firstImageIndex]).toBe(currentImgPath);
    }
  });
  it("renders the other images as inactive and check its not the currentImgPath", () => {
    const currentImgPath = testData[0].imgs[0];
    const imgElements = screen.getAllByTestId("img");
    const inactiveImgs = imgElements.filter(
      (img) => !img.className.includes("imgContainer_active"),
    );
    expect(inactiveImgs.length).toBe(testData[0].imgs.length - 1);
    inactiveImgs.forEach((img) => {
      expect(img.className).not.toContain("imgContainer_active");
      expect(img.className).toContain("imgContainer");
    });
    expect(
      inactiveImgs.every((img) => img.getAttribute("src") !== currentImgPath),
    ).toBe(true);
  });
  it("changes the currentImg when an inactive image is clicked", () => {
    const imgElements = screen.getAllByTestId("img");
    const inactiveImg = imgElements[1];
    fireEvent.click(inactiveImg);
    expect(setCurrentImgMock).toHaveBeenCalledWith(testData[0].imgs[1]);
  });
});
