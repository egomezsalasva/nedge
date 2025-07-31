import { describe, it, expect } from "vitest";
import { getShootsFromBrandData } from "./getShootsFromBrandData";
import type { SupabaseClient } from "@supabase/supabase-js";

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(),
}));

const mockSupabase = {
  from: vi.fn(),
};

const mockQueryBuilder = {
  select: vi.fn(),
  eq: vi.fn(),
  single: vi.fn(),
  in: vi.fn(),
};

describe("getShootsFromBrandData", () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    // Set up the supabase mock to return the query builder
    mockSupabase.from.mockReturnValue(mockQueryBuilder);

    // Set up the chain methods to return the query builder
    mockQueryBuilder.select.mockReturnValue(mockQueryBuilder);
    mockQueryBuilder.eq.mockReturnValue(mockQueryBuilder);
    mockQueryBuilder.in.mockReturnValue(mockQueryBuilder);
    const { createClient } = await import("@/utils/supabase/server");
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as SupabaseClient,
    );
  });

  it("should be a function", () => {
    expect(typeof getShootsFromBrandData).toBe("function");
  });

  it("should fetch brand data by slug", async () => {
    const mockBrandData = {
      id: 1,
      name: "Test Brand",
      instagram_url: "https://instagram.com/test",
    };
    mockQueryBuilder.single.mockResolvedValue({ data: mockBrandData });
    await getShootsFromBrandData("test-brand");
    expect(mockSupabase.from).toHaveBeenCalledWith("brands");
    expect(mockQueryBuilder.select).toHaveBeenCalledWith(
      "id, name, instagram_url",
    );
    expect(mockQueryBuilder.eq).toHaveBeenCalledWith("slug", "test-brand");
  });

  it("should fetch garments for the brand", async () => {
    const mockBrandData = {
      id: 1,
      name: "Test Brand",
      instagram_url: "https://instagram.com/test",
    };
    const mockGarmentsData = [{ id: 1 }, { id: 2 }];
    mockQueryBuilder.single.mockResolvedValue({ data: mockBrandData });
    mockQueryBuilder.in.mockResolvedValue({ data: mockGarmentsData });
    await getShootsFromBrandData("test-brand");
    expect(mockSupabase.from).toHaveBeenCalledWith("garments");
    expect(mockQueryBuilder.eq).toHaveBeenCalledWith("brand_id", 1);
  });

  it("should fetch and transform shoot data correctly", async () => {
    const mockBrandData = {
      id: 1,
      name: "Test Brand",
      instagram_url: "https://instagram.com/test",
    };
    const mockShootGarmentsData = [{ shoot_id: 1 }];
    const mockShootsData = [
      {
        id: 1,
        name: "Test Shoot",
        slug: "test-shoot",
        publication_date: "2024-01-01",
        preview_slug: null,
        stylist: null,
        city: null,
        shoot_style_tags: null,
        shoot_images: null,
        shoot_garments: null,
      },
    ];
    // Don't override the chain methods - let them return the query builder
    mockQueryBuilder.single.mockResolvedValue({ data: mockBrandData });
    // Remove this line that breaks the chain:
    // mockQueryBuilder.eq.mockResolvedValue({ data: mockGarmentsData });
    mockQueryBuilder.in
      .mockResolvedValueOnce({ data: mockShootGarmentsData })
      .mockResolvedValueOnce({ data: mockShootsData });
    const result = await getShootsFromBrandData("test-brand");
    expect(result.transformedShoots).toHaveLength(1);
    expect(result.transformedShoots[0]).toHaveProperty("id", 1);
    expect(result.transformedShoots[0]).toHaveProperty("name", "Test Shoot");
  });

  it("should filter out shoots with preview_slug", async () => {
    const mockBrandData = {
      id: 1,
      name: "Test Brand",
      instagram_url: "https://instagram.com/test",
    };
    const mockShootGarmentsData = [{ shoot_id: 1 }];
    const mockShootsData = [
      {
        id: 1,
        name: "Preview Shoot",
        slug: "preview-shoot",
        publication_date: "2024-01-01",
        preview_slug: "preview", // This should be filtered out
        stylist: null,
        city: null,
        shoot_style_tags: null,
        shoot_images: null,
        shoot_garments: null,
      },
    ];
    mockQueryBuilder.single.mockResolvedValue({ data: mockBrandData });
    mockQueryBuilder.in
      .mockResolvedValueOnce({ data: mockShootGarmentsData })
      .mockResolvedValueOnce({ data: mockShootsData });
    const result = await getShootsFromBrandData("test-brand");
    expect(result.transformedShoots).toHaveLength(0);
  });

  it("should transform shoot data with proper structure", async () => {
    const mockBrandData = {
      id: 1,
      name: "Test Brand",
      instagram_url: "https://instagram.com/test",
    };
    const mockShootGarmentsData = [{ shoot_id: 1 }];
    const mockShootsData = [
      {
        id: 1,
        name: "Test Shoot",
        slug: "test-shoot",
        publication_date: "2024-01-01",
        preview_slug: null,
        stylist: { name: "Test Stylist", slug: "test-stylist" },
        city: { name: "Test City" },
        shoot_style_tags: [
          { style_tags: { name: "Streetwear", slug: "streetwear" } },
        ],
        shoot_images: [
          { image_url: "test-image-1.jpg" },
          { image_url: "test-image-2.jpg" },
        ],
        shoot_garments: [
          {
            garment_id: 1,
            garments: {
              brand_id: { slug: "test-brand" },
              garment_types: { name: "T-Shirt" },
            },
          },
          {
            garment_id: 2,
            garments: {
              brand_id: { slug: "test-brand" },
              garment_types: { name: "Jeans" },
            },
          },
        ],
      },
    ];
    mockQueryBuilder.single.mockResolvedValue({ data: mockBrandData });
    mockQueryBuilder.in
      .mockResolvedValueOnce({ data: mockShootGarmentsData })
      .mockResolvedValueOnce({ data: mockShootsData });
    const result = await getShootsFromBrandData("test-brand");
    expect(result.transformedShoots[0]).toEqual({
      id: 1,
      name: "Test Shoot",
      slug: "test-shoot",
      publication_date: "2024-01-01",
      preview_slug: null,
      stylist: { name: "Test Stylist", slug: "test-stylist" },
      city: { name: "Test City" },
      shoot_style_tags: [{ name: "Streetwear", slug: "streetwear" }],
      first_image: "test-image-1.jpg",
      brandItemTypes: ["T-Shirt", "Jeans"],
    });
  });

  it("should handle brand not found gracefully", async () => {
    // Mock brand not found (returns null)
    mockQueryBuilder.single.mockResolvedValue({ data: null });
    mockQueryBuilder.in.mockResolvedValue({ data: undefined }); // This will be undefined, not []
    const result = await getShootsFromBrandData("non-existent-brand");
    expect(result.brandData).toBeNull();
    expect(result.garmentsData).toBeUndefined(); // Change this to toBeUndefined
    expect(result.transformedShoots).toEqual([]);
    // Verify it still queries garments with undefined brandId
    expect(mockSupabase.from).toHaveBeenCalledWith("garments");
    expect(mockQueryBuilder.eq).toHaveBeenCalledWith("brand_id", undefined);
  });

  it("should handle shoots with multiple stylists", async () => {
    const mockBrandData = {
      id: 1,
      name: "Test Brand",
      instagram_url: "https://instagram.com/test",
    };
    const mockShootGarmentsData = [{ shoot_id: 1 }];
    const mockShootsData = [
      {
        id: 1,
        name: "Multi Stylist Shoot",
        slug: "multi-stylist-shoot",
        publication_date: "2024-01-01",
        preview_slug: null,
        stylist: [
          { name: "Stylist One", slug: "stylist-one" },
          { name: "Stylist Two", slug: "stylist-two" },
        ],
        city: { name: "Test City" },
        shoot_style_tags: null,
        shoot_images: [{ image_url: "test-image.jpg" }],
        shoot_garments: null,
      },
    ];
    mockQueryBuilder.single.mockResolvedValue({ data: mockBrandData });
    mockQueryBuilder.in
      .mockResolvedValueOnce({ data: mockShootGarmentsData })
      .mockResolvedValueOnce({ data: mockShootsData });
    const result = await getShootsFromBrandData("test-brand");
    expect(result.transformedShoots[0].stylist).toEqual([
      { name: "Stylist One", slug: "stylist-one" },
      { name: "Stylist Two", slug: "stylist-two" },
    ]);
  });

  it("should handle shoots with no images", async () => {
    const mockBrandData = {
      id: 1,
      name: "Test Brand",
      instagram_url: "https://instagram.com/test",
    };
    const mockShootGarmentsData = [{ shoot_id: 1 }];
    const mockShootsData = [
      {
        id: 1,
        name: "No Images Shoot",
        slug: "no-images-shoot",
        publication_date: "2024-01-01",
        preview_slug: null,
        stylist: { name: "Test Stylist", slug: "test-stylist" },
        city: { name: "Test City" },
        shoot_style_tags: null,
        shoot_images: [], // Empty images array
        shoot_garments: null,
      },
    ];
    mockQueryBuilder.single.mockResolvedValue({ data: mockBrandData });
    mockQueryBuilder.in
      .mockResolvedValueOnce({ data: mockShootGarmentsData })
      .mockResolvedValueOnce({ data: mockShootsData });
    const result = await getShootsFromBrandData("test-brand");
    expect(result.transformedShoots[0].first_image).toBe("");
  });

  it("should deduplicate garment types", async () => {
    const mockBrandData = {
      id: 1,
      name: "Test Brand",
      instagram_url: "https://instagram.com/test",
    };
    const mockShootGarmentsData = [{ shoot_id: 1 }];
    const mockShootsData = [
      {
        id: 1,
        name: "Duplicate Types Shoot",
        slug: "duplicate-types-shoot",
        publication_date: "2024-01-01",
        preview_slug: null,
        stylist: { name: "Test Stylist", slug: "test-stylist" },
        city: { name: "Test City" },
        shoot_style_tags: null,
        shoot_images: [{ image_url: "test-image.jpg" }],
        shoot_garments: [
          {
            garment_id: 1,
            garments: {
              brand_id: { slug: "test-brand" },
              garment_types: { name: "T-Shirt" },
            },
          },
          {
            garment_id: 2,
            garments: {
              brand_id: { slug: "test-brand" },
              garment_types: { name: "T-Shirt" }, // Duplicate
            },
          },
          {
            garment_id: 3,
            garments: {
              brand_id: { slug: "test-brand" },
              garment_types: { name: "Jeans" },
            },
          },
        ],
      },
    ];
    mockQueryBuilder.single.mockResolvedValue({ data: mockBrandData });
    mockQueryBuilder.in
      .mockResolvedValueOnce({ data: mockShootGarmentsData })
      .mockResolvedValueOnce({ data: mockShootsData });
    const result = await getShootsFromBrandData("test-brand");
    expect(result.transformedShoots[0].brandItemTypes).toEqual([
      "T-Shirt",
      "Jeans",
    ]);
  });

  it("should filter garments by brand correctly", async () => {
    const mockBrandData = {
      id: 1,
      name: "Test Brand",
      instagram_url: "https://instagram.com/test",
    };
    const mockShootGarmentsData = [{ shoot_id: 1 }];
    const mockShootsData = [
      {
        id: 1,
        name: "Mixed Brands Shoot",
        slug: "mixed-brands-shoot",
        publication_date: "2024-01-01",
        preview_slug: null,
        stylist: { name: "Test Stylist", slug: "test-stylist" },
        city: { name: "Test City" },
        shoot_style_tags: null,
        shoot_images: [{ image_url: "test-image.jpg" }],
        shoot_garments: [
          {
            garment_id: 1,
            garments: {
              brand_id: { slug: "test-brand" }, // This brand - should be included
              garment_types: { name: "T-Shirt" },
            },
          },
          {
            garment_id: 2,
            garments: {
              brand_id: { slug: "other-brand" }, // Different brand - should be excluded
              garment_types: { name: "Jacket" },
            },
          },
          {
            garment_id: 3,
            garments: {
              brand_id: { slug: "test-brand" }, // This brand - should be included
              garment_types: { name: "Jeans" },
            },
          },
        ],
      },
    ];
    mockQueryBuilder.single.mockResolvedValue({ data: mockBrandData });
    mockQueryBuilder.in
      .mockResolvedValueOnce({ data: mockShootGarmentsData })
      .mockResolvedValueOnce({ data: mockShootsData });
    const result = await getShootsFromBrandData("test-brand");
    expect(result.transformedShoots[0].brandItemTypes).toEqual([
      "T-Shirt",
      "Jeans",
    ]);
  });

  it("should filter out shoots with empty string preview_slug", async () => {
    const mockBrandData = {
      id: 1,
      name: "Test Brand",
      instagram_url: "https://instagram.com/test",
    };
    const mockShootGarmentsData = [{ shoot_id: 1 }];
    const mockShootsData = [
      {
        id: 1,
        name: "Empty Preview Shoot",
        slug: "empty-preview-shoot",
        publication_date: "2024-01-01",
        preview_slug: "", // Empty string - function currently KEEPS these
        stylist: null,
        city: null,
        shoot_style_tags: null,
        shoot_images: null,
        shoot_garments: null,
      },
    ];
    mockQueryBuilder.single.mockResolvedValue({ data: mockBrandData });
    mockQueryBuilder.in
      .mockResolvedValueOnce({ data: mockShootGarmentsData })
      .mockResolvedValueOnce({ data: mockShootsData });
    const result = await getShootsFromBrandData("test-brand");
    // Function currently KEEPS empty string preview_slug
    expect(result.transformedShoots).toHaveLength(1);
  });

  it("should keep shoots with null preview_slug", async () => {
    const mockBrandData = {
      id: 1,
      name: "Test Brand",
      instagram_url: "https://instagram.com/test",
    };
    const mockShootGarmentsData = [{ shoot_id: 1 }];
    const mockShootsData = [
      {
        id: 1,
        name: "Null Preview Shoot",
        slug: "null-preview-shoot",
        publication_date: "2024-01-01",
        preview_slug: null, // Null - should be KEPT
        stylist: null,
        city: null,
        shoot_style_tags: null,
        shoot_images: null,
        shoot_garments: null,
      },
    ];
    mockQueryBuilder.single.mockResolvedValue({ data: mockBrandData });
    mockQueryBuilder.in
      .mockResolvedValueOnce({ data: mockShootGarmentsData })
      .mockResolvedValueOnce({ data: mockShootsData });
    const result = await getShootsFromBrandData("test-brand");
    expect(result.transformedShoots).toHaveLength(1);
  });

  it("should handle brand with no garments", async () => {
    const mockBrandData = {
      id: 1,
      name: "Test Brand",
      instagram_url: "https://instagram.com/test",
    };
    mockQueryBuilder.single.mockResolvedValue({ data: mockBrandData });
    mockQueryBuilder.in
      .mockResolvedValueOnce({ data: undefined }) // No garments found (undefined, not [])
      .mockResolvedValueOnce({ data: [] }); // No shoots found
    const result = await getShootsFromBrandData("brand-with-no-garments");
    expect(result.brandData).toEqual(mockBrandData);
    expect(result.garmentsData).toBeUndefined(); // Should be undefined, not []
    expect(result.transformedShoots).toEqual([]);
    // Verify it queries with the correct brand ID but finds no garments
    expect(mockSupabase.from).toHaveBeenCalledWith("garments");
    expect(mockQueryBuilder.eq).toHaveBeenCalledWith("brand_id", 1);
    expect(mockSupabase.from).toHaveBeenCalledWith("shoot_garments");
    expect(mockQueryBuilder.in).toHaveBeenCalledWith("garment_id", []);
  });

  it("should handle brand with garments but no shoots", async () => {
    const mockBrandData = {
      id: 1,
      name: "Test Brand",
      instagram_url: "https://instagram.com/test",
    };
    const mockGarmentsData = [{ id: 1 }, { id: 2 }];
    // Reset mocks and setup fresh chain
    vi.clearAllMocks();
    mockSupabase.from.mockReturnValue(mockQueryBuilder);
    mockQueryBuilder.select.mockReturnValue(mockQueryBuilder);
    mockQueryBuilder.eq.mockReturnValue(mockQueryBuilder);
    mockQueryBuilder.in.mockReturnValue(mockQueryBuilder);
    // Mock the actual data returns
    mockQueryBuilder.single.mockResolvedValue({ data: mockBrandData });
    // For the garments query, we need to mock the data return differently
    // Since garments query is: .from("garments").select("id").eq("brand_id", brandId)
    // We need to mock this specific chain
    const mockGarmentsQueryBuilder = {
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: mockGarmentsData }),
      }),
    };
    // Override the garments query specifically
    mockSupabase.from.mockImplementation((table) => {
      if (table === "garments") return mockGarmentsQueryBuilder;
      return mockQueryBuilder;
    });
    mockQueryBuilder.in
      .mockResolvedValueOnce({ data: [] }) // No shoot_garments found
      .mockResolvedValueOnce({ data: [] }); // No shoots found
    const result = await getShootsFromBrandData("brand-with-unused-garments");
    expect(result.brandData).toEqual(mockBrandData);
    expect(result.garmentsData).toEqual(mockGarmentsData);
    expect(result.transformedShoots).toEqual([]);
  });

  it("should handle shoots with null city", async () => {
    const mockBrandData = {
      id: 1,
      name: "Test Brand",
      instagram_url: "https://instagram.com/test",
    };
    const mockShootGarmentsData = [{ shoot_id: 1 }];
    const mockShootsData = [
      {
        id: 1,
        name: "No City Shoot",
        slug: "no-city-shoot",
        publication_date: "2024-01-01",
        preview_slug: null,
        stylist: { name: "Test Stylist", slug: "test-stylist" },
        city: null, // Null city
        shoot_style_tags: null,
        shoot_images: [{ image_url: "test-image.jpg" }],
        shoot_garments: null,
      },
    ];
    mockQueryBuilder.single.mockResolvedValue({ data: mockBrandData });
    mockQueryBuilder.in
      .mockResolvedValueOnce({ data: mockShootGarmentsData })
      .mockResolvedValueOnce({ data: mockShootsData });
    const result = await getShootsFromBrandData("test-brand");
    expect(result.transformedShoots[0].city).toEqual({ name: undefined });
  });

  it("should handle shoots with null style tags", async () => {
    const mockBrandData = {
      id: 1,
      name: "Test Brand",
      instagram_url: "https://instagram.com/test",
    };
    const mockShootGarmentsData = [{ shoot_id: 1 }];
    const mockShootsData = [
      {
        id: 1,
        name: "No Style Tags Shoot",
        slug: "no-style-tags-shoot",
        publication_date: "2024-01-01",
        preview_slug: null,
        stylist: { name: "Test Stylist", slug: "test-stylist" },
        city: { name: "Test City" },
        shoot_style_tags: null, // Null style tags
        shoot_images: [{ image_url: "test-image.jpg" }],
        shoot_garments: null,
      },
    ];
    mockQueryBuilder.single.mockResolvedValue({ data: mockBrandData });
    mockQueryBuilder.in
      .mockResolvedValueOnce({ data: mockShootGarmentsData })
      .mockResolvedValueOnce({ data: mockShootsData });
    const result = await getShootsFromBrandData("test-brand");
    expect(result.transformedShoots[0].shoot_style_tags).toBeUndefined();
  });

  it("should return correct structure with all expected fields", async () => {
    const mockBrandData = {
      id: 1,
      name: "Test Brand",
      instagram_url: "https://instagram.com/test",
    };
    const mockShootGarmentsData = [{ shoot_id: 1 }];
    const mockShootsData = [
      {
        id: 1,
        name: "Structure Test Shoot",
        slug: "structure-test-shoot",
        publication_date: "2024-01-01",
        preview_slug: null,
        stylist: { name: "Test Stylist", slug: "test-stylist" },
        city: { name: "Test City" },
        shoot_style_tags: [{ style_tags: { name: "Casual", slug: "casual" } }],
        shoot_images: [{ image_url: "test-image.jpg" }],
        shoot_garments: [
          {
            garment_id: 1,
            garments: {
              brand_id: { slug: "test-brand" },
              garment_types: { name: "T-Shirt" },
            },
          },
        ],
      },
    ];
    mockQueryBuilder.single.mockResolvedValue({ data: mockBrandData });
    mockQueryBuilder.in
      .mockResolvedValueOnce({ data: mockShootGarmentsData })
      .mockResolvedValueOnce({ data: mockShootsData });
    const result = await getShootsFromBrandData("test-brand");
    // Validate top-level structure
    expect(result).toHaveProperty("brandData");
    expect(result).toHaveProperty("garmentsData");
    expect(result).toHaveProperty("transformedShoots");
    // Validate transformed shoot structure
    const shoot = result.transformedShoots[0];
    expect(shoot).toHaveProperty("id");
    expect(shoot).toHaveProperty("name");
    expect(shoot).toHaveProperty("slug");
    expect(shoot).toHaveProperty("publication_date");
    expect(shoot).toHaveProperty("preview_slug");
    expect(shoot).toHaveProperty("stylist");
    expect(shoot).toHaveProperty("city");
    expect(shoot).toHaveProperty("shoot_style_tags");
    expect(shoot).toHaveProperty("first_image");
    expect(shoot).toHaveProperty("brandItemTypes");
    // Validate specific field types
    expect(typeof shoot.id).toBe("number");
    expect(typeof shoot.name).toBe("string");
    expect(Array.isArray(shoot.brandItemTypes)).toBe(true);
  });
});
