import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import Details from "./Details";
import { testDetails, testImgs } from "../../@testData";

describe("Latest Shoot Details Component", () => {
  beforeEach(() => {
    render(
      <Details
        imgs={testImgs}
        details={testDetails}
        activeImgIndex={0}
        setActiveImgIndex={() => {}}
      />,
    );
  });
  it("should display the shoot date", () => {
    expect(screen.getByText(testDetails.date)).toBeInTheDocument();
  });
  it("should display the shoot city", () => {
    expect(screen.getByText(testDetails.city)).toBeInTheDocument();
  });
  it("should display the shoot title", () => {
    expect(
      screen.getByText((content) => content.includes(testDetails.title)),
    ).toBeInTheDocument();
  });
  it("should display the shoot stylist", () => {
    expect(
      screen.getByText((content) => content.includes(testDetails.stylist)),
    ).toBeInTheDocument();
  });
  it("should display the shoot tags", () => {
    expect(screen.getByText(testDetails.tags[0])).toBeInTheDocument();
    expect(screen.getByText(testDetails.tags[1])).toBeInTheDocument();
  });
  it("should display the shoot description", () => {
    expect(screen.getByText(testDetails.description)).toBeInTheDocument();
  });
});
