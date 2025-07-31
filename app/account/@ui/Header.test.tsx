import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import Header from "./Header";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

describe("Header", () => {
  it("renders the My Account heading", () => {
    vi.mocked(usePathname).mockReturnValue("/account/bookmarks");
    render(<Header />);
    expect(
      screen.getByRole("heading", { name: "My Account" }),
    ).toBeInTheDocument();
  });

  it("shows navigation links when not on my-account page", () => {
    vi.mocked(usePathname).mockReturnValue("/account/bookmarks");
    render(<Header />);
    expect(screen.getByRole("link", { name: "Bookmarks" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "My Wardrobe" }),
    ).toBeInTheDocument();
  });

  it("shows correct content when ON my-account page", () => {
    vi.mocked(usePathname).mockReturnValue("/account/my-account");
    render(<Header />);
    expect(screen.getByRole("link", { name: /MY NEDGE/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Bookmarks" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "My Wardrobe" }),
    ).not.toBeInTheDocument();
  });

  it("all links have correct href attributes", () => {
    vi.mocked(usePathname).mockReturnValue("/account/bookmarks");
    render(<Header />);
    expect(screen.getByRole("link", { name: /ACCOUNT/i })).toHaveAttribute(
      "href",
      "/account/my-account",
    );
    expect(screen.getByRole("link", { name: "Bookmarks" })).toHaveAttribute(
      "href",
      "/account/bookmarks",
    );
    expect(screen.getByRole("link", { name: "My Wardrobe" })).toHaveAttribute(
      "href",
      "/account/my-wardrobe",
    );
  });

  it("renders Arrow components correctly", () => {
    // Test Arrow in ACCOUNT link
    vi.mocked(usePathname).mockReturnValue("/account/bookmarks");
    const { rerender } = render(<Header />);
    expect(
      screen.getByRole("link", { name: /ACCOUNT/i }).querySelector("svg"),
    ).toBeInTheDocument();
    // Test Arrow in MY NEDGE link
    vi.mocked(usePathname).mockReturnValue("/account/my-account");
    rerender(<Header />);
    expect(
      screen.getByRole("link", { name: /MY NEDGE/i }).querySelector("svg"),
    ).toBeInTheDocument();
  });
});
