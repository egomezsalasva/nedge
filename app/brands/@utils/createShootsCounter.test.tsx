import { describe, expect, it } from "vitest";
import { createShootsCounter } from "./createShootsCounter";
import { testShootsData } from "@/app/@testShootsData";
import { testBrandsData } from "../@testBrandsData";

describe("createShootsCounter", () => {
  it("should count shoots correctly for Test Brand 1", () => {
    const counter = createShootsCounter(testBrandsData, testShootsData);
    expect(counter("Test Brand 1")).toBe(3);
  });
  it("should count shoots correctly for Test Brand 2", () => {
    const counter = createShootsCounter(testBrandsData, testShootsData);
    expect(counter("Test Brand 2")).toBe(3);
  });

  it("should count shoots correctly for Test Brand 3", () => {
    const counter = createShootsCounter(testBrandsData, testShootsData);
    expect(counter("Test Brand 3")).toBe(3);
  });

  it("should count shoots correctly for Test Brand 4", () => {
    const counter = createShootsCounter(testBrandsData, testShootsData);
    expect(counter("Test Brand 4")).toBe(1);
  });
  it("should return 0 for a brand that exists but has no shoots", () => {
    const brandsWithUnusedBrand = {
      ...testBrandsData,
      UnusedBrand: {
        name: "Unused Brand",
        slug: "unused-brand",
        instagram: "https://www.instagram.com/unused-brand/",
      },
    };
    const counter = createShootsCounter(brandsWithUnusedBrand, testShootsData);
    expect(counter("UnusedBrand")).toBe(0);
  });

  it("should handle empty shoots array", () => {
    const counter = createShootsCounter(testBrandsData, []);
    expect(counter("Test Brand 1")).toBe(0);
  });

  it("should handle shoots without items property", () => {
    const shootsWithoutItems = [
      {
        imgs: ["/test.png"],
        details: {
          city: "Test",
          date: "01/01/25",
          title: "Test",
          stylist: "Test",
          tags: [],
          description: "Test",
        },
      },
    ];
    const counter = createShootsCounter(testBrandsData, shootsWithoutItems);
    expect(counter("Test Brand 1")).toBe(0);
  });

  it("should handle shoots with empty items array", () => {
    const shootsWithEmptyItems = [
      {
        imgs: ["/test.png"],
        details: {
          city: "Test",
          date: "01/01/25",
          title: "Test",
          stylist: "Test",
          tags: [],
          description: "Test",
        },
        items: [],
      },
      testShootsData[0],
    ];
    const counter = createShootsCounter(testBrandsData, shootsWithEmptyItems);
    expect(counter("Test Brand 1")).toBe(1);
  });
  it("should handle items without brand property", () => {
    const shootsWithItemsWithoutBrand = [
      {
        imgs: ["/test.png"],
        details: {
          city: "Test",
          date: "01/01/25",
          title: "Test",
          stylist: "Test",
          tags: [],
          description: "Test",
        },
        items: [
          { id: 1, name: "Unnamed item", type: "test" },
          {
            id: 2,
            name: "Item with brand",
            brand: "Test Brand 1",
            type: "test",
          },
        ],
      },
    ];
    const counter = createShootsCounter(
      testBrandsData,
      shootsWithItemsWithoutBrand,
    );
    expect(counter("Test Brand 1")).toBe(1);
  });

  it("should return a function when called", () => {
    const counter = createShootsCounter(testBrandsData, testShootsData);
    expect(typeof counter).toBe("function");
  });

  it("should be reusable with different brand names", () => {
    const counter = createShootsCounter(testBrandsData, testShootsData);
    expect(counter("Test Brand 1")).toBe(3);
    expect(counter("Test Brand 2")).toBe(3);
    expect(counter("Test Brand 3")).toBe(3);
  });

  it("should handle case-sensitive brand matching", () => {
    const shootsWithDifferentCase = [
      {
        imgs: ["/test.png"],
        details: {
          city: "Test",
          date: "01/01/25",
          title: "Test",
          stylist: "Test",
          tags: [],
          description: "Test",
        },
        items: [
          { id: 1, name: "Item", brand: "test brand 1", type: "test" },
          { id: 2, name: "Item", brand: "Test Brand 1", type: "test" },
        ],
      },
    ];
    const counter = createShootsCounter(
      testBrandsData,
      shootsWithDifferentCase,
    );
    expect(counter("Test Brand 1")).toBe(1);
  });

  it("should handle null/undefined brand values in items", () => {
    const shootsWithNullBrands = [
      {
        imgs: ["/test.png"],
        details: {
          city: "Test",
          date: "01/01/25",
          title: "Test",
          stylist: "Test",
          tags: [],
          description: "Test",
        },
        items: [
          { id: 1, brand: null, name: "Item 1", type: "test" },
          { id: 2, brand: undefined, name: "Item 2", type: "test" },
          { id: 3, brand: "Test Brand 1", name: "Item 3", type: "test" },
        ],
      },
    ];
    const counter = createShootsCounter(testBrandsData, shootsWithNullBrands);
    expect(counter("Test Brand 1")).toBe(1);
  });

  it("should count each shoot only once regardless of multiple items from same brand", () => {
    const shootsWithMultipleBrandItems = [
      {
        imgs: ["/test.png"],
        details: {
          city: "Test",
          date: "01/01/25",
          title: "Test",
          stylist: "Test",
          tags: [],
          description: "Test",
        },
        items: [
          { id: 1, brand: "Test Brand 1", name: "Item 1", type: "test" },
          { id: 2, brand: "Test Brand 1", name: "Item 2", type: "test" },
          { id: 3, brand: "Test Brand 1", name: "Item 3", type: "test" },
          { id: 4, brand: "Other Brand", name: "Item 4", type: "test" },
        ],
      },
    ];
    const counter = createShootsCounter(
      testBrandsData,
      shootsWithMultipleBrandItems,
    );
    expect(counter("Test Brand 1")).toBe(1);
  });
});
