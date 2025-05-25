import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import AboutSupportersSection from "./AboutSupportersSeciton";

describe("About Supporters Section Component", () => {
  beforeEach(() => {
    render(<AboutSupportersSection />);
  });

  it("should display the main title", () => {
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "About Supporters",
    );
  });
});
