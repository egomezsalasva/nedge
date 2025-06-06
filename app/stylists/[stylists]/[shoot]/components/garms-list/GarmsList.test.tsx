import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { testData } from "../../@testData";
vi.mock("../../@data", () => ({
  shoots: testData,
}));
import GarmsList from "./GarmsList";

describe("GarmsList Component", async () => {
  let buyLinks: HTMLElement[];
  let instaLinks: HTMLElement[];
  beforeEach(() => {
    render(<GarmsList garmsData={testData[0].items} />);
    buyLinks = screen.getAllByRole("link", { name: "Buy" });
    instaLinks = screen.getAllByTestId("insta-link");
  });
  it("renders the matching shoot's garms", async () => {
    expect(screen.getByTestId("garms-list")).toBeInTheDocument();
  });
  it("renders the correct number of garms", async () => {
    expect(screen.getAllByRole("listitem")).toHaveLength(
      testData[0].items.length,
    );
  });
  it("renders the correct garms", async () => {
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
    expect(screen.getByText("Item 4")).toBeInTheDocument();
  });
  it("renders type, name and brand for each garm", async () => {
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item Name 1")).toBeInTheDocument();
    expect(screen.getByText("Item Brand 1")).toBeInTheDocument();
  });
  it("renders Buy button if affiliateLink exists", async () => {
    expect(buyLinks.length).toBe(2);
    expect(buyLinks[0]).toHaveAttribute("href", "https://www.brand.com/item-1");
    expect(buyLinks[1]).toHaveAttribute(
      "href",
      "https://www.brand-3.com/item-3",
    );
  });
  it("renders Insta button if it exists and no affiliateLink", async () => {
    expect(instaLinks.length).toBe(1);
    expect(instaLinks[0]).toHaveAttribute(
      "href",
      "https://www.instagram.com/item-2",
    );
  });
  it("renders nothing if no affiliateLink or instaLink", async () => {
    expect(instaLinks.length).toBe(1);
    expect(buyLinks.length).toBe(2);
  });
  it("renders Save button for each garm", async () => {
    const saveButtons = screen.getAllByRole("button", { name: "Save" });
    expect(saveButtons.length).toBe(4);
  });
});
