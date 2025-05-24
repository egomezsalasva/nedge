import { describe, expect, it } from "vitest";
import { getBrandBySlug } from "./getBrandBySlug";

describe("getBrandBySlug", () => {
  it("should return brand key and data when given a valid slug", () => {
    const result = getBrandBySlug("ovahtres");
    expect(result).toEqual({
      key: "Ovahtres",
      data: {
        name: "Ovahtres",
        slug: "ovahtres",
        instagram: "https://www.instagram.com/ovahtres/",
      },
    });
  });

  it("should correctly handle different brand slugs", () => {
    expect(getBrandBySlug("timberland").key).toBe("Timberland");
    expect(getBrandBySlug("yg-studios").key).toBe("YG Studios");
    expect(getBrandBySlug("masons").key).toBe("Mason's");
    expect(getBrandBySlug("levis").key).toBe("Levi's");
  });

  it("should throw an error when brand with slug is not found", () => {
    expect(() => getBrandBySlug("non-existent-brand")).toThrow(
      'Brand with slug "non-existent-brand" not found',
    );
  });

  it("should throw an error when given an empty string or whitespace-only input", () => {
    expect(() => getBrandBySlug("")).toThrow('Brand with slug "" not found');
    expect(() => getBrandBySlug("   ")).toThrow(
      'Brand with slug "   " not found',
    );
  });

  it("should throw an error when given null/undefined input", () => {
    expect(() => getBrandBySlug(null as any)).toThrow();
    expect(() => getBrandBySlug(undefined as any)).toThrow();
  });

  it("should be case sensitive and throw error for wrong casing", () => {
    expect(() => getBrandBySlug("OVAHTRES")).toThrow();
    expect(() => getBrandBySlug("Ovahtres")).toThrow();
    expect(() => getBrandBySlug("TIMBERLAND")).toThrow();
  });

  it("should handle malformed slug input gracefully", () => {
    expect(() => getBrandBySlug("slug with spaces")).toThrow();
    expect(() => getBrandBySlug("slug/with/slashes")).toThrow();
    expect(() => getBrandBySlug("slug?with=query")).toThrow();
    expect(() => getBrandBySlug("slug#with-hash")).toThrow();
  });

  it("should return an object with correct structure", () => {
    const result = getBrandBySlug("timberland");
    expect(result).toHaveProperty("key");
    expect(result).toHaveProperty("data");
    expect(typeof result.key).toBe("string");
    expect(typeof result.data).toBe("object");
  });

  it("should return data with correct BrandType structure", () => {
    const result = getBrandBySlug("infinit");
    expect(result.data).toHaveProperty("name");
    expect(result.data).toHaveProperty("slug");
    expect(result.data).toHaveProperty("instagram");
    expect(typeof result.data.name).toBe("string");
    expect(typeof result.data.slug).toBe("string");
    expect(typeof result.data.instagram).toBe("string");
  });

  it("should handle brands with special characters correctly", () => {
    const result = getBrandBySlug("masons");
    expect(result.key).toBe("Mason's");
    expect(result.data.name).toBe("Mason's");
  });

  it("should ensure consistency between returned key and data", () => {
    const result = getBrandBySlug("rhude");
    expect(result.key).toBe("Rhude");
    expect(result.data.name).toBe("Rhude");
    expect(result.data.slug).toBe("rhude");
  });
});
