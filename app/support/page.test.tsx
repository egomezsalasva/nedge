import { render, screen } from "@testing-library/react";
import SupportPage from "./page";

vi.mock("./sections", () => ({
  HeroSection: () => <div data-testid="hero-section" />,
  AboutSupportersSection: () => <div data-testid="about-supporters-section" />,
  AboutAffiliateLinksSection: () => (
    <div data-testid="about-affiliate-links-section" />
  ),
}));

describe("SupportPage", () => {
  it("renders the support page", () => {
    render(<SupportPage />);
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
  });
  it("renders all three main sections", () => {
    render(<SupportPage />);
    expect(screen.getByTestId("hero-section")).toBeInTheDocument();
    expect(screen.getByTestId("about-supporters-section")).toBeInTheDocument();
    expect(
      screen.getByTestId("about-affiliate-links-section"),
    ).toBeInTheDocument();
  });
});
