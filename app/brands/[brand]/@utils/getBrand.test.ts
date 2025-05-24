import { describe, expect, it } from "vitest";
import { getBrand } from "./getBrand";

describe("getBrand", () => {
  it("should return the correct brand when given a valid key", () => {
    const result = getBrand("Ovahtres");
    expect(result).toEqual({
      name: "Ovahtres",
      slug: "ovahtres",
      instagram: "https://www.instagram.com/ovahtres/",
    });
  });

  it("should return undefined when given an invalid key", () => {
    const result = getBrand("Non-existent Brand");
    expect(result).toBeUndefined();
  });

  it("should return the correct brand for another valid key", () => {
    const result = getBrand("Levi's");
    expect(result).toEqual({
      name: "Levi's",
      slug: "levis",
      instagram: "https://www.instagram.com/levis/",
    });
  });

  it("should return undefined when given an empty string", () => {
    const result = getBrand("");
    expect(result).toBeUndefined();
  });

  it("should return a BrandType object with correct structure", () => {
    const result = getBrand("Timberland");
    expect(result).toBeDefined();
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("slug");
    expect(result).toHaveProperty("instagram");
    expect(typeof result.name).toBe("string");
    expect(typeof result.slug).toBe("string");
    expect(typeof result.instagram).toBe("string");
  });

  it("should handle brand names with special characters and spaces", () => {
    const result = getBrand("Mason's");
    expect(result).toEqual({
      name: "Mason's",
      slug: "masons",
      instagram: "https://www.instagram.com/masons/",
    });
  });

  it("should be case sensitive and return undefined for wrong casing", () => {
    const result = getBrand("ovahtres");
    expect(result).toBeUndefined();
  });

  it("should handle brand names with multiple words", () => {
    const result = getBrand("YG Studios");
    expect(result).toEqual({
      name: "YG Studios",
      slug: "yg-studios",
      instagram: "https://www.instagram.com/ygstudios/",
    });
  });

  it("should handle null input gracefully", () => {
    const result = getBrand(null as any);
    expect(result).toBeUndefined();
  });

  it("should handle undefined input gracefully", () => {
    const result = getBrand(undefined as any);
    expect(result).toBeUndefined();
  });

  it("should return undefined when given whitespace-only string", () => {
    const result = getBrand("   ");
    expect(result).toBeUndefined();
  });
});
