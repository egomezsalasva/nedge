import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import Details from "./Details";
import { testShootsData } from "@/app/@testShootsData";

describe("Latest Shoot Details Component", () => {
  beforeEach(() => {
    render(
      <Details
        imgs={testShootsData[0].imgs}
        details={testShootsData[0].details}
        activeImgIndex={0}
        setActiveImgIndex={() => {}}
      />,
    );
  });
  it("should display the shoot date", () => {
    expect(
      screen.getByText(testShootsData[0].details.date),
    ).toBeInTheDocument();
  });
  it("should display the shoot city", () => {
    expect(
      screen.getByText(testShootsData[0].details.city),
    ).toBeInTheDocument();
  });
  it("should display the shoot title", () => {
    expect(
      screen.getByText((content) =>
        content.includes(testShootsData[0].details.title),
      ),
    ).toBeInTheDocument();
  });
  it("should display the shoot stylist", () => {
    expect(
      screen.getByText((content) =>
        content.includes(testShootsData[0].details.stylist),
      ),
    ).toBeInTheDocument();
  });
  it("should display the shoot tags", () => {
    expect(
      screen.getByText(testShootsData[0].details.tags[0]),
    ).toBeInTheDocument();
    expect(
      screen.getByText(testShootsData[0].details.tags[1]),
    ).toBeInTheDocument();
  });
  it("should display the shoot description", () => {
    expect(
      screen.getByText(testShootsData[0].details.description),
    ).toBeInTheDocument();
  });
});
