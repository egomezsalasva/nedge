import { describe, expect, it } from "vitest";
import { getBrandShoots } from "./getBrandShoots";

describe("getBrandShoots", () => {
  it("should return shoots for Timberland", () => {
    const result = getBrandShoots("Timberland");
    expect(result.length).toBeGreaterThan(0);
  });
});
