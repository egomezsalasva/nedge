import { SupabaseClient } from "@supabase/supabase-js";
import { getLatestShootData } from "./getLatestShootData";
import { createClient } from "@/utils/supabase/client";

const mockSingle = vi.fn();
const mockLimit = vi.fn(() => ({ single: mockSingle }));
const mockOrder = vi.fn(() => ({ limit: mockLimit }));
const mockIs = vi.fn(() => ({ order: mockOrder }));
const mockSelect = vi.fn(() => ({ is: mockIs }));
const mockFrom = vi.fn(() => ({ select: mockSelect }));
const mockSupabase = { from: mockFrom };

vi.mock("@/utils/supabase/client", () => ({
  createClient: vi.fn(() => mockSupabase),
}));

const mockRawData = {
  name: "Test Shoot",
  slug: "test-shoot",
  publication_date: "2024-01-01",
  description: "Test description",
  stylist: { name: "Test Stylist", slug: "test-stylist" },
  city: { name: "Test City" },
  shoot_style_tags: [
    { style_tags: { name: "Test Style", slug: "test-style" } },
  ],
  shoot_images: [{ image_url: "/test-image.jpg" }],
};

describe("getLatestShootData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as SupabaseClient,
    );
  });

  it("returns null when no shoot data is found", async () => {
    mockSingle.mockResolvedValue({ data: null });
    const result = await getLatestShootData();
    expect(result).toBeNull();
  });

  it("returns transformed shoot data when found", async () => {
    mockSingle.mockResolvedValue({ data: mockRawData });
    const result = await getLatestShootData();
    expect(result).toEqual({
      name: mockRawData.name,
      slug: mockRawData.slug,
      publication_date: mockRawData.publication_date,
      description: mockRawData.description,
      stylist: mockRawData.stylist,
      city: mockRawData.city,
      shoot_style_tags: [{ name: "Test Style", slug: "test-style" }],
      shoot_images: mockRawData.shoot_images,
    });
  });

  it("handles missing optional fields gracefully", async () => {
    const mockDataWithMissingFields = {
      name: "Test Shoot",
      slug: "test-shoot",
      publication_date: "2024-01-01",
      description: "Test description",
      stylist: { name: "Test Stylist", slug: "test-stylist" },
      city: null,
      shoot_style_tags: null,
      shoot_images: [],
    };
    mockSingle.mockResolvedValue({ data: mockDataWithMissingFields });
    const result = await getLatestShootData();
    expect(result).toEqual({
      name: mockDataWithMissingFields.name,
      slug: mockDataWithMissingFields.slug,
      publication_date: mockDataWithMissingFields.publication_date,
      description: mockDataWithMissingFields.description,
      stylist: mockDataWithMissingFields.stylist,
      city: { name: undefined },
      shoot_style_tags: undefined,
      shoot_images: [],
    });
  });

  it("handles Supabase client creation errors", async () => {
    vi.mocked(createClient).mockRejectedValue(new Error("Connection failed"));
    await expect(getLatestShootData()).rejects.toThrow("Connection failed");
  });

  it("handles database query errors", async () => {
    mockSingle.mockRejectedValue(new Error("Database timeout"));
    await expect(getLatestShootData()).rejects.toThrow("Database timeout");
  });

  it("handles empty shoot_style_tags array", async () => {
    const mockDataWithEmptyTags = {
      ...mockRawData,
      shoot_style_tags: [],
    };
    mockSingle.mockResolvedValue({ data: mockDataWithEmptyTags });
    const result = await getLatestShootData();
    expect(result?.shoot_style_tags).toEqual([]);
  });

  it("handles missing required fields gracefully", async () => {
    const incompleteData = {
      name: "Test Shoot",
      slug: "test-shoot",
    };
    mockSingle.mockResolvedValue({ data: incompleteData });
    const result = await getLatestShootData();
    expect(result).toEqual({
      name: "Test Shoot",
      slug: "test-shoot",
      publication_date: undefined,
      description: undefined,
      stylist: undefined,
      city: { name: undefined },
      shoot_style_tags: undefined,
      shoot_images: undefined,
    });
  });

  it("handles null stylist data", async () => {
    const mockDataWithNullStylist = {
      ...mockRawData,
      stylist: null,
    };
    mockSingle.mockResolvedValue({ data: mockDataWithNullStylist });
    const result = await getLatestShootData();
    expect(result?.stylist).toBeNull();
  });

  it("handles null city data", async () => {
    const mockDataWithNullCity = {
      ...mockRawData,
      city: null,
    };
    mockSingle.mockResolvedValue({ data: mockDataWithNullCity });
    const result = await getLatestShootData();
    expect(result?.city).toEqual({ name: undefined });
  });

  it("handles null shoot_images", async () => {
    const mockDataWithNullImages = {
      ...mockRawData,
      shoot_images: null,
    };
    mockSingle.mockResolvedValue({ data: mockDataWithNullImages });
    const result = await getLatestShootData();
    expect(result?.shoot_images).toBeNull(); // Changed from toBeUndefined()
  });

  it("correctly transforms shoot_style_tags structure", async () => {
    const mockDataWithMultipleTags = {
      ...mockRawData,
      shoot_style_tags: [
        { style_tags: { name: "Style 1", slug: "style-1" } },
        { style_tags: { name: "Style 2", slug: "style-2" } },
      ],
    };
    mockSingle.mockResolvedValue({ data: mockDataWithMultipleTags });
    const result = await getLatestShootData();
    expect(result?.shoot_style_tags).toEqual([
      { name: "Style 1", slug: "style-1" },
      { name: "Style 2", slug: "style-2" },
    ]);
  });

  it("handles empty shoot_images array", async () => {
    const mockDataWithEmptyImages = {
      ...mockRawData,
      shoot_images: [],
    };
    mockSingle.mockResolvedValue({ data: mockDataWithEmptyImages });
    const result = await getLatestShootData();
    expect(result?.shoot_images).toEqual([]);
  });

  it("handles multiple shoot_images", async () => {
    const mockDataWithMultipleImages = {
      ...mockRawData,
      shoot_images: [
        { image_url: "/image1.jpg" },
        { image_url: "/image2.jpg" },
        { image_url: "/image3.jpg" },
      ],
    };
    mockSingle.mockResolvedValue({ data: mockDataWithMultipleImages });
    const result = await getLatestShootData();
    expect(result?.shoot_images).toEqual([
      { image_url: "/image1.jpg" },
      { image_url: "/image2.jpg" },
      { image_url: "/image3.jpg" },
    ]);
  });

  it("handles undefined shoot_style_tags", async () => {
    const mockDataWithUndefinedTags = {
      ...mockRawData,
      shoot_style_tags: undefined,
    };
    mockSingle.mockResolvedValue({ data: mockDataWithUndefinedTags });
    const result = await getLatestShootData();
    expect(result?.shoot_style_tags).toBeUndefined();
  });

  it("handles malformed shoot_style_tags data", async () => {
    const mockDataWithMalformedTags = {
      ...mockRawData,
      shoot_style_tags: [
        { style_tags: { name: "Valid Style", slug: "valid-style" } },
        { style_tags: { name: undefined, slug: "no-name" } },
        { style_tags: { name: "Another Style", slug: undefined } },
      ],
    };
    mockSingle.mockResolvedValue({ data: mockDataWithMalformedTags });
    const result = await getLatestShootData();
    expect(result?.shoot_style_tags).toEqual([
      { name: "Valid Style", slug: "valid-style" },
      { name: undefined, slug: "no-name" },
      { name: "Another Style", slug: undefined },
    ]);
  });

  it("handles database query with error response", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: "Database error" },
    });
    const result = await getLatestShootData();
    expect(result).toBeNull();
  });

  it("handles complete shoot data with all fields", async () => {
    const completeShootData = {
      name: "Complete Shoot",
      slug: "complete-shoot",
      publication_date: "2024-01-15",
      description: "A complete shoot with all fields populated",
      stylist: { name: "Complete Stylist", slug: "complete-stylist" },
      city: { name: "Complete City" },
      shoot_style_tags: [
        { style_tags: { name: "Complete Style", slug: "complete-style" } },
      ],
      shoot_images: [
        { image_url: "/complete-image1.jpg" },
        { image_url: "/complete-image2.jpg" },
      ],
    };
    mockSingle.mockResolvedValue({ data: completeShootData });
    const result = await getLatestShootData();
    expect(result).toEqual({
      name: "Complete Shoot",
      slug: "complete-shoot",
      publication_date: "2024-01-15",
      description: "A complete shoot with all fields populated",
      stylist: { name: "Complete Stylist", slug: "complete-stylist" },
      city: { name: "Complete City" },
      shoot_style_tags: [{ name: "Complete Style", slug: "complete-style" }],
      shoot_images: [
        { image_url: "/complete-image1.jpg" },
        { image_url: "/complete-image2.jpg" },
      ],
    });
  });

  it("handles shoot data with missing image_url in shoot_images", async () => {
    const mockDataWithMissingImageUrl = {
      ...mockRawData,
      shoot_images: [
        { image_url: "/valid-image.jpg" },
        { image_url: undefined },
        { image_url: "/another-valid-image.jpg" },
      ],
    };
    mockSingle.mockResolvedValue({ data: mockDataWithMissingImageUrl });
    const result = await getLatestShootData();
    expect(result?.shoot_images).toEqual([
      { image_url: "/valid-image.jpg" },
      { image_url: undefined },
      { image_url: "/another-valid-image.jpg" },
    ]);
  });

  it("handles shoot data with empty string values", async () => {
    const mockDataWithEmptyStrings = {
      name: "Test Shoot",
      slug: "test-shoot",
      publication_date: "",
      description: "",
      stylist: { name: "", slug: "" },
      city: { name: "" },
      shoot_style_tags: [{ style_tags: { name: "", slug: "" } }],
      shoot_images: [{ image_url: "" }],
    };
    mockSingle.mockResolvedValue({ data: mockDataWithEmptyStrings });
    const result = await getLatestShootData();
    expect(result).toEqual({
      name: "Test Shoot",
      slug: "test-shoot",
      publication_date: "",
      description: "",
      stylist: { name: "", slug: "" },
      city: { name: "" },
      shoot_style_tags: [{ name: "", slug: "" }],
      shoot_images: [{ image_url: "" }],
    });
  });

  it("handles shoot data with null values in nested objects", async () => {
    const mockDataWithNullNestedValues = {
      ...mockRawData,
      stylist: { name: null, slug: null },
      city: { name: null },
      shoot_style_tags: [{ style_tags: { name: null, slug: null } }],
      shoot_images: [{ image_url: null }],
    };
    mockSingle.mockResolvedValue({ data: mockDataWithNullNestedValues });
    const result = await getLatestShootData();
    expect(result).toEqual({
      name: mockRawData.name,
      slug: mockRawData.slug,
      publication_date: mockRawData.publication_date,
      description: mockRawData.description,
      stylist: { name: null, slug: null },
      city: { name: null },
      shoot_style_tags: [{ name: null, slug: null }],
      shoot_images: [{ image_url: null }],
    });
  });

  it("handles shoot data with special characters in text fields", async () => {
    const mockDataWithSpecialChars = {
      name: "Test Shoot with émojis 🎨 & symbols @#$%",
      slug: "test-shoot-with-special-chars",
      publication_date: "2024-01-01",
      description: "Description with unicode: 你好世界 �� and symbols: <>&\"'",
      stylist: { name: "Stylist with émojis ��", slug: "stylist-special" },
      city: { name: "City with symbols @#$%" },
      shoot_style_tags: [
        { style_tags: { name: "Style with émojis 🎪", slug: "style-special" } },
      ],
      shoot_images: [{ image_url: "/image-with-special-chars-émojis.jpg" }],
    };
    mockSingle.mockResolvedValue({ data: mockDataWithSpecialChars });
    const result = await getLatestShootData();
    expect(result).toEqual({
      name: "Test Shoot with émojis 🎨 & symbols @#$%",
      slug: "test-shoot-with-special-chars",
      publication_date: "2024-01-01",
      description: "Description with unicode: 你好世界 �� and symbols: <>&\"'",
      stylist: { name: "Stylist with émojis ��", slug: "stylist-special" },
      city: { name: "City with symbols @#$%" },
      shoot_style_tags: [
        { name: "Style with émojis 🎪", slug: "style-special" },
      ],
      shoot_images: [{ image_url: "/image-with-special-chars-émojis.jpg" }],
    });
  });

  it("handles shoot data with very large arrays", async () => {
    const mockDataWithLargeArrays = {
      ...mockRawData,
      shoot_style_tags: Array.from({ length: 100 }, (_, i) => ({
        style_tags: { name: `Style ${i + 1}`, slug: `style-${i + 1}` },
      })),
      shoot_images: Array.from({ length: 50 }, (_, i) => ({
        image_url: `/large-image-${i + 1}.jpg`,
      })),
    };
    mockSingle.mockResolvedValue({ data: mockDataWithLargeArrays });
    const result = await getLatestShootData();
    expect(result?.shoot_style_tags).toHaveLength(100);
    expect(result?.shoot_images).toHaveLength(50);
    expect(result?.shoot_style_tags[0]).toEqual({
      name: "Style 1",
      slug: "style-1",
    });
    expect(result?.shoot_style_tags[99]).toEqual({
      name: "Style 100",
      slug: "style-100",
    });
    expect(result?.shoot_images[0]).toEqual({
      image_url: "/large-image-1.jpg",
    });
    expect(result?.shoot_images[49]).toEqual({
      image_url: "/large-image-50.jpg",
    });
  });

  it("handles shoot data with extremely long text values", async () => {
    const longText = "A".repeat(10000); // 10KB of text
    const mockDataWithLongText = {
      name: longText,
      slug: "test-shoot-long-text",
      publication_date: "2024-01-01",
      description: longText,
      stylist: { name: longText, slug: "stylist-long-text" },
      city: { name: longText },
      shoot_style_tags: [
        { style_tags: { name: longText, slug: "style-long-text" } },
      ],
      shoot_images: [{ image_url: longText }],
    };
    mockSingle.mockResolvedValue({ data: mockDataWithLongText });
    const result = await getLatestShootData();
    expect(result?.name).toBe(longText);
    expect(result?.description).toBe(longText);
    expect(result?.stylist?.name).toBe(longText);
    expect(result?.city?.name).toBe(longText);
    expect(result?.shoot_style_tags?.[0]?.name).toBe(longText);
    expect(result?.shoot_images?.[0]?.image_url).toBe(longText);
  });

  it("handles malformed database response structure", async () => {
    const malformedResponse = {
      data: {
        name: "Test Shoot",
        slug: "test-shoot",
        publication_date: "2024-01-01",
        description: "Test description",
        stylist: "This should be an object but it's a string",
        city: 123, // This should be an object but it's a number
        shoot_style_tags: "This should be an array but it's a string",
        shoot_images: { image_url: "/test.jpg" }, // This should be an array but it's an object
      },
    };
    mockSingle.mockResolvedValue(malformedResponse);
    await expect(getLatestShootData()).rejects.toThrow();
  });

  it("handles concurrent calls to getLatestShootData", async () => {
    mockSingle.mockResolvedValue({ data: mockRawData });
    const promises = Array.from({ length: 5 }, () => getLatestShootData());
    const results = await Promise.all(promises);
    expect(results).toHaveLength(5);
    results.forEach((result) => {
      expect(result).toEqual({
        name: mockRawData.name,
        slug: mockRawData.slug,
        publication_date: mockRawData.publication_date,
        description: mockRawData.description,
        stylist: mockRawData.stylist,
        city: mockRawData.city,
        shoot_style_tags: [{ name: "Test Style", slug: "test-style" }],
        shoot_images: mockRawData.shoot_images,
      });
    });
  });

  it("handles shoot data with deeply nested malformed objects", async () => {
    const mockDataWithDeeplyNestedMalformed = {
      ...mockRawData,
      stylist: {
        name: { nested: { value: "This is too deep" } },
        slug: [1, 2, 3], // Should be string
      },
      city: {
        name: { cityName: "Nested city name" }, // Should be string
      },
      shoot_style_tags: [
        {
          style_tags: {
            name: { nested: "Deep nested name" }, // Should be string
            slug: { nested: "Deep nested slug" }, // Should be string
          },
        },
      ],
      shoot_images: [
        {
          image_url: {
            url: "/nested-image.jpg",
            metadata: { size: "large" },
          }, // Should be string
        },
      ],
    };
    mockSingle.mockResolvedValue({ data: mockDataWithDeeplyNestedMalformed });
    const result = await getLatestShootData();
    expect(result?.stylist).toEqual({
      name: { nested: { value: "This is too deep" } },
      slug: [1, 2, 3],
    });
    expect(result?.city).toEqual({
      name: { cityName: "Nested city name" },
    });
    expect(result?.shoot_style_tags).toEqual([
      {
        name: { nested: "Deep nested name" },
        slug: { nested: "Deep nested slug" },
      },
    ]);
    expect(result?.shoot_images).toEqual([
      {
        image_url: {
          url: "/nested-image.jpg",
          metadata: { size: "large" },
        },
      },
    ]);
  });
});
