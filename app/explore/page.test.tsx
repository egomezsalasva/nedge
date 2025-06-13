import { render, screen } from "@testing-library/react";
import Explore from "./page";
import { describe, expect, it, vi } from "vitest";
const backMock = vi.fn();
const getMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ back: backMock }),
  useSearchParams: () => ({ get: getMock }),
}));
vi.mock("./components", () => ({
  StyleCategoriesList: () => <div data-testid="categories-list" />,
  StyleShootsList: () => <div data-testid="shoots-list" />,
}));

describe("Styles page", () => {
  it("renders the main header", () => {
    render(<Explore />);
    expect(screen.getByText("Explore Styles")).toBeInTheDocument();
  });
  it("renders StyleCategoriesList when no substyle param", () => {
    render(<Explore />);
    expect(screen.getByTestId("categories-list")).toBeInTheDocument();
  });
  it("calls router.back when back button is clicked", () => {
    backMock.mockClear();
    getMock.mockImplementation((key: string) =>
      key === "substyle" ? "urban" : null,
    );
    render(<Explore />);
    const backButton = screen.getByRole("button");
    backButton.click();
    expect(backMock).toHaveBeenCalled();
  });
  it("renders StyleShootsList when substyle param is present", () => {
    getMock.mockImplementation((key: string) =>
      key === "substyle" ? "urban" : null,
    );
    render(<Explore />);
    expect(screen.getByTestId("shoots-list")).toBeInTheDocument();
  });
  it("renders both the main header and categories list when no substyle param", () => {
    getMock.mockImplementation(() => null);
    render(<Explore />);
    expect(screen.getByText("Explore Styles")).toBeInTheDocument();
    expect(screen.getByTestId("categories-list")).toBeInTheDocument();
  });
  it("does not render StyleCategoriesList when substyle param is present", () => {
    getMock.mockImplementation((key: string) =>
      key === "substyle" ? "urban" : null,
    );
    render(<Explore />);
    expect(screen.queryByTestId("categories-list")).not.toBeInTheDocument();
  });
  it("does not render StyleShootsList when no substyle param is present", () => {
    getMock.mockImplementation(() => null);
    render(<Explore />);
    expect(screen.queryByTestId("shoots-list")).not.toBeInTheDocument();
  });
  it("does not render the back button when no substyle param is present", () => {
    getMock.mockImplementation(() => null);
    render(<Explore />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
  it("renders the back button when substyle param is present", () => {
    getMock.mockImplementation((key: string) =>
      key === "substyle" ? "urban" : null,
    );
    render(<Explore />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
