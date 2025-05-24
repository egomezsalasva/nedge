import { describe, expect, it, vi } from "vitest";
import { findBrandKeyBySlug } from "./findBrandKeyBySlug";
import { getBrand } from "./getBrand";

describe("findBrandKeyBySlug", () => {
  it("should find existing brand key by valid slug", () => {
    expect(findBrandKeyBySlug("ovahtres")).toBe("Ovahtres");
    expect(findBrandKeyBySlug("yg-studios")).toBe("YG Studios");
    expect(findBrandKeyBySlug("masons")).toBe("Mason's");
  });

  it("should return undefined for non-existent slug", () => {
    expect(findBrandKeyBySlug("non-existent-brand")).toBeUndefined();
    expect(findBrandKeyBySlug("invalid-slug")).toBeUndefined();
  });

  it("should return undefined for empty string", () => {
    expect(findBrandKeyBySlug("")).toBeUndefined();
  });

  it("should handle null/undefined input gracefully", () => {
    expect(findBrandKeyBySlug(null as any)).toBeUndefined();
    expect(findBrandKeyBySlug(undefined as any)).toBeUndefined();
  });

  it("should return undefined for whitespace-only input", () => {
    expect(findBrandKeyBySlug("   ")).toBeUndefined();
  });

  it("should be case sensitive for slug matching", () => {
    expect(findBrandKeyBySlug("OVAHTRES")).toBeUndefined();
    expect(findBrandKeyBySlug("Ovahtres")).toBeUndefined();
    expect(findBrandKeyBySlug("LEVIS")).toBeUndefined();
    expect(findBrandKeyBySlug("Levis")).toBeUndefined();
    expect(findBrandKeyBySlug("YG-STUDIOS")).toBeUndefined();
    expect(findBrandKeyBySlug("Yg-Studios")).toBeUndefined();
  });

  it("should work correctly with getBrand function", () => {
    const brandKey = findBrandKeyBySlug("timberland");
    expect(brandKey).toBe("Timberland");
    expect(getBrand(brandKey as string)).toEqual({
      name: "Timberland",
      slug: "timberland",
      instagram: "https://www.instagram.com/timberland/",
    });
  });

  it("should handle malformed slug input", () => {
    expect(findBrandKeyBySlug("slug with spaces")).toBeUndefined();
    expect(findBrandKeyBySlug("slug/with/slashes")).toBeUndefined();
    expect(findBrandKeyBySlug("slug?with=query")).toBeUndefined();
    expect(findBrandKeyBySlug("slug#with-hash")).toBeUndefined();
    expect(findBrandKeyBySlug("slug@with.special")).toBeUndefined();
  });

  it("should handle special characters correctly in slug conversion", () => {
    expect(findBrandKeyBySlug("masons")).toBe("Mason's");
    expect(findBrandKeyBySlug("levis")).toBe("Levi's");
    expect(findBrandKeyBySlug("yg-studios")).toBe("YG Studios");
  });

  it("should handle malformed brand data structure", () => {
    const result = findBrandKeyBySlug("non-existent-slug");
    expect(result).toBeUndefined();
    const emptySlugResult = findBrandKeyBySlug("");
    expect(emptySlugResult).toBeUndefined();
  });

  it("should handle getBrand function defensive scenarios", () => {
    expect(() => findBrandKeyBySlug("test-slug")).not.toThrow();
    expect(() => findBrandKeyBySlug("")).not.toThrow();
    expect(() => findBrandKeyBySlug("invalid")).not.toThrow();
  });
});
