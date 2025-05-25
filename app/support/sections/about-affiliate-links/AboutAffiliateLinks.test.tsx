import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import AboutAffiliateLinks from "./AboutAffiliateLinks";

describe("About Affiliate Links Section Component", () => {
  beforeEach(() => {
    render(<AboutAffiliateLinks />);
  });

  it("should display the main title", () => {
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "About Affiliate Links",
    );
  });

  it("should display a paragraph", () => {
    expect(screen.getByRole("paragraph")).toBeInTheDocument();
  });

  it("should display three profit breakdown items", () => {
    expect(screen.getAllByTestId("profit-breakdown-item")).toHaveLength(3);
  });
});
