import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import Header from "./Header";

describe("Header", () => {
  it("should be true", () => {
    expect(true).toBe(true);
  });
  beforeEach(() => {
    render(<Header />);
  });
  it("should have a svg logo", () => {
    const logo = screen.getByTestId("logo");
    expect(logo).toBeInTheDocument();
    const svg = logo.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
  it("should have a list of links", () => {
    const nav = screen.getByTestId("nav");
    const links = within(nav).getAllByRole("link");
    expect(links).toHaveLength(4);
    expect(links[0]).toHaveTextContent("LATEST");
    expect(links[0]).toHaveAttribute("href", "/");
    expect(links[1]).toHaveTextContent("STYLES");
    expect(links[1]).toHaveAttribute("href", "/explore");
    expect(links[2]).toHaveTextContent("BRANDS");
    expect(links[2]).toHaveAttribute("href", "/brands");
    expect(links[3]).toHaveTextContent("SUPPORT");
    expect(links[3]).toHaveAttribute("href", "/support");
  });
  it('should have a "MY ACCOUNT" link that points to /account or /login', () => {
    const accountLinks = screen.getAllByRole("link", { name: /my account/i });
    expect(accountLinks.length).toBeGreaterThan(0);
    expect(
      accountLinks.some((link) =>
        ["/account", "/login"].includes(link.getAttribute("href") || ""),
      ),
    ).toBe(true);
  });
  it("should render the HeaderMobile component for mobile navigation", () => {
    expect(screen.getByTestId("header-mobile")).toBeInTheDocument();
  });
  it('should have a logo link that points to "/"', () => {
    const logo = screen.getByTestId("logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("href", "/");
  });
});
