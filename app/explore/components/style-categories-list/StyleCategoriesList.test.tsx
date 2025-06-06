import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { testData } from "./@testData";
vi.mock("./@data", () => ({
  stylesData: testData,
}));
import StyleCategoriesList from "./StyleCategoriesList";

describe("StyleCategoriesList Component", () => {
  beforeEach(() => {
    render(<StyleCategoriesList />);
  });

  it("renders without crashing", () => {
    expect(screen.getAllByRole("list").length).toBeGreaterThan(0);
  });

  it("renders all style categories", () => {
    testData.forEach((style) => {
      expect(screen.getByText(style.name)).toBeInTheDocument();
    });
  });

  it("does not render sub-styles by default", () => {
    testData.forEach((style) => {
      style.subStyles.forEach((subStyle) => {
        expect(screen.queryByText(subStyle)).not.toBeInTheDocument();
      });
    });
  });

  it("renders sub-styles when category is expanded", () => {
    testData.forEach((style) => {
      const button = screen.getByTestId(`style-toggle-${style.name}`);
      fireEvent.click(button);
      style.subStyles.forEach((subStyle) => {
        expect(screen.getByText(subStyle)).toBeInTheDocument();
      });
      fireEvent.click(button);
      style.subStyles.forEach((subStyle) => {
        expect(screen.queryByText(subStyle)).not.toBeInTheDocument();
      });
    });
  });

  it("renders a button for each style category with correct initial arrow state", () => {
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(testData.length);
    buttons.forEach((button) => {
      const arrowClosed = within(button).getByTestId("arrow-closed");
      expect(arrowClosed).toBeInTheDocument();
    });
  });
});
