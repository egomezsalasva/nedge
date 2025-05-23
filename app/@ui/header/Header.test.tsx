import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import Header from "./Header";

describe("Header", () => {
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
    expect(links).toHaveLength(5);
    expect(links[0]).toHaveTextContent("LATEST");
    expect(links[0]).toHaveAttribute("href", "/");
    expect(links[1]).toHaveTextContent("STYLES");
    expect(links[1]).toHaveAttribute("href", "/explore");
    expect(links[2]).toHaveTextContent("BRANDS");
    expect(links[2]).toHaveAttribute("href", "/brands");
    expect(links[3]).toHaveTextContent("EVENTS");
    expect(links[3]).toHaveAttribute("href", "/events");
    expect(links[4]).toHaveTextContent("SUPPORT");
    expect(links[4]).toHaveAttribute("href", "/support-styleista");
  });
  it("should have a link to my account", () => {
    const link = screen.getByText("MY ACCOUNT");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/my-account");
  });
});
