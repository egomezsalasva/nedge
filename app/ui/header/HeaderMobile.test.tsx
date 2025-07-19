import { render, screen } from "@testing-library/react";
import HeaderMobile from "./HeaderMobile";

describe("HeaderMobile", () => {
  it("renders hamburger menu button", () => {
    render(<HeaderMobile />);
    const hamburger = screen.getByRole("button", { name: /open mobile menu/i });
    expect(hamburger).toBeInTheDocument();
  });
  it("menu is closed by default", () => {
    render(<HeaderMobile />);
    const closedMenu = document.querySelector('[class*="navContainer_closed"]');
    expect(closedMenu).toBeInTheDocument();
  });
  it("shows menu items when hamburger is clicked", () => {
    render(<HeaderMobile />);
    const hamburger = screen.getByRole("button", { name: /open mobile menu/i });
    hamburger.click();
    expect(screen.getByText("LATEST")).toBeInTheDocument();
    expect(screen.getByText("STYLES")).toBeInTheDocument();
    expect(screen.getByText("BRANDS")).toBeInTheDocument();
    expect(screen.getByText("SUPPORT")).toBeInTheDocument();
    expect(screen.getByText("MY ACCOUNT")).toBeInTheDocument();
  });
  it("closes the menu when a link is clicked", async () => {
    render(<HeaderMobile />);
    const hamburger = screen.getByRole("button", { name: /open mobile menu/i });
    hamburger.click();
    const latestLink = screen.getByText("LATEST");
    latestLink.click();
    await new Promise((r) => setTimeout(r, 250));
    const closedMenu = document.querySelector('[class*="navContainer_closed"]');
    expect(closedMenu).toBeInTheDocument();
  });
  it('should have a "MY ACCOUNT" link that points to /account or /login', () => {
    render(<HeaderMobile />);
    const hamburger = screen.getByRole("button", { name: /open mobile menu/i });
    hamburger.click();
    const accountLink = screen.getByRole("link", { name: /my account/i });
    expect(accountLink).toBeInTheDocument();
    expect(["/account", "/login"]).toContain(accountLink.getAttribute("href"));
  });
  it("all navigation links have correct hrefs", () => {
    render(<HeaderMobile />);
    const hamburger = screen.getByRole("button", { name: /open mobile menu/i });
    hamburger.click();
    expect(screen.getByRole("link", { name: /latest/i })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: /styles/i })).toHaveAttribute(
      "href",
      "/explore",
    );
    expect(screen.getByRole("link", { name: /brands/i })).toHaveAttribute(
      "href",
      "/brands",
    );
    expect(screen.getByRole("link", { name: /support/i })).toHaveAttribute(
      "href",
      "/support",
    );
  });
  it("closes the menu when hamburger is clicked again", () => {
    render(<HeaderMobile />);
    const hamburger = screen.getByRole("button", { name: /open mobile menu/i });
    hamburger.click();
    hamburger.click();
    const closedMenu = document.querySelector('[class*="navContainer_closed"]');
    expect(closedMenu).toBeInTheDocument();
  });
});
