import { render, screen } from "@testing-library/react";
import BrandPage from "./page";
import { describe, expect, it, vi, type Mock } from "vitest";

type Shoot = {
  id: number;
  name: string;
  publication_date: string;
  city: { name: string };
  stylist: { name: string; slug: string };
  shoot_style_tags: { name: string; slug: string }[];
  first_image: string;
  slug: string;
  brandItemTypes: string[];
};

type BrandPageData = {
  brand: {
    id: number;
    name: string;
    instagram_url: string | null;
  };
  garments: { id: number }[];
  shoots: Shoot[];
};

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));
vi.mock("next/headers", () => ({
  headers: () => ({
    get: () => "localhost:3000",
  }),
}));

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        brand: {
          id: 1,
          name: "Test Brand",
          instagram_url: "https://instagram.com/test",
        },
        garments: [{ id: 1 }, { id: 2 }, { id: 3 }],
        shoots: [
          {
            id: 5,
            name: "Test Shoot 1",
            publication_date: "2021-01-01",
            city: { name: "Test City" },
            stylist: { name: "Test Stylist", slug: "test-stylist" },
            shoot_style_tags: [
              { name: "Test Style Tag", slug: "test-style-tag" },
              { name: "Test Style Tag 2", slug: "test-style-tag-2" },
            ],
            first_image: "https://test.com/image.jpg",
            slug: "test-shoot-1",
            brandItemTypes: ["Test Item Type 1", "Test Item Type 2"],
          },
          {
            id: 6,
            name: "Test Shoot 2",
            publication_date: "2021-01-02",
            city: { name: "Test City 2" },
            stylist: { name: "Test Stylist 2", slug: "test-stylist-2" },
            shoot_style_tags: [
              { name: "Test Style Tag 3", slug: "test-style-tag-3" },
            ],
            first_image: "https://test.com/image2.jpg",
            slug: "test-shoot-2",
            brandItemTypes: ["Test Item Type 3"],
          },
        ],
      } as BrandPageData),
  } as Response),
) as Mock;

describe("Brand Page", () => {
  it("renders the brand name and counts", async () => {
    const ui = await BrandPage({ params: { brand: "test-brand" } });
    render(ui);
    expect(
      await screen.findByRole("heading", { name: /test brand/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("3 items")).toBeInTheDocument();
    expect(screen.getByText("2 shoots")).toBeInTheDocument();
    const links = screen.getAllByRole("link");
    expect(
      links.some(
        (link) => link.getAttribute("href") === "https://instagram.com/test",
      ),
    ).toBe(true);
  });

  it("renders shoot cards with their names", async () => {
    const ui = await BrandPage({ params: { brand: "test-brand" } });
    const { container } = render(ui);
    expect(container.textContent).toContain("Test Shoot 1");
    expect(container.textContent).toContain("Test Shoot 2");
  });

  it("renders the correct number of shoot cards", async () => {
    const ui = await BrandPage({ params: { brand: "test-brand" } });
    const { getAllByTestId } = render(ui);
    expect(getAllByTestId("shoot-card")).toHaveLength(2);
  });

  it("renders correctly when there are no shoots or garments", async () => {
    (global.fetch as Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            brand: {
              id: 1,
              name: "Empty Brand",
              instagram_url: "https://instagram.com/empty",
            },
            garments: [],
            shoots: [],
          }),
      }),
    );
    const ui = await BrandPage({ params: { brand: "empty-brand" } });
    const { queryAllByTestId, getByText } = render(ui);
    expect(getByText("0 items")).toBeInTheDocument();
    expect(getByText("0 shoots")).toBeInTheDocument();
    expect(queryAllByTestId("shoot-card")).toHaveLength(0);
  });

  it("does not render the Instagram link if instagram_url is missing", async () => {
    (global.fetch as Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            brand: {
              id: 1,
              name: "No Insta Brand",
              instagram_url: null,
            },
            garments: [{ id: 1 }],
            shoots: [],
          }),
      }),
    );
    const ui = await BrandPage({ params: { brand: "no-insta-brand" } });
    const { queryAllByRole } = render(ui);
    const links = queryAllByRole("link");
    expect(
      links.some((link) =>
        link.getAttribute("href")?.includes("instagram.com"),
      ),
    ).toBe(false);
  });
});
