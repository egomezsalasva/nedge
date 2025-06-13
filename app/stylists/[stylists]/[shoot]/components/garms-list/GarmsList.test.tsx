import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { testSbShootsData } from "../../../../../@testSbShootsData";
vi.mock("../../../../../@data", () => ({
  shoots: testSbShootsData,
}));
import GarmsList from "./GarmsList";

describe("GarmsList Component", async () => {
  let buyLinks: HTMLElement[];
  let instaLinks: HTMLElement[];
  beforeEach(() => {
    render(<GarmsList garmsData={testSbShootsData[0].shoot_garments} />);
    buyLinks = screen.getAllByRole("link", { name: "Buy" });
    instaLinks = screen.queryAllByTestId("insta-link");
  });
  it("renders the matching shoot's garms", async () => {
    expect(screen.getByTestId("garms-list")).toBeInTheDocument();
  });
  it("renders the correct number of garms", async () => {
    expect(screen.getAllByRole("listitem")).toHaveLength(
      testSbShootsData[0].shoot_garments.length,
    );
  });
  it("renders the correct garms", async () => {
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
  });
  it("renders type, name and brand for each garm", async () => {
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item Name 1")).toBeInTheDocument();
    expect(screen.getByText("Brand 1")).toBeInTheDocument();
  });
  it("renders Buy button if affiliateLink exists", async () => {
    expect(buyLinks.length).toBe(3);
    expect(buyLinks[0]).toHaveAttribute("href", "https://www.brand.com/item-1");
    expect(buyLinks[1]).toHaveAttribute("href", "https://www.brand.com/item-2");
    expect(buyLinks[2]).toHaveAttribute("href", "https://www.brand.com/item-3");
  });
  it("renders Save button for each garm", async () => {
    const saveButtons = screen.getAllByRole("button", { name: "Save" });
    expect(saveButtons.length).toBe(5);
  });
  it("renders Insta button if it exists and no affiliateLink", async () => {
    expect(instaLinks.length).toBe(1);
    expect(instaLinks[0]).toHaveAttribute(
      "href",
      "https://www.instagram.com/brand-4",
    );
  });
  it("renders nothing if no affiliateLink or instaLink", async () => {
    expect(buyLinks.length).toBe(3);
    expect(instaLinks.length).toBe(1);
    const item5 = screen.getByText("Item Name 5").closest("li");
    expect(item5!.querySelector('a[role="link"][name="Buy"]')).toBeNull();
    expect(item5!.querySelector('[data-testid="insta-link"]')).toBeNull();
  });
  it("renders Save button for each garm", async () => {
    const saveButtons = screen.getAllByRole("button", { name: "Save" });
    expect(saveButtons.length).toBe(5);
  });
});
