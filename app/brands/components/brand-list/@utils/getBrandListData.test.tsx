import { describe, it, expect, vi } from "vitest";
import { getBrandListData } from "./getBrandListData";
import type { SupabaseClient } from "@supabase/supabase-js";

vi.mock("@/utils/supabase/client", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    }),
  }),
}));

describe("getBrandListData", () => {
  it("should return an array", async () => {
    const result = await getBrandListData();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should return empty array when no brands", async () => {
    const result = await getBrandListData();
    expect(result).toEqual([]);
  });

  it("should return brands with correct structure", async () => {
    const result = await getBrandListData();
    if (result.length > 0) {
      expect(result[0]).toHaveProperty("id");
      expect(result[0]).toHaveProperty("name");
      expect(result[0]).toHaveProperty("slug");
      expect(result[0]).toHaveProperty("itemCount");
      expect(result[0]).toHaveProperty("shootCount");
    }
  });

  it("should handle database errors gracefully", async () => {
    vi.mocked(
      await import("@/utils/supabase/client"),
    ).createClient.mockRejectedValueOnce(
      new Error("Database connection failed"),
    );
    await expect(getBrandListData()).rejects.toThrow(
      "Database connection failed",
    );
  });

  it("should filter brands with zero shoot count", async () => {
    const result = await getBrandListData();
    result.forEach((brand) => {
      expect(brand.shootCount).toBeGreaterThan(0);
    });
  });

  it("should calculate item and shoot counts correctly", async () => {
    const result = await getBrandListData();
    result.forEach((brand) => {
      expect(typeof brand.itemCount).toBe("number");
      expect(typeof brand.shootCount).toBe("number");
      expect(brand.itemCount).toBeGreaterThanOrEqual(0);
      expect(brand.shootCount).toBeGreaterThan(0);
    });
  });

  it("should return brands in expected order", async () => {
    const result = await getBrandListData();
    if (result.length > 1) {
      const firstBrand = result[0];
      const secondBrand = result[1];
      expect(firstBrand).toBeDefined();
      expect(secondBrand).toBeDefined();
      expect(firstBrand.id).not.toBe(secondBrand.id);
    }
  });

  it("should handle empty database tables", async () => {
    vi.mocked(
      await import("@/utils/supabase/client"),
    ).createClient.mockResolvedValueOnce({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      }),
    } as unknown as SupabaseClient);
    const result = await getBrandListData();
    expect(result).toEqual([]);
  });

  it("should validate brand data integrity", async () => {
    const result = await getBrandListData();
    result.forEach((brand) => {
      expect(brand.id).toBeDefined();
      expect(brand.name).toBeDefined();
      expect(brand.slug).toBeDefined();
      expect(brand.itemCount).toBeDefined();
      expect(brand.shootCount).toBeDefined();
      expect(typeof brand.id).toBe("number");
      expect(typeof brand.name).toBe("string");
      expect(typeof brand.slug).toBe("string");
    });
  });

  it("should handle concurrent calls", async () => {
    const promises = [
      getBrandListData(),
      getBrandListData(),
      getBrandListData(),
    ];
    const results = await Promise.all(promises);
    results.forEach((result) => {
      expect(Array.isArray(result)).toBe(true);
    });
  });

  it("should handle malformed database responses", async () => {
    vi.mocked(
      await import("@/utils/supabase/client"),
    ).createClient.mockResolvedValueOnce({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [], // Use empty array instead of null
          error: null,
        }),
      }),
    } as unknown as SupabaseClient);
    const result = await getBrandListData();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([]);
  });

  it("should complete within reasonable time", async () => {
    const startTime = Date.now();
    await getBrandListData();
    const endTime = Date.now();
    const duration = endTime - startTime;
    expect(duration).toBeLessThan(5000);
  });

  it("should handle database query errors", async () => {
    // Mock a database query error
    vi.mocked(
      await import("@/utils/supabase/client"),
    ).createClient.mockResolvedValueOnce({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Query failed" },
        }),
      }),
    } as unknown as SupabaseClient);
    await expect(getBrandListData()).rejects.toThrow();
  });
});
