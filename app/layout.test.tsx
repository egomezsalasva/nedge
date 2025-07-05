import { render } from "@testing-library/react";
import RootLayout from "./layout";

vi.mock("@/app/ui", () => ({
  Header: () => <header data-testid="header" />,
}));
vi.mock("next/font/local", () => ({
  default: () => ({
    className: "mock-font-class",
  }),
}));

describe("RootLayout", () => {
  beforeEach(() => {
    render(
      <RootLayout>
        <div data-testid="child" />
      </RootLayout>,
    );
  });

  it("renders the header and children inside the body", () => {
    const body = document.querySelector("body");
    expect(body?.querySelector("[data-testid='header']")).toBeInTheDocument();
    expect(body?.querySelector("[data-testid='child']")).toBeInTheDocument();
  });

  it("applies the custom font class and lang attribute to the html element", () => {
    const html = document.querySelector("html");
    expect(html).toHaveClass("mock-font-class");
    expect(html).toHaveAttribute("lang", "en");
  });
});
