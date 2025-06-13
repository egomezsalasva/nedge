import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { testData } from "./@testData";
vi.mock("./@data", () => ({
  stylesData: testData,
}));
import StyleCategoriesList from "./StyleCategoriesList";

describe("StyleCategoriesList Component", () => {
  it("renders all style categories", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => testData,
    } as any);
    render(<StyleCategoriesList />);
    for (const style of testData) {
      expect(await screen.findByText(style.name)).toBeInTheDocument();
    }
  });
  it("does not render sub-styles by default", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => testData,
    } as any);
    render(<StyleCategoriesList />);
    for (const style of testData) {
      await screen.findByText(style.name);
    }
    for (const style of testData) {
      for (const subStyle of style.subStyles) {
        expect(screen.queryByText(subStyle.name)).not.toBeInTheDocument();
      }
    }
  });

  it("renders sub-styles when category is expanded", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => testData,
    } as any);
    render(<StyleCategoriesList />);
    for (const style of testData) {
      await screen.findByText(style.name);
    }
    for (const style of testData) {
      const button = screen.getByTestId(`style-toggle-${style.name}`);
      fireEvent.click(button);
      for (const subStyle of style.subStyles) {
        expect(await screen.findByText(subStyle.name)).toBeInTheDocument();
      }
      fireEvent.click(button);
      for (const subStyle of style.subStyles) {
        expect(screen.queryByText(subStyle.name)).not.toBeInTheDocument();
      }
    }
  });

  it("renders a button for each style category with correct initial arrow state", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => testData,
    } as any);
    render(<StyleCategoriesList />);
    for (const style of testData) {
      await screen.findByText(style.name);
    }
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(testData.length);
    buttons.forEach((button) => {
      const arrowClosed = within(button).getByTestId("arrow-closed");
      expect(arrowClosed).toBeInTheDocument();
    });
  });
});
