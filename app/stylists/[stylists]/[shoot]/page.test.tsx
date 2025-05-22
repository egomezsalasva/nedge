import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { testData } from "./@testData";
vi.mock("./components", () => ({
  GarmsList: () => <div>GarmsList</div>,
  ShootDetails: () => <div>ShootDetails</div>,
  SlideshowHero: () => <div>SlideshowHero</div>,
}));
vi.mock("../../../@data", () => ({
  shoots: testData,
}));
vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));
import Shoot from "./page";
import { notFound } from "next/navigation";

describe("Shoot Page Component", async () => {
  let params: Promise<{ stylists: string; shoot: string }>;
  it("renders shoot details for valid params", async () => {
    params = Promise.resolve({
      stylists: "stylist-1",
      shoot: "test-shoot-1",
    });
    render(await Shoot({ params }));
    expect(await screen.findByRole("main")).toBeInTheDocument();
  });
  it("matches shoot regardless of case and dashes", async () => {
    const params = Promise.resolve({
      stylists: "STYLIST-1",
      shoot: "TEST-SHOOT-1",
    });
    render(await Shoot({ params }));
    expect(await screen.findByRole("main")).toBeInTheDocument();
  });
  it("calls notFound for invalid params", async () => {
    (notFound as any).mockImplementation(() => {
      throw new Error("NEXT_NOT_FOUND");
    });
    const params = Promise.resolve({
      stylists: "non-existent-stylist",
      shoot: "non-existent-shoot",
    });
    await expect(Shoot({ params })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });
});
