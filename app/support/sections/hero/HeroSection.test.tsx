import { render, screen } from "@testing-library/react";
import HeroSection from "./HeroSection";

describe("Hero Section Component", () => {
  beforeEach(() => {
    render(<HeroSection />);
  });

  it("should display the main title", () => {
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Support Nedge",
    );
  });

  it("should display the subtitle", () => {
    expect(screen.getByText("Help Nedge Stay Alive")).toBeInTheDocument();
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

  it("button is clickable and enabled", () => {
    const button = screen.getByRole("button", { name: "Become a Supporter" });
    expect(button).toBeEnabled();
    expect(button).toBeInTheDocument();
  });
});
