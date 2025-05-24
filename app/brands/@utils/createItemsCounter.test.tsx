import { describe, it, expect } from "vitest";
import { createItemsCounter } from "./createItemsCounter";
import { testBrandsData } from "../@testBrandsData";
import { testShootsData } from "../../@testShootsData";

describe("createItemsCounter", () => {
  it("should correctly count items for a brand that exists in shoots", () => {
    const itemsCounter = createItemsCounter(testBrandsData, testShootsData);
    const testBrand1Count = itemsCounter("Test Brand 1");
    expect(testBrand1Count).toBe(6);
  });

  it("should correctly count items for multiple different brands", () => {
    const itemsCounter = createItemsCounter(testBrandsData, testShootsData);
    const testBrand1Count = itemsCounter("Test Brand 1");
    const testBrand2Count = itemsCounter("Test Brand 2");
    const testBrand3Count = itemsCounter("Test Brand 3");
    const testBrand4Count = itemsCounter("Test Brand 4");
    expect(testBrand1Count).toBe(6);
    expect(testBrand2Count).toBe(3);
    expect(testBrand3Count).toBe(3);
    expect(testBrand4Count).toBe(1);
  });

  it("should return 0 when shoots array is empty", () => {
    const emptyShoots: any[] = [];
    const itemsCounter = createItemsCounter(testBrandsData, emptyShoots);
    const testBrand1Count = itemsCounter("Test Brand 1");
    expect(testBrand1Count).toBe(0);
  });

  it("should return 0 when brand does not exist in brands object", () => {
    const emptyBrands = {};
    const itemsCounter = createItemsCounter(emptyBrands, testShootsData);
    const result = itemsCounter("Test Brand 1");
    expect(result).toBe(0);
  });

  it("should return 0 for a brand that exists but has no items in any shoot", () => {
    const brandsWithUnusedBrand = {
      ...testBrandsData,
      "Unused Brand": {
        name: "Unused Brand",
        slug: "unused-brand",
        instagram: "https://www.instagram.com/unused-brand/",
      },
    };
    const itemsCounter = createItemsCounter(
      brandsWithUnusedBrand,
      testShootsData,
    );
    const unusedBrandCount = itemsCounter("Unused Brand");
    expect(unusedBrandCount).toBe(0);
  });

  it("should handle shoots with no items property or empty items array", () => {
    const shootsWithNoItems = [
      {
        imgs: ["/test-img-1.png"],
        details: {
          city: "Test City",
          date: "19/05/25",
          title: "Test Title",
          stylist: "Test Stylist",
          tags: ["Tag1"],
          description: "Test Description",
        },
      },
      {
        imgs: ["/test-img-2.png"],
        details: {
          city: "Test City 2",
          date: "19/05/25",
          title: "Test Title 2",
          stylist: "Test Stylist 2",
          tags: ["Tag2"],
          description: "Test Description 2",
        },
        items: [],
      },
    ];
    const itemsCounter = createItemsCounter(testBrandsData, shootsWithNoItems);
    const testBrand1Count = itemsCounter("Test Brand 1");
    expect(testBrand1Count).toBe(0);
  });

  it("should return 0 for invalid/non-existent brand name", () => {
    const itemsCounter = createItemsCounter(testBrandsData, testShootsData);
    const invalidBrandCount = itemsCounter("Non Existent Brand");
    expect(invalidBrandCount).toBe(0);
  });

  it("should return 0 when shoots is null or undefined", () => {
    const itemsCounterWithNull = createItemsCounter(testBrandsData, null);
    const nullResult = itemsCounterWithNull("Test Brand 1");
    expect(nullResult).toBe(0);
    const itemsCounterWithUndefined = createItemsCounter(
      testBrandsData,
      undefined,
    );
    const undefinedResult = itemsCounterWithUndefined("Test Brand 1");
    expect(undefinedResult).toBe(0);
  });

  it("should return 0 when brands is null or undefined", () => {
    const itemsCounterWithNull = createItemsCounter(null, testShootsData);
    const nullResult = itemsCounterWithNull("Test Brand 1");
    expect(nullResult).toBe(0);
    const itemsCounterWithUndefined = createItemsCounter(
      undefined,
      testShootsData,
    );
    const undefinedResult = itemsCounterWithUndefined("Test Brand 1");
    expect(undefinedResult).toBe(0);
  });

  it("should handle items without brand property", () => {
    const shootsWithItemsWithoutBrand = [
      {
        imgs: ["/test-img-1.png"],
        details: {
          city: "Test City",
          date: "19/05/25",
          title: "Test Title",
          stylist: "Test Stylist",
          tags: ["Tag1"],
          description: "Test Description",
        },
        items: [
          {
            id: 1,
            name: "Item without brand",
            type: "Some Type",
          },
          {
            id: 2,
            name: "Item with brand",
            brand: "Test Brand 1",
            type: "Some Type",
          },
        ],
      },
    ];
    const itemsCounter = createItemsCounter(
      testBrandsData,
      shootsWithItemsWithoutBrand,
    );
    const testBrand1Count = itemsCounter("Test Brand 1");
    expect(testBrand1Count).toBe(1);
  });

  it("should handle case sensitivity in brand matching", () => {
    const shootsWithMixedCase = [
      {
        imgs: ["/test-img-1.png"],
        details: {
          city: "Test City",
          date: "19/05/25",
          title: "Test Title",
          stylist: "Test Stylist",
          tags: ["Tag1"],
          description: "Test Description",
        },
        items: [
          {
            id: 1,
            name: "Item with exact case",
            brand: "Test Brand 1",
            type: "Some Type",
          },
          {
            id: 2,
            name: "Item with different case",
            brand: "test brand 1",
            type: "Some Type",
          },
          {
            id: 3,
            name: "Item with upper case",
            brand: "TEST BRAND 1",
            type: "Some Type",
          },
        ],
      },
    ];
    const itemsCounter = createItemsCounter(
      testBrandsData,
      shootsWithMixedCase,
    );
    const testBrand1Count = itemsCounter("Test Brand 1");
    expect(testBrand1Count).toBe(1);
  });

  it("should handle items with different structures and properties", () => {
    // Arrange
    const shootsWithDifferentItemStructures = [
      {
        imgs: ["/test-img-1.png"],
        details: {
          city: "Test City",
          date: "19/05/25",
          title: "Test Title",
          stylist: "Test Stylist",
          tags: ["Tag1"],
          description: "Test Description",
        },
        items: [
          {
            brand: "Test Brand 1",
          },
          {
            id: 1,
            name: "Standard Item",
            brand: "Test Brand 1",
            type: "Some Type",
          },
          {
            id: 2,
            name: "Extended Item",
            brand: "Test Brand 1",
            type: "Some Type",
            description: "Extended description",
            inStock: true,
          },
        ],
      },
    ];
    const itemsCounter = createItemsCounter(
      testBrandsData,
      shootsWithDifferentItemStructures,
    );
    const testBrand1Count = itemsCounter("Test Brand 1");
    expect(testBrand1Count).toBe(3);
  });

  it("should handle large datasets efficiently", () => {
    const largeShoots = Array.from({ length: 100 }, (_, shootIndex) => ({
      imgs: [`/test-img-${shootIndex}.png`],
      details: {
        city: `Test City ${shootIndex}`,
        date: "19/05/25",
        title: `Test Title ${shootIndex}`,
        stylist: `Test Stylist ${shootIndex}`,
        tags: [`Tag${shootIndex}`],
        description: `Test Description ${shootIndex}`,
      },
      items: Array.from({ length: 50 }, (_, itemIndex) => ({
        id: shootIndex * 50 + itemIndex,
        name: `Item ${itemIndex}`,
        brand: "Test Brand 1",
        type: `Type ${itemIndex}`,
      })),
    }));
    const start = performance.now();
    const itemsCounter = createItemsCounter(testBrandsData, largeShoots);
    const testBrand1Count = itemsCounter("Test Brand 1");
    const end = performance.now();
    expect(testBrand1Count).toBe(5000);
    expect(end - start).toBeLessThan(1); // Should complete in less than 1 milisecond
  });

  it("should always return a number", () => {
    const itemsCounter = createItemsCounter(testBrandsData, testShootsData);
    const validBrandResult = itemsCounter("Test Brand 1");
    const invalidBrandResult = itemsCounter("Non Existent Brand");
    const emptyStringResult = itemsCounter("");
    expect(typeof validBrandResult).toBe("number");
    expect(typeof invalidBrandResult).toBe("number");
    expect(typeof emptyStringResult).toBe("number");
    expect(validBrandResult).toBeGreaterThanOrEqual(0);
    expect(invalidBrandResult).toBeGreaterThanOrEqual(0);
    expect(emptyStringResult).toBeGreaterThanOrEqual(0);
  });
});
