import { describe, expect, it } from "vitest";
import { testShootsData } from "@/app/@testShootsData";
import { getBrandItemsType } from "./getBrandItemsType";
import { shoots } from "@/app/@data";

describe("getBrandItemsType", () => {
  it("should return unique item types for a given brand", () => {
    const firstShoot = testShootsData[0];
    const result = getBrandItemsType(firstShoot, "Test Brand 1");
    expect(result).toEqual(["Item Type 1", "Item Type 4"]);
    expect(result).toHaveLength(2);
    expect(result).not.toContain("Item Type 2");
    expect(result).not.toContain("Item Type 3");
  });

  it("should remove duplicate types and return unique types only", () => {
    const shootWithDuplicates = {
      ...testShootsData[2],
      items: [
        { id: 1, name: "Item 1", brand: "Test Brand 1", type: "T-shirt" },
        { id: 2, name: "Item 2", brand: "Test Brand 1", type: "T-shirt" },
        { id: 3, name: "Item 3", brand: "Test Brand 1", type: "Shoes" },
      ],
    };
    const result = getBrandItemsType(shootWithDuplicates, "Test Brand 1");
    expect(result).toEqual(["T-shirt", "Shoes"]);
    expect(result).toHaveLength(2);
    expect(new Set(result)).toEqual(new Set(["T-shirt", "Shoes"])); // Verify uniqueness
  });

  it("should return empty array when shoot has no items", () => {
    const shootWithoutItems = {
      ...testShootsData[0],
      items: undefined,
    };
    const result = getBrandItemsType(shootWithoutItems, "Test Brand 1");
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it("should return empty array when shoot has empty items array", () => {
    const shootWithEmptyItems = {
      ...testShootsData[0],
      items: [],
    };
    const result = getBrandItemsType(shootWithEmptyItems, "Test Brand 1");
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it("should return empty array when brand is not found", () => {
    const shoot = testShootsData[0];
    const result = getBrandItemsType(shoot, "Non-existent Brand");
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it("should return empty array when brand is empty string", () => {
    const shoot = testShootsData[0];
    const result = getBrandItemsType(shoot, "");
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it("should handle null/undefined parameters gracefully", () => {
    expect(getBrandItemsType(undefined as any, "Test Brand 1")).toEqual([]);
    expect(getBrandItemsType(testShootsData[0], null as any)).toEqual([]);
    expect(getBrandItemsType(testShootsData[0], undefined as any)).toEqual([]);
    expect(getBrandItemsType(testShootsData[0], "")).toEqual([]);
  });

  it("should return all types when all items are from target brand", () => {
    const shootAllSameBrand = {
      ...testShootsData[0],
      items: [
        { id: 1, name: "Item 1", brand: "Same Brand", type: "Shirt" },
        { id: 2, name: "Item 2", brand: "Same Brand", type: "Pants" },
        { id: 3, name: "Item 3", brand: "Same Brand", type: "Shoes" },
      ],
    };
    const result = getBrandItemsType(shootAllSameBrand, "Same Brand");
    expect(result).toEqual(["Shirt", "Pants", "Shoes"]);
    expect(result).toHaveLength(3);
  });
});
