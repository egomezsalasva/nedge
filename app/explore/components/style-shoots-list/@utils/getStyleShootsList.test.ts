import { Mock } from "vitest";
import { getStyleShootsList } from "./getStyleShootsList";
import { createClient } from "@/utils/supabase/client";

vi.mock("@/utils/supabase/client", () => ({
  createClient: vi.fn(),
}));

const mockStyleTag = {
  id: 1,
};

const mockShootIdRows = [{ shoot_id: 1 }, { shoot_id: 2 }];

const mockShootsData = [
  {
    name: "Test Shoot 1",
    slug: "test-shoot-1",
    preview_slug: null,
    publication_date: "2024-01-15",
    description: "Test description",
    stylist: [{ name: "Test Stylist", slug: "test-stylist" }],
    city: [{ name: "Test City" }],
    shoot_style_tags: [
      { style_tags: { name: "Style 1", slug: "style-1" } },
      { style_tags: { name: "Style 2", slug: "style-2" } },
    ],
    shoot_images: [
      { image_url: "/test-image-1.jpg" },
      { image_url: "/test-image-2.jpg" },
    ],
  },
  {
    name: "Test Shoot 2",
    slug: "test-shoot-2",
    preview_slug: "preview-slug", // This should be filtered out
    publication_date: "2024-01-10",
    description: "Test description 2",
    stylist: [{ name: "Test Stylist 2", slug: "test-stylist-2" }],
    city: [{ name: "Test City 2" }],
    shoot_style_tags: [{ style_tags: { name: "Style 3", slug: "style-3" } }],
    shoot_images: [{ image_url: "/test-image-3.jpg" }],
  },
  {
    name: "Test Shoot 3",
    slug: "test-shoot-3",
    preview_slug: "   ", // Empty string should be included
    publication_date: "2024-01-05",
    description: "Test description 3",
    stylist: [{ name: "Test Stylist 3", slug: "test-stylist-3" }],
    city: [{ name: "Test City 3" }],
    shoot_style_tags: [{ style_tags: { name: "Style 4", slug: "style-4" } }],
    shoot_images: [{ image_url: "/test-image-4.jpg" }],
  },
];

describe("getStyleShootsList", () => {
  let mockSupabase: { from: Mock };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase = {
      from: vi.fn(),
    };
    (createClient as unknown as Mock).mockReturnValue(mockSupabase);
  });

  it("should return empty shoots array when subStyle is empty", async () => {
    const result = await getStyleShootsList("");
    expect(result).toEqual({ shoots: [] });
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  it("should return empty shoots array when subStyle is not provided", async () => {
    const result = await getStyleShootsList(undefined as unknown as string);
    expect(result).toEqual({ shoots: [] });
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  it("should return empty shoots array when style tag is not found", async () => {
    const mockSingle = vi.fn().mockResolvedValue({ data: null });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    mockSupabase.from.mockReturnValue({ select: mockSelect });
    const result = await getStyleShootsList("non-existent-style");
    expect(result).toEqual({ shoots: [] });
    expect(mockSupabase.from).toHaveBeenCalledWith("style_tags");
    expect(mockSelect).toHaveBeenCalledWith("id");
    expect(mockEq).toHaveBeenCalledWith("slug", "non-existent-style");
    expect(mockSingle).toHaveBeenCalled();
  });

  it("should return empty shoots array when no shoots are associated with the style tag", async () => {
    const mockSingle = vi.fn().mockResolvedValue({ data: mockStyleTag });
    const mockEqForStyleTags = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelectForStyleTags = vi
      .fn()
      .mockReturnValue({ eq: mockEqForStyleTags });
    const mockEqForShootStyleTags = vi.fn().mockResolvedValue({ data: null });
    const mockSelectForShootStyleTags = vi
      .fn()
      .mockReturnValue({ eq: mockEqForShootStyleTags });
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "style_tags") {
        return { select: mockSelectForStyleTags };
      } else if (table === "shoot_style_tags") {
        return { select: mockSelectForShootStyleTags };
      }
      return {};
    });
    const result = await getStyleShootsList("test-style");
    expect(result).toEqual({ shoots: [] });
    expect(mockSupabase.from).toHaveBeenCalledWith("style_tags");
    expect(mockSupabase.from).toHaveBeenCalledWith("shoot_style_tags");
    expect(mockSelectForShootStyleTags).toHaveBeenCalledWith("shoot_id");
    expect(mockEqForShootStyleTags).toHaveBeenCalledWith(
      "style_tag_id",
      mockStyleTag.id,
    );
  });

  it("should return empty shoots array when shoot_style_tags returns empty array", async () => {
    const mockSingle = vi.fn().mockResolvedValue({ data: mockStyleTag });
    const mockEqForStyleTags = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelectForStyleTags = vi
      .fn()
      .mockReturnValue({ eq: mockEqForStyleTags });
    const mockEqForShootStyleTags = vi.fn().mockResolvedValue({ data: [] });
    const mockSelectForShootStyleTags = vi
      .fn()
      .mockReturnValue({ eq: mockEqForShootStyleTags });
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "style_tags") {
        return { select: mockSelectForStyleTags };
      } else if (table === "shoot_style_tags") {
        return { select: mockSelectForShootStyleTags };
      }
      return {};
    });
    const result = await getStyleShootsList("test-style");
    expect(result).toEqual({ shoots: [] });
  });

  it("should successfully fetch and transform shoots data", async () => {
    const mockSingle = vi.fn().mockResolvedValue({ data: mockStyleTag });
    const mockEqForStyleTags = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelectForStyleTags = vi
      .fn()
      .mockReturnValue({ eq: mockEqForStyleTags });
    const mockEqForShootStyleTags = vi
      .fn()
      .mockResolvedValue({ data: mockShootIdRows });
    const mockSelectForShootStyleTags = vi
      .fn()
      .mockReturnValue({ eq: mockEqForShootStyleTags });
    const mockOrder = vi.fn().mockResolvedValue({ data: mockShootsData });
    const mockIn = vi.fn().mockReturnValue({ order: mockOrder });
    const mockSelectForShoots = vi.fn().mockReturnValue({ in: mockIn });
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "style_tags") {
        return { select: mockSelectForStyleTags };
      } else if (table === "shoot_style_tags") {
        return { select: mockSelectForShootStyleTags };
      } else if (table === "shoots") {
        return { select: mockSelectForShoots };
      }
      return {};
    });
    const result = await getStyleShootsList("test-style");
    expect(result.shoots).toHaveLength(2); // Only shoots without preview_slug or with empty preview_slug
    expect(result.shoots[0]).toEqual({
      name: "Test Shoot 1",
      slug: "test-shoot-1",
      preview_slug: null,
      publication_date: "2024-01-15",
      description: "Test description",
      stylist: { name: "Test Stylist", slug: "test-stylist" },
      city: { name: "Test City" },
      shoot_style_tags: [
        { name: "Style 1", slug: "style-1" },
        { name: "Style 2", slug: "style-2" },
      ],
      first_image: "/test-image-1.jpg",
    });
    expect(result.shoots[1]).toEqual({
      name: "Test Shoot 3",
      slug: "test-shoot-3",
      preview_slug: "   ",
      publication_date: "2024-01-05",
      description: "Test description 3",
      stylist: { name: "Test Stylist 3", slug: "test-stylist-3" },
      city: { name: "Test City 3" },
      shoot_style_tags: [{ name: "Style 4", slug: "style-4" }],
      first_image: "/test-image-4.jpg",
    });
    expect(mockSupabase.from).toHaveBeenCalledWith("shoots");
    expect(mockSelectForShoots).toHaveBeenCalledWith(`
        name, 
        slug, 
        preview_slug,
        publication_date,
        description,
        stylist:stylists!stylist_id (name, slug),
        city:cities!city_id (name),
        shoot_style_tags (style_tags (name, slug)),
        shoot_images (image_url)
      `);
    expect(mockIn).toHaveBeenCalledWith("id", [1, 2]);
    expect(mockOrder).toHaveBeenCalledWith("publication_date", {
      ascending: false,
    });
  });

  it("should filter out shoots with non-empty preview_slug", async () => {
    const mockSingle = vi.fn().mockResolvedValue({ data: mockStyleTag });
    const mockEqForStyleTags = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelectForStyleTags = vi
      .fn()
      .mockReturnValue({ eq: mockEqForStyleTags });
    const mockEqForShootStyleTags = vi
      .fn()
      .mockResolvedValue({ data: mockShootIdRows });
    const mockSelectForShootStyleTags = vi
      .fn()
      .mockReturnValue({ eq: mockEqForShootStyleTags });
    const mockOrder = vi.fn().mockResolvedValue({ data: mockShootsData });
    const mockIn = vi.fn().mockReturnValue({ order: mockOrder });
    const mockSelectForShoots = vi.fn().mockReturnValue({ in: mockIn });
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "style_tags") {
        return { select: mockSelectForStyleTags };
      } else if (table === "shoot_style_tags") {
        return { select: mockSelectForShootStyleTags };
      } else if (table === "shoots") {
        return { select: mockSelectForShoots };
      }
      return {};
    });
    const result = await getStyleShootsList("test-style");
    // Should exclude "Test Shoot 2" which has preview_slug: "preview-slug"
    expect(result.shoots).toHaveLength(2);
    expect(
      result.shoots.find((shoot) => shoot.name === "Test Shoot 2"),
    ).toBeUndefined();
  });

  it("should handle shoots with missing or null data gracefully", async () => {
    const incompleteShootsData = [
      {
        name: "Incomplete Shoot",
        slug: "incomplete-shoot",
        preview_slug: null,
        publication_date: "2024-01-15",
        description: "Test description",
        stylist: null,
        city: null,
        shoot_style_tags: null,
        shoot_images: null,
      },
    ];
    const mockSingle = vi.fn().mockResolvedValue({ data: mockStyleTag });
    const mockEqForStyleTags = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelectForStyleTags = vi
      .fn()
      .mockReturnValue({ eq: mockEqForStyleTags });
    const mockEqForShootStyleTags = vi
      .fn()
      .mockResolvedValue({ data: mockShootIdRows });
    const mockSelectForShootStyleTags = vi
      .fn()
      .mockReturnValue({ eq: mockEqForShootStyleTags });
    const mockOrder = vi.fn().mockResolvedValue({ data: incompleteShootsData });
    const mockIn = vi.fn().mockReturnValue({ order: mockOrder });
    const mockSelectForShoots = vi.fn().mockReturnValue({ in: mockIn });
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "style_tags") {
        return { select: mockSelectForStyleTags };
      } else if (table === "shoot_style_tags") {
        return { select: mockSelectForShootStyleTags };
      } else if (table === "shoots") {
        return { select: mockSelectForShoots };
      }
      return {};
    });
    const result = await getStyleShootsList("test-style");
    expect(result.shoots[0]).toEqual({
      name: "Incomplete Shoot",
      slug: "incomplete-shoot",
      preview_slug: null,
      publication_date: "2024-01-15",
      description: "Test description",
      stylist: null,
      city: null,
      shoot_style_tags: null,
      first_image: "",
    });
  });

  it("should handle empty shoots data from database", async () => {
    const mockSingle = vi.fn().mockResolvedValue({ data: mockStyleTag });
    const mockEqForStyleTags = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelectForStyleTags = vi
      .fn()
      .mockReturnValue({ eq: mockEqForStyleTags });
    const mockEqForShootStyleTags = vi
      .fn()
      .mockResolvedValue({ data: mockShootIdRows });
    const mockSelectForShootStyleTags = vi
      .fn()
      .mockReturnValue({ eq: mockEqForShootStyleTags });
    const mockOrder = vi.fn().mockResolvedValue({ data: null });
    const mockIn = vi.fn().mockReturnValue({ order: mockOrder });
    const mockSelectForShoots = vi.fn().mockReturnValue({ in: mockIn });
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "style_tags") {
        return { select: mockSelectForStyleTags };
      } else if (table === "shoot_style_tags") {
        return { select: mockSelectForShootStyleTags };
      } else if (table === "shoots") {
        return { select: mockSelectForShoots };
      }
      return {};
    });
    const result = await getStyleShootsList("test-style");
    expect(result).toEqual({ shoots: [] });
  });

  it("should handle shoots with empty images array", async () => {
    const shootsDataWithoutImages = [
      {
        ...mockShootsData[0],
        shoot_images: [],
      },
    ];
    const mockSingle = vi.fn().mockResolvedValue({ data: mockStyleTag });
    const mockEqForStyleTags = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelectForStyleTags = vi
      .fn()
      .mockReturnValue({ eq: mockEqForStyleTags });
    const mockEqForShootStyleTags = vi
      .fn()
      .mockResolvedValue({ data: mockShootIdRows });
    const mockSelectForShootStyleTags = vi
      .fn()
      .mockReturnValue({ eq: mockEqForShootStyleTags });
    const mockOrder = vi
      .fn()
      .mockResolvedValue({ data: shootsDataWithoutImages });
    const mockIn = vi.fn().mockReturnValue({ order: mockOrder });
    const mockSelectForShoots = vi.fn().mockReturnValue({ in: mockIn });
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "style_tags") {
        return { select: mockSelectForStyleTags };
      } else if (table === "shoot_style_tags") {
        return { select: mockSelectForShootStyleTags };
      } else if (table === "shoots") {
        return { select: mockSelectForShoots };
      }
      return {};
    });
    const result = await getStyleShootsList("test-style");
    expect(result.shoots[0].first_image).toBe("");
  });

  it("should handle arrays with single items correctly", async () => {
    const singleItemData = [
      {
        ...mockShootsData[0],
        stylist: { name: "Single Stylist", slug: "single-stylist" }, // Not an array
        city: { name: "Single City" }, // Not an array
      },
    ];
    const mockSingle = vi.fn().mockResolvedValue({ data: mockStyleTag });
    const mockEqForStyleTags = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelectForStyleTags = vi
      .fn()
      .mockReturnValue({ eq: mockEqForStyleTags });
    const mockEqForShootStyleTags = vi
      .fn()
      .mockResolvedValue({ data: mockShootIdRows });
    const mockSelectForShootStyleTags = vi
      .fn()
      .mockReturnValue({ eq: mockEqForShootStyleTags });
    const mockOrder = vi.fn().mockResolvedValue({ data: singleItemData });
    const mockIn = vi.fn().mockReturnValue({ order: mockOrder });
    const mockSelectForShoots = vi.fn().mockReturnValue({ in: mockIn });
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "style_tags") {
        return { select: mockSelectForStyleTags };
      } else if (table === "shoot_style_tags") {
        return { select: mockSelectForShootStyleTags };
      } else if (table === "shoots") {
        return { select: mockSelectForShoots };
      }
      return {};
    });
    const result = await getStyleShootsList("test-style");
    expect(result.shoots[0].stylist).toEqual({
      name: "Single Stylist",
      slug: "single-stylist",
    });
    expect(result.shoots[0].city).toEqual({ name: "Single City" });
  });

  it("should handle database errors gracefully", async () => {
    const mockSingle = vi
      .fn()
      .mockRejectedValue(new Error("Database connection failed"));
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    mockSupabase.from.mockReturnValue({ select: mockSelect });
    await expect(getStyleShootsList("test-style")).rejects.toThrow(
      "Database connection failed",
    );
  });

  it("should handle empty shoot_style_tags array", async () => {
    const shootsDataWithEmptyTags = [
      {
        ...mockShootsData[0],
        shoot_style_tags: [],
      },
    ];
    const mockSingle = vi.fn().mockResolvedValue({ data: mockStyleTag });
    const mockEqForStyleTags = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelectForStyleTags = vi
      .fn()
      .mockReturnValue({ eq: mockEqForStyleTags });
    const mockEqForShootStyleTags = vi
      .fn()
      .mockResolvedValue({ data: mockShootIdRows });
    const mockSelectForShootStyleTags = vi
      .fn()
      .mockReturnValue({ eq: mockEqForShootStyleTags });
    const mockOrder = vi
      .fn()
      .mockResolvedValue({ data: shootsDataWithEmptyTags });
    const mockIn = vi.fn().mockReturnValue({ order: mockOrder });
    const mockSelectForShoots = vi.fn().mockReturnValue({ in: mockIn });
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "style_tags") {
        return { select: mockSelectForStyleTags };
      } else if (table === "shoot_style_tags") {
        return { select: mockSelectForShootStyleTags };
      } else if (table === "shoots") {
        return { select: mockSelectForShoots };
      }
      return {};
    });
    const result = await getStyleShootsList("test-style");
    expect(result.shoots[0].shoot_style_tags).toEqual([]);
  });

  it("should handle multiple stylists and cities correctly", async () => {
    const multipleItemsData = [
      {
        ...mockShootsData[0],
        stylist: [
          { name: "First Stylist", slug: "first-stylist" },
          { name: "Second Stylist", slug: "second-stylist" },
        ],
        city: [{ name: "First City" }, { name: "Second City" }],
      },
    ];
    const mockSingle = vi.fn().mockResolvedValue({ data: mockStyleTag });
    const mockEqForStyleTags = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelectForStyleTags = vi
      .fn()
      .mockReturnValue({ eq: mockEqForStyleTags });
    const mockEqForShootStyleTags = vi
      .fn()
      .mockResolvedValue({ data: mockShootIdRows });
    const mockSelectForShootStyleTags = vi
      .fn()
      .mockReturnValue({ eq: mockEqForShootStyleTags });
    const mockOrder = vi.fn().mockResolvedValue({ data: multipleItemsData });
    const mockIn = vi.fn().mockReturnValue({ order: mockOrder });
    const mockSelectForShoots = vi.fn().mockReturnValue({ in: mockIn });
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "style_tags") {
        return { select: mockSelectForStyleTags };
      } else if (table === "shoot_style_tags") {
        return { select: mockSelectForShootStyleTags };
      } else if (table === "shoots") {
        return { select: mockSelectForShoots };
      }
      return {};
    });
    const result = await getStyleShootsList("test-style");
    // Should only take the first stylist and city
    expect(result.shoots[0].stylist).toEqual({
      name: "First Stylist",
      slug: "first-stylist",
    });
    expect(result.shoots[0].city).toEqual({ name: "First City" });
  });

  it("should handle preview_slug with different whitespace scenarios", async () => {
    const whitespaceTestData = [
      {
        ...mockShootsData[0],
        name: "Whitespace Test 1",
        preview_slug: "", // Empty string
      },
      {
        ...mockShootsData[0],
        name: "Whitespace Test 2",
        preview_slug: " ", // Single space
      },
      {
        ...mockShootsData[0],
        name: "Whitespace Test 3",
        preview_slug: "\t\n", // Tab and newline
      },
      {
        ...mockShootsData[0],
        name: "Whitespace Test 4",
        preview_slug: "actual-preview", // Non-empty
      },
    ];
    const mockSingle = vi.fn().mockResolvedValue({ data: mockStyleTag });
    const mockEqForStyleTags = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelectForStyleTags = vi
      .fn()
      .mockReturnValue({ eq: mockEqForStyleTags });
    const mockEqForShootStyleTags = vi
      .fn()
      .mockResolvedValue({ data: mockShootIdRows });
    const mockSelectForShootStyleTags = vi
      .fn()
      .mockReturnValue({ eq: mockEqForShootStyleTags });
    const mockOrder = vi.fn().mockResolvedValue({ data: whitespaceTestData });
    const mockIn = vi.fn().mockReturnValue({ order: mockOrder });
    const mockSelectForShoots = vi.fn().mockReturnValue({ in: mockIn });
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "style_tags") {
        return { select: mockSelectForStyleTags };
      } else if (table === "shoot_style_tags") {
        return { select: mockSelectForShootStyleTags };
      } else if (table === "shoots") {
        return { select: mockSelectForShoots };
      }
      return {};
    });
    const result = await getStyleShootsList("test-style");
    // Should include first 3 (empty/whitespace) but exclude the 4th (non-empty)
    expect(result.shoots).toHaveLength(3);
    expect(
      result.shoots.find((shoot) => shoot.name === "Whitespace Test 4"),
    ).toBeUndefined();
  });

  it("should handle null image URLs", async () => {
    const nullImageData = [
      {
        ...mockShootsData[0],
        shoot_images: [{ image_url: null }, { image_url: "/valid-image.jpg" }],
      },
    ];
    const mockSingle = vi.fn().mockResolvedValue({ data: mockStyleTag });
    const mockEqForStyleTags = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelectForStyleTags = vi
      .fn()
      .mockReturnValue({ eq: mockEqForStyleTags });
    const mockEqForShootStyleTags = vi
      .fn()
      .mockResolvedValue({ data: mockShootIdRows });
    const mockSelectForShootStyleTags = vi
      .fn()
      .mockReturnValue({ eq: mockEqForShootStyleTags });
    const mockOrder = vi.fn().mockResolvedValue({ data: nullImageData });
    const mockIn = vi.fn().mockReturnValue({ order: mockOrder });
    const mockSelectForShoots = vi.fn().mockReturnValue({ in: mockIn });
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "style_tags") {
        return { select: mockSelectForStyleTags };
      } else if (table === "shoot_style_tags") {
        return { select: mockSelectForShootStyleTags };
      } else if (table === "shoots") {
        return { select: mockSelectForShoots };
      }
      return {};
    });
    const result = await getStyleShootsList("test-style");
    // Should handle null image_url gracefully
    expect(result.shoots[0].first_image).toBe("");
  });
});
