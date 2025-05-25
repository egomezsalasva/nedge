import { render, screen } from "@testing-library/react";
import HeroSection from "./HeroSection";
import { beforeEach, describe, expect, it } from "vitest";

describe("Hero Section Component", () => {
  let container: HTMLElement;
  beforeEach(() => {
    const renderResult = render(<HeroSection />);
    container = renderResult.container;
  });

  it("should display the main title", () => {
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Support Nedge",
    );
  });

  it("should display the subtitle", () => {
    expect(screen.getByText("Help Nedge Stay Alive")).toBeInTheDocument();
  });

  it("displays all benefit list items", () => {
    const benefits = [
      "Save garments from the shoots to your wardrobe",
      "Unlimited shoot bookmarks",
      "Get a discount code on buy links",
      "Become a Supporter Stylist",
    ];
    benefits.forEach((benefit) => {
      expect(screen.getByText(benefit)).toBeInTheDocument();
    });
  });

  it("displays the pricing information", () => {
    expect(screen.getByText("From")).toBeInTheDocument();
    expect(screen.getByText("€ 2.95")).toBeInTheDocument();
    expect(screen.getByText("/ month")).toBeInTheDocument();
  });

  it("displays the call-to-action button", () => {
    expect(
      screen.getByRole("button", { name: "Become a Supporter" }),
    ).toBeInTheDocument();
  });

  it("has proper semantic structure", () => {
    expect(container.querySelector("section")).toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
  });

  it("button is clickable and enabled", () => {
    const button = screen.getByRole("button", { name: "Become a Supporter" });
    expect(button).toBeEnabled();
    expect(button).toBeInTheDocument();
  });
});
