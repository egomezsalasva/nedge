import { render, screen } from "@testing-library/react";
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from "vitest";
import { testSbShootsData } from "../../../testSbShootsData";

vi.mock("next/headers", () => ({
  headers: vi.fn(() => ({
    get: vi.fn((key) => {
      if (key === "host") return "localhost:3000";
      return undefined;
    }),
  })),
}));
vi.mock("./components", () => ({
  GarmsList: () => <div>GarmsList</div>,
  ShootDetails: () => <div>ShootDetails</div>,
  SlideshowHero: () => <div>SlideshowHero</div>,
}));
vi.mock("../../../@data", () => ({
  shoots: testSbShootsData,
}));
vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));
import Shoot from "./page";
import { notFound } from "next/navigation";

beforeAll(() => {
  global.fetch = vi.fn(
    async () =>
      ({
        ok: true,
        json: async () => testSbShootsData[0],
      }) as Response,
  );
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe("Shoot Page Component", () => {
  it("renders shoot details for valid params", async () => {
    const params = Promise.resolve({ stylists: "stylist-1", shoot: "shoot-1" });
    render(await Shoot({ params }));
    expect(await screen.findByRole("main")).toBeInTheDocument();
  });
  it("matches shoot regardless of case and dashes", async () => {
    const params = Promise.resolve({
      stylists: "STYLIST-1",
      shoot: "SHOOT-1",
    });
    render(await Shoot({ params }));
    expect(await screen.findByRole("main")).toBeInTheDocument();
  });
  it("calls notFound for invalid params", async () => {
    vi.mocked(notFound).mockImplementation(() => {
      throw new Error("NEXT_NOT_FOUND");
    });
    (global.fetch as Mock).mockImplementationOnce(
      async () =>
        ({
          ok: false,
          status: 404,
        }) as Response,
    );
    const params = Promise.resolve({
      stylists: "non-existent-stylist",
      shoot: "non-existent-shoot",
    });
    await expect(Shoot({ params })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });
});
