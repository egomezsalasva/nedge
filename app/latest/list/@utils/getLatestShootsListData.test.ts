import { Mock } from "vitest";
import { getLatestShootsListData } from "./getLatestShootsListData";
import { createClient } from "@/utils/supabase/client";

vi.mock("@/utils/supabase/client", () => ({
  createClient: vi.fn(),
}));

const mockShootsData = [
  {
    name: "Test Shoot 1",
    slug: "test-shoot-1",
    publication_date: "2024-01-15",
    stylist: { name: "Test Stylist", slug: "test-stylist" },
    city: { name: "Test City" },
    shoot_style_tags: [
      { style_tags: { name: "Style 1", slug: "style-1" } },
      { style_tags: { name: "Style 2", slug: "style-2" } },
    ],
    shoot_images: [
      { image_url: "/test-image-1.jpg" },
      { image_url: "/test-image-2.jpg" },
    ],
  },
];

describe("getLatestShootsListData", () => {
  const mockSupabase = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (createClient as unknown as Mock).mockReturnValue(mockSupabase);
  });

  it("should return empty array when no shoots data is available", async () => {
    mockSupabase.order.mockResolvedValue({ data: null });
    const result = await getLatestShootsListData();
    expect(result).toEqual([]);
    expect(mockSupabase.from).toHaveBeenCalledWith("shoots");
    expect(mockSupabase.select).toHaveBeenCalledWith(`
        name, 
        slug, 
        publication_date,
        stylist:stylists!stylist_id (name, slug),
        city:cities!city_id (name),
        shoot_style_tags (style_tags (name, slug)),
        shoot_images (image_url)
      `);
    expect(mockSupabase.is).toHaveBeenCalledWith("preview_slug", null);
    expect(mockSupabase.order).toHaveBeenCalledWith("publication_date", {
      ascending: false,
    });
  });

  it("should transform and return shoots data correctly", async () => {
    mockSupabase.order.mockResolvedValue({ data: mockShootsData });
    const result = await getLatestShootsListData();
    expect(result).toEqual([
      {
        name: "Test Shoot 1",
        slug: "test-shoot-1",
        publication_date: "2024-01-15",
        stylist: { name: "Test Stylist", slug: "test-stylist" },
        city: { name: "Test City" },
        shoot_style_tags: [
          { name: "Style 1", slug: "style-1" },
          { name: "Style 2", slug: "style-2" },
        ],
        first_image: "/test-image-1.jpg",
      },
    ]);
  });

  it("should handle shoots with missing optional fields", async () => {
    const mockShootsData = [
      {
        name: "Incomplete Shoot",
        slug: "incomplete-shoot",
        publication_date: "2024-01-15",
        stylist: null,
        city: null,
        shoot_style_tags: [],
        shoot_images: [],
      },
    ];
    mockSupabase.order.mockResolvedValue({ data: mockShootsData });
    const result = await getLatestShootsListData();
    expect(result).toEqual([
      {
        name: "Incomplete Shoot",
        slug: "incomplete-shoot",
        publication_date: "2024-01-15",
        stylist: null,
        city: { name: undefined },
        shoot_style_tags: [],
        first_image: "",
      },
    ]);
  });

  it("should handle shoots with missing images", async () => {
    const mockShootsData = [
      {
        name: "Shoot Without Images",
        slug: "shoot-without-images",
        publication_date: "2024-01-15",
        stylist: { name: "Test Stylist", slug: "test-stylist" },
        city: { name: "Test City" },
        shoot_style_tags: [
          { style_tags: { name: "Style 1", slug: "style-1" } },
        ],
        shoot_images: [],
      },
    ];
    mockSupabase.order.mockResolvedValue({ data: mockShootsData });
    const result = await getLatestShootsListData();
    expect(result).toEqual([
      {
        name: "Shoot Without Images",
        slug: "shoot-without-images",
        publication_date: "2024-01-15",
        stylist: { name: "Test Stylist", slug: "test-stylist" },
        city: { name: "Test City" },
        shoot_style_tags: [{ name: "Style 1", slug: "style-1" }],
        first_image: "",
      },
    ]);
  });

  it("should handle database errors gracefully", async () => {
    mockSupabase.order.mockRejectedValue(new Error("Database error"));
    await expect(getLatestShootsListData()).rejects.toThrow("Database error");
  });

  it("should handle null stylist data", async () => {
    const mockDataWithNullStylist = [
      {
        ...mockShootsData[0],
        stylist: null,
      },
    ];
    mockSupabase.order.mockResolvedValue({ data: mockDataWithNullStylist });
    const result = await getLatestShootsListData();
    expect(result[0].stylist).toBeNull();
  });

  it("should handle null city data", async () => {
    const mockDataWithNullCity = [
      {
        ...mockShootsData[0],
        city: null,
      },
    ];
    mockSupabase.order.mockResolvedValue({ data: mockDataWithNullCity });
    const result = await getLatestShootsListData();
    expect(result[0].city).toEqual({ name: undefined });
  });

  it("should handle null shoot_style_tags", async () => {
    const mockDataWithNullTags = [
      {
        ...mockShootsData[0],
        shoot_style_tags: null,
      },
    ];
    mockSupabase.order.mockResolvedValue({ data: mockDataWithNullTags });
    const result = await getLatestShootsListData();
    expect(result[0].shoot_style_tags).toBeUndefined();
  });

  it("should handle null shoot_images", async () => {
    const mockDataWithNullImages = [
      {
        ...mockShootsData[0],
        shoot_images: null,
      },
    ];
    mockSupabase.order.mockResolvedValue({ data: mockDataWithNullImages });
    const result = await getLatestShootsListData();
    expect(result[0].first_image).toBe("");
  });

  it("should handle multiple shoots in the response", async () => {
    const multipleShootsData = [
      {
        ...mockShootsData[0],
        name: "Shoot 1",
        slug: "shoot-1",
      },
      {
        ...mockShootsData[0],
        name: "Shoot 2",
        slug: "shoot-2",
      },
    ];
    mockSupabase.order.mockResolvedValue({ data: multipleShootsData });
    const result = await getLatestShootsListData();
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("Shoot 1");
    expect(result[1].name).toBe("Shoot 2");
  });

  it("should correctly transform shoot_style_tags structure", async () => {
    const mockDataWithMultipleTags = [
      {
        ...mockShootsData[0],
        shoot_style_tags: [
          { style_tags: { name: "Style 1", slug: "style-1" } },
          { style_tags: { name: "Style 2", slug: "style-2" } },
          { style_tags: { name: "Style 3", slug: "style-3" } },
        ],
      },
    ];
    mockSupabase.order.mockResolvedValue({ data: mockDataWithMultipleTags });
    const result = await getLatestShootsListData();
    expect(result[0].shoot_style_tags).toEqual([
      { name: "Style 1", slug: "style-1" },
      { name: "Style 2", slug: "style-2" },
      { name: "Style 3", slug: "style-3" },
    ]);
  });

  it("should extract first image from shoot_images array", async () => {
    const mockDataWithMultipleImages = [
      {
        ...mockShootsData[0],
        shoot_images: [
          { image_url: "/first-image.jpg" },
          { image_url: "/second-image.jpg" },
          { image_url: "/third-image.jpg" },
        ],
      },
    ];
    mockSupabase.order.mockResolvedValue({ data: mockDataWithMultipleImages });
    const result = await getLatestShootsListData();
    expect(result[0].first_image).toBe("/first-image.jpg");
  });

  it("should remove shoot_images from final result", async () => {
    mockSupabase.order.mockResolvedValue({ data: mockShootsData });
    const result = await getLatestShootsListData();
    expect(result[0]).not.toHaveProperty("shoot_images");
  });

  it("should return empty array when data is undefined", async () => {
    mockSupabase.order.mockResolvedValue({ data: undefined });
    const result = await getLatestShootsListData();
    expect(result).toEqual([]);
  });

  it("should return empty array when data is empty array", async () => {
    mockSupabase.order.mockResolvedValue({ data: [] });
    const result = await getLatestShootsListData();
    expect(result).toEqual([]);
  });

  it("should handle missing required fields gracefully", async () => {
    const incompleteData = [
      {
        name: "Test Shoot",
        slug: "test-shoot",
        // Missing other fields
      },
    ];
    mockSupabase.order.mockResolvedValue({ data: incompleteData });
    const result = await getLatestShootsListData();
    expect(result[0]).toEqual({
      name: "Test Shoot",
      slug: "test-shoot",
      publication_date: undefined,
      stylist: undefined,
      city: { name: undefined },
      shoot_style_tags: undefined,
      first_image: "",
    });
  });

  it("should handle shoot_images with null image_url", async () => {
    const mockDataWithNullImageUrl = [
      {
        ...mockShootsData[0],
        shoot_images: [{ image_url: null }, { image_url: "/valid.jpg" }],
      },
    ];
    mockSupabase.order.mockResolvedValue({ data: mockDataWithNullImageUrl });
    const result = await getLatestShootsListData();
    expect(result[0].first_image).toBe("");
  });

  it("should handle malformed response data", async () => {
    mockSupabase.order.mockResolvedValue({ data: "invalid data" });
    const result = await getLatestShootsListData();
    expect(result).toEqual([]);
  });

  it("should handle non-array data", async () => {
    mockSupabase.order.mockResolvedValue({ data: { not: "an array" } });
    const result = await getLatestShootsListData();
    expect(result).toEqual([]);
  });

  it("should handle null style_tags in shoot_style_tags", async () => {
    const mockDataWithNullStyleTags = [
      {
        ...mockShootsData[0],
        shoot_style_tags: [
          { style_tags: null },
          { style_tags: { name: "Valid Style", slug: "valid-style" } },
        ],
      },
    ];
    mockSupabase.order.mockResolvedValue({ data: mockDataWithNullStyleTags });
    const result = await getLatestShootsListData();
    expect(result[0].shoot_style_tags).toEqual([
      { name: undefined, slug: undefined },
      { name: "Valid Style", slug: "valid-style" },
    ]);
  });

  it("should handle undefined style_tags in shoot_style_tags", async () => {
    const mockDataWithUndefinedStyleTags = [
      {
        ...mockShootsData[0],
        shoot_style_tags: [
          { style_tags: undefined },
          { style_tags: { name: "Valid Style", slug: "valid-style" } },
        ],
      },
    ];
    mockSupabase.order.mockResolvedValue({
      data: mockDataWithUndefinedStyleTags,
    });
    const result = await getLatestShootsListData();
    expect(result[0].shoot_style_tags).toEqual([
      { name: undefined, slug: undefined },
      { name: "Valid Style", slug: "valid-style" },
    ]);
  });

  it("should call Supabase methods in correct order", async () => {
    mockSupabase.order.mockResolvedValue({ data: mockShootsData });
    await getLatestShootsListData();
    expect(mockSupabase.from).toHaveBeenCalledBefore(mockSupabase.select);
    expect(mockSupabase.select).toHaveBeenCalledBefore(mockSupabase.is);
    expect(mockSupabase.is).toHaveBeenCalledBefore(mockSupabase.order);
  });
});
