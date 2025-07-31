import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import { useRouter, useSearchParams } from "next/navigation";
import ExploreContent from "./ExploreContent";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock("./components", () => ({
  StyleCategoriesList: () => (
    <div data-testid="style-categories-list">Style Categories List</div>
  ),
  StyleShootsList: ({ subStyle }: { subStyle: string }) => (
    <div data-testid="style-shoots-list">Style Shoots List: {subStyle}</div>
  ),
}));

vi.mock("../svgs", () => ({
  Arrow: () => <svg data-testid="arrow-icon">Arrow</svg>,
}));

describe("ExploreContent", () => {
  const mockPush = vi.fn();
  const mockBack = vi.fn();
  const mockRouter = {
    push: mockPush,
    back: mockBack,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue(mockRouter);
  });

  it("renders explore styles heading and categories list when no substyle is selected", () => {
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    });
    render(<ExploreContent />);
    expect(screen.getByText("Explore Styles")).toBeInTheDocument();
    expect(screen.getByTestId("style-categories-list")).toBeInTheDocument();
    expect(screen.queryByTestId("style-shoots-list")).not.toBeInTheDocument();
    expect(screen.queryByTestId("arrow-icon")).not.toBeInTheDocument();
  });

  it("renders substyle heading, back button and shoots list when substyle is selected", () => {
    const mockSubstyle = "minimalist";
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue(mockSubstyle),
    });
    render(<ExploreContent />);
    expect(screen.getByText("Explore Styles")).toBeInTheDocument();
    expect(screen.getByText(`[${mockSubstyle}]`)).toBeInTheDocument();
    expect(screen.getByTestId("arrow-icon")).toBeInTheDocument();
    expect(screen.getByTestId("style-shoots-list")).toBeInTheDocument();
    expect(
      screen.getByText(`Style Shoots List: ${mockSubstyle}`),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("style-categories-list"),
    ).not.toBeInTheDocument();
  });

  it("calls router.back when back button is clicked", async () => {
    const mockSubstyle = "urban";
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue(mockSubstyle),
    });
    render(<ExploreContent />);
    const backButton = screen.getByRole("button");
    await backButton.click();
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("handles empty substyle parameter correctly", () => {
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue(""),
    });
    render(<ExploreContent />);
    expect(screen.getByText("Explore Styles")).toBeInTheDocument();
    expect(screen.getByTestId("style-categories-list")).toBeInTheDocument();
    expect(screen.queryByTestId("style-shoots-list")).not.toBeInTheDocument();
    expect(screen.queryByTestId("arrow-icon")).not.toBeInTheDocument();
    expect(screen.queryByText("[]")).not.toBeInTheDocument();
  });

  it("passes correct substyle prop to StyleShootsList", () => {
    const testSubstyle = "bohemian-chic";
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue(testSubstyle),
    });
    render(<ExploreContent />);
    expect(
      screen.getByText(`Style Shoots List: ${testSubstyle}`),
    ).toBeInTheDocument();
  });

  it("renders main container with correct structure", () => {
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    });
    const { container } = render(<ExploreContent />);
    const mainElement = container.querySelector("main");
    expect(mainElement).toBeInTheDocument();
    const headerElement = container.querySelector('div[class*="header"]');
    expect(headerElement).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Explore Styles" }),
    ).toBeInTheDocument();
  });

  it("queries search params for 'substyle' parameter", () => {
    const mockGet = vi.fn().mockReturnValue("test-style");
    (useSearchParams as Mock).mockReturnValue({
      get: mockGet,
    });
    render(<ExploreContent />);
    expect(mockGet).toHaveBeenCalledWith("substyle");
  });

  it("does not render back button when no substyle is selected", () => {
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue(null),
    });
    render(<ExploreContent />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders substyle in brackets with correct formatting", () => {
    const testSubstyles = ["urban", "minimalist", "bohemian-chic", "vintage"];

    testSubstyles.forEach((substyle) => {
      vi.clearAllMocks();
      (useSearchParams as Mock).mockReturnValue({
        get: vi.fn().mockReturnValue(substyle),
      });
      const { unmount } = render(<ExploreContent />);
      expect(screen.getByText(`[${substyle}]`)).toBeInTheDocument();
      unmount();
    });
  });
});
