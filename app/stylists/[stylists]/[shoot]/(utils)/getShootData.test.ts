import { getShootData } from "./getShootData";
import { createClient } from "@/utils/supabase/server";

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(),
}));

const mockRawData = {
  id: 1,
  name: "Summer Collection 2024",
  slug: "summer-collection-2024",
  preview_slug: "summer-preview",
  publication_date: "2024-06-15",
  description: "A vibrant summer collection",
  city: { name: "Los Angeles", country: "USA" },
  stylist: {
    name: "Jane Doe",
    slug: "jane-doe",
    description: "Fashion stylist",
    instagram_url: "https://instagram.com/janedoe",
  },
  shoot_style_tags: [
    { style_tags: { name: "Casual", slug: "casual" } },
    { style_tags: { name: "Summer", slug: "summer" } },
  ],
  shoot_images: [
    { image_url: "https://example.com/image1.jpg" },
    { image_url: "https://example.com/image2.jpg" },
  ],
  shoot_garments: [
    {
      garments: {
        id: 101,
        name: "Denim Jacket",
        garment_type: { name: "Jacket" },
        brand: {
          name: "Levi's",
          instagram_url: "https://instagram.com/levis",
        },
        affiliate_link: "https://amazon.com/denim-jacket",
      },
    },
    {
      garments: {
        id: 102,
        name: "White T-Shirt",
        garment_type: { name: "T-Shirt" },
        brand: {
          name: "Nike",
          instagram_url: "https://instagram.com/nike",
        },
        affiliate_link: "https://amazon.com/white-tshirt",
      },
    },
  ],
};

const expectedTransformedData = {
  id: 1,
  name: "Summer Collection 2024",
  slug: "summer-collection-2024",
  preview_slug: "summer-preview",
  publication_date: "2024-06-15",
  description: "A vibrant summer collection",
  city: { name: "Los Angeles", country: "USA" },
  stylist: {
    name: "Jane Doe",
    slug: "jane-doe",
    description: "Fashion stylist",
    instagram_url: "https://instagram.com/janedoe",
  },
  shoot_style_tags: [
    { name: "Casual", slug: "casual" },
    { name: "Summer", slug: "summer" },
  ],
  shoot_images: [
    { image_url: "https://example.com/image1.jpg" },
    { image_url: "https://example.com/image2.jpg" },
  ],
  shoot_garments: [
    {
      id: 101,
      name: "Denim Jacket",
      type: "Jacket",
      brand: {
        name: "Levi's",
        instagram_url: "https://instagram.com/levis",
      },
      affiliate_link: "https://amazon.com/denim-jacket",
    },
    {
      id: 102,
      name: "White T-Shirt",
      type: "T-Shirt",
      brand: {
        name: "Nike",
        instagram_url: "https://instagram.com/nike",
      },
      affiliate_link: "https://amazon.com/white-tshirt",
    },
  ],
};

const expectedSqlQuery = `
        id,
        name, 
        slug, 
        preview_slug,
        publication_date, 
        description,
        stylist:stylists!stylist_id (name, slug, description, instagram_url),
        city:cities!city_id (name),
        shoot_style_tags (style_tags (name, slug)),
        shoot_images (image_url),
        shoot_garments (
          garments!garment_id (
            id,
            name,
            garment_type:garment_types!garment_type_id (
              name
            ),
            brand:brands!brand_id (
              name,
              instagram_url
            ),
            affiliate_link
          )
        )
      `;

describe("getShootData", () => {
  const mockSupabase = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);
  });

  it("returns transformed shoot data when shoot exists", async () => {
    mockSupabase.single.mockResolvedValue({
      data: mockRawData,
      error: null,
    });
    const result = await getShootData("jane-doe", "summer-collection-2024");
    expect(result).toEqual(expectedTransformedData);
    expect(mockSupabase.from).toHaveBeenCalledWith("shoots");
    expect(mockSupabase.select).toHaveBeenCalledWith(
      expect.stringContaining("id"),
    );
    expect(mockSupabase.eq).toHaveBeenCalledWith(
      "slug",
      "summer-collection-2024",
    );
    expect(mockSupabase.eq).toHaveBeenCalledWith("stylists.slug", "jane-doe");
  });

  it("returns null when shoot does not exist", async () => {
    mockSupabase.single.mockResolvedValue({
      data: null,
      error: null,
    });
    const result = await getShootData("jane-doe", "non-existent-shoot");
    expect(result).toBeNull();
    expect(mockSupabase.from).toHaveBeenCalledWith("shoots");
    expect(mockSupabase.eq).toHaveBeenCalledWith("slug", "non-existent-shoot");
    expect(mockSupabase.eq).toHaveBeenCalledWith("stylists.slug", "jane-doe");
  });

  it("handles empty arrays for optional relationships", async () => {
    const mockDataWithEmptyArrays = {
      ...mockRawData,
      shoot_style_tags: [],
      shoot_images: [],
      shoot_garments: [],
    };
    const expectedDataWithEmptyArrays = {
      ...expectedTransformedData,
      shoot_style_tags: [],
      shoot_images: [],
      shoot_garments: [],
    };
    mockSupabase.single.mockResolvedValue({
      data: mockDataWithEmptyArrays,
      error: null,
    });
    const result = await getShootData("jane-doe", "summer-collection-2024");
    expect(result).toEqual(expectedDataWithEmptyArrays);
  });

  it("handles database query errors gracefully", async () => {
    const mockError = {
      message: "Database connection failed",
      details: "Connection timeout",
      hint: "Check your network connection",
      code: "PGRST301",
    };
    mockSupabase.single.mockResolvedValue({
      data: null,
      error: mockError,
    });
    const result = await getShootData("jane-doe", "summer-collection-2024");
    expect(result).toBeNull();
    expect(mockSupabase.from).toHaveBeenCalledWith("shoots");
  });

  it("throws error when relationships are null", async () => {
    const mockDataWithNulls = {
      ...mockRawData,
      shoot_style_tags: null,
      shoot_images: null,
      shoot_garments: null,
    };
    mockSupabase.single.mockResolvedValue({
      data: mockDataWithNulls,
      error: null,
    });
    await expect(
      getShootData("jane-doe", "summer-collection-2024"),
    ).rejects.toThrow();
  });

  it("handles empty string parameters", async () => {
    mockSupabase.single.mockResolvedValue({
      data: null,
      error: null,
    });
    const result = await getShootData("", "");
    expect(result).toBeNull();
    expect(mockSupabase.eq).toHaveBeenCalledWith("slug", "");
    expect(mockSupabase.eq).toHaveBeenCalledWith("stylists.slug", "");
  });

  it("handles special characters in parameters", async () => {
    const stylistWithSpecialChars = "jane-doe-2024!@#$%";
    const shootWithSpecialChars = "summer-collection-2024-ñáéíóú";
    mockSupabase.single.mockResolvedValue({
      data: null,
      error: null,
    });
    const result = await getShootData(
      stylistWithSpecialChars,
      shootWithSpecialChars,
    );
    expect(result).toBeNull();
    expect(mockSupabase.eq).toHaveBeenCalledWith("slug", shootWithSpecialChars);
    expect(mockSupabase.eq).toHaveBeenCalledWith(
      "stylists.slug",
      stylistWithSpecialChars,
    );
  });

  it("handles Supabase client creation errors", async () => {
    (createClient as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Failed to create Supabase client"),
    );
    await expect(
      getShootData("jane-doe", "summer-collection-2024"),
    ).rejects.toThrow("Failed to create Supabase client");
  });

  it("verifies correct SQL query structure", async () => {
    mockSupabase.single.mockResolvedValue({
      data: mockRawData,
      error: null,
    });
    await getShootData("jane-doe", "summer-collection-2024");
    expect(mockSupabase.select).toHaveBeenCalledWith(expectedSqlQuery);
  });

  it("throws error when data has wrong types", async () => {
    const malformedData = {
      id: "not-a-number",
      name: null,
      slug: undefined,
      preview_slug: 123,
      publication_date: "invalid-date",
      description: "",
      city: "not-an-object",
      stylist: [],
      shoot_style_tags: "not-an-array",
      shoot_images: { not: "an array" },
      shoot_garments: null,
    };
    mockSupabase.single.mockResolvedValue({
      data: malformedData,
      error: null,
    });
    await expect(
      getShootData("jane-doe", "summer-collection-2024"),
    ).rejects.toThrow();
  });

  it("handles very long parameter values", async () => {
    const veryLongStylist = "a".repeat(1000);
    const veryLongShoot = "b".repeat(1000);
    mockSupabase.single.mockResolvedValue({
      data: null,
      error: null,
    });
    const result = await getShootData(veryLongStylist, veryLongShoot);
    expect(result).toBeNull();
    expect(mockSupabase.eq).toHaveBeenCalledWith("slug", veryLongShoot);
    expect(mockSupabase.eq).toHaveBeenCalledWith(
      "stylists.slug",
      veryLongStylist,
    );
  });
});
