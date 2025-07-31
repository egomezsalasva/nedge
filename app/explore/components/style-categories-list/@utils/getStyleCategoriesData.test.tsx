import { Mock } from "vitest";
import { getStyleCategoriesData } from "./getStyleCategoriesData";
import { createClient } from "@/utils/supabase/client";

vi.mock("@/utils/supabase/client", () => ({
  createClient: vi.fn(),
}));

type MockShootType = {
  id: number;
  preview_slug: string | null;
};

type MockShootStyleTagType = {
  shoot_id: string;
};

type MockStyleTagType = {
  name: string;
  slug: string;
  shoot_style_tags: MockShootStyleTagType[];
};

type MockStyleCategoryType = {
  name: string;
  style_tags: MockStyleTagType[];
};

type SupabaseResponseType<T> = {
  data: T | null;
  error: { message: string } | null;
};

const createMockShoot = (id: number, preview_slug: string | null = null) => ({
  id,
  preview_slug,
});

const createMockStyleTag = (
  name: string,
  slug: string,
  shootIds: string[],
): MockStyleTagType => ({
  name,
  slug,
  shoot_style_tags: shootIds.map((shoot_id) => ({ shoot_id })),
});

const createMockStyleCategory = (
  name: string,
  styleTags: MockStyleTagType[],
): MockStyleCategoryType => ({
  name,
  style_tags: styleTags,
});

const SHOOTS_QUERY = "id, preview_slug";
const STYLE_CATEGORIES_QUERY = `
    name,
    style_tags(
      name,
      slug,
      shoot_style_tags!inner(shoot_id)
    )
  `;

describe("getStyleCategoriesData", () => {
  let mockSupabase: {
    from: Mock;
  };

  const setupMockQueries = (
    shootsResponse: SupabaseResponseType<MockShootType[]>,
    categoriesResponse: SupabaseResponseType<MockStyleCategoryType[]>,
  ) => {
    const shootsSelect = vi.fn().mockReturnValue({
      is: vi.fn().mockResolvedValue(shootsResponse),
    });
    const categoriesSelect = vi.fn().mockResolvedValue(categoriesResponse);
    mockSupabase.from
      .mockReturnValueOnce({ select: shootsSelect })
      .mockReturnValueOnce({ select: categoriesSelect });
    return { shootsSelect, categoriesSelect };
  };

  beforeEach(() => {
    mockSupabase = {
      from: vi.fn(),
    };
    (createClient as Mock).mockReturnValue(mockSupabase);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("successful data retrieval", () => {
    it("should return formatted style categories with filtered public shoots", async () => {
      const mockPublicShoots = [
        createMockShoot(1),
        createMockShoot(2),
        createMockShoot(3),
      ];
      const mockStyleCategoriesData = [
        createMockStyleCategory("Casual", [
          createMockStyleTag("Streetwear", "streetwear", ["1", "2"]),
          createMockStyleTag("Minimalist", "minimalist", ["3"]),
        ]),
        createMockStyleCategory("Formal", [
          createMockStyleTag("Business", "business", ["1"]),
          createMockStyleTag("Evening", "evening", ["4"]), // Not public
        ]),
      ];
      const { shootsSelect, categoriesSelect } = setupMockQueries(
        { data: mockPublicShoots, error: null },
        { data: mockStyleCategoriesData, error: null },
      );
      const result = await getStyleCategoriesData();
      expect(mockSupabase.from).toHaveBeenCalledTimes(2);
      expect(mockSupabase.from).toHaveBeenNthCalledWith(1, "shoots");
      expect(mockSupabase.from).toHaveBeenNthCalledWith(2, "style_categories");
      expect(shootsSelect).toHaveBeenCalledWith(SHOOTS_QUERY);
      expect(categoriesSelect).toHaveBeenCalledWith(STYLE_CATEGORIES_QUERY);
      expect(result).toEqual([
        {
          name: "Casual",
          subStyles: [
            { name: "Minimalist", slug: "minimalist" },
            { name: "Streetwear", slug: "streetwear" },
          ],
        },
        {
          name: "Formal",
          subStyles: [{ name: "Business", slug: "business" }],
        },
      ]);
    });

    it("should sort categories and sub-styles alphabetically", async () => {
      const mockPublicShoots = [createMockShoot(1)];
      const mockStyleCategoriesData = [
        createMockStyleCategory("Zebra", [
          createMockStyleTag("Zulu", "zulu", ["1"]),
          createMockStyleTag("Alpha", "alpha", ["1"]),
        ]),
        createMockStyleCategory("Alpha", [
          createMockStyleTag("Beta", "beta", ["1"]),
        ]),
      ];
      setupMockQueries(
        { data: mockPublicShoots, error: null },
        { data: mockStyleCategoriesData, error: null },
      );
      const result = await getStyleCategoriesData();
      expect(result[0].name).toBe("Alpha");
      expect(result[1].name).toBe("Zebra");
      expect(result[1].subStyles[0].name).toBe("Alpha");
      expect(result[1].subStyles[1].name).toBe("Zulu");
    });

    it("should filter out categories with no public shoots", async () => {
      const mockPublicShoots = [createMockShoot(1)];
      const mockStyleCategoriesData = [
        createMockStyleCategory("Visible Category", [
          createMockStyleTag("Public Style", "public-style", ["1"]),
        ]),
        createMockStyleCategory("Hidden Category", [
          createMockStyleTag("Private Style", "private-style", ["999"]),
        ]),
      ];
      setupMockQueries(
        { data: mockPublicShoots, error: null },
        { data: mockStyleCategoriesData, error: null },
      );
      const result = await getStyleCategoriesData();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Visible Category");
    });

    it("should handle empty data gracefully", async () => {
      setupMockQueries({ data: [], error: null }, { data: [], error: null });
      const result = await getStyleCategoriesData();
      expect(result).toEqual([]);
    });

    it("should handle null data gracefully", async () => {
      setupMockQueries(
        { data: null, error: null },
        { data: null, error: null },
      );
      const result = await getStyleCategoriesData();
      expect(result).toEqual([]);
    });
  });

  describe("error handling", () => {
    it("should throw error when shoots query fails", async () => {
      const errorMessage = "Database connection failed";
      setupMockQueries(
        { data: null, error: { message: errorMessage } },
        { data: [], error: null },
      );
      await expect(getStyleCategoriesData()).rejects.toThrow(errorMessage);
    });

    it("should throw error when style_categories query fails", async () => {
      const errorMessage = "Style categories not found";
      setupMockQueries(
        { data: [createMockShoot(1)], error: null },
        { data: null, error: { message: errorMessage } },
      );
      await expect(getStyleCategoriesData()).rejects.toThrow(errorMessage);
    });
  });

  describe("edge cases", () => {
    it("should handle style tags without shoot_style_tags", async () => {
      const mockPublicShoots = [createMockShoot(1)];
      const mockStyleCategoriesData: MockStyleCategoryType[] = [
        {
          name: "Test Category",
          style_tags: [
            {
              name: "Orphaned Style",
              slug: "orphaned-style",
              shoot_style_tags: null as unknown as MockShootStyleTagType[], // No associated shoots
            },
          ],
        },
      ];
      setupMockQueries(
        { data: mockPublicShoots, error: null },
        { data: mockStyleCategoriesData, error: null },
      );
      const result = await getStyleCategoriesData();
      expect(result).toEqual([]);
    });

    it("should handle categories without style_tags", async () => {
      const mockPublicShoots = [createMockShoot(1)];
      const mockStyleCategoriesData: MockStyleCategoryType[] = [
        {
          name: "Empty Category",
          style_tags: null as unknown as MockStyleTagType[],
        },
      ];
      setupMockQueries(
        { data: mockPublicShoots, error: null },
        { data: mockStyleCategoriesData, error: null },
      );
      const result = await getStyleCategoriesData();
      expect(result).toEqual([]);
    });
  });

  it("should handle empty shoot_style_tags arrays", async () => {
    const mockPublicShoots = [createMockShoot(1)];
    const mockStyleCategoriesData = [
      {
        name: "Test Category",
        style_tags: [
          {
            name: "Style With Empty Shoots",
            slug: "empty-shoots",
            shoot_style_tags: [], // Empty array
          },
        ],
      },
    ];
    setupMockQueries(
      { data: mockPublicShoots, error: null },
      { data: mockStyleCategoriesData, error: null },
    );
    const result = await getStyleCategoriesData();
    expect(result).toEqual([]);
  });

  it("should handle non-numeric shoot_id values gracefully", async () => {
    const mockPublicShoots = [createMockShoot(1)];
    const mockStyleCategoriesData = [
      createMockStyleCategory("Test Category", [
        {
          name: "Invalid Shoot ID Style",
          slug: "invalid-id",
          shoot_style_tags: [{ shoot_id: "not-a-number" }],
        },
        createMockStyleTag("Valid Style", "valid", ["1"]),
      ]),
    ];
    setupMockQueries(
      { data: mockPublicShoots, error: null },
      { data: mockStyleCategoriesData, error: null },
    );
    const result = await getStyleCategoriesData();
    expect(result).toEqual([
      {
        name: "Test Category",
        subStyles: [{ name: "Valid Style", slug: "valid" }],
      },
    ]);
  });

  it("should handle mixed valid and invalid style tags in same category", async () => {
    const mockPublicShoots = [createMockShoot(1), createMockShoot(2)];
    const mockStyleCategoriesData: MockStyleCategoryType[] = [
      {
        name: "Mixed Category",
        style_tags: [
          createMockStyleTag("Valid Style 1", "valid-1", ["1"]),
          {
            name: "Invalid Style",
            slug: "invalid",
            shoot_style_tags: null as unknown as MockShootStyleTagType[],
          },
          createMockStyleTag("Valid Style 2", "valid-2", ["2"]),
          {
            name: "Another Invalid",
            slug: "invalid-2",
            shoot_style_tags: [{ shoot_id: "999" }], // Non-existent shoot
          },
        ],
      },
    ];
    setupMockQueries(
      { data: mockPublicShoots, error: null },
      { data: mockStyleCategoriesData, error: null },
    );
    const result = await getStyleCategoriesData();
    expect(result).toEqual([
      {
        name: "Mixed Category",
        subStyles: [
          { name: "Valid Style 1", slug: "valid-1" },
          { name: "Valid Style 2", slug: "valid-2" },
        ],
      },
    ]);
  });

  it("should verify shoots query uses correct filter", async () => {
    const mockPublicShoots = [createMockShoot(1)];
    const mockStyleCategoriesData = [
      createMockStyleCategory("Test", [
        createMockStyleTag("Test Style", "test", ["1"]),
      ]),
    ];
    const shootsSelect = vi.fn().mockReturnValue({
      is: vi.fn().mockResolvedValue({
        data: mockPublicShoots,
        error: null,
      }),
    });
    const categoriesSelect = vi.fn().mockResolvedValue({
      data: mockStyleCategoriesData,
      error: null,
    });
    mockSupabase.from
      .mockReturnValueOnce({ select: shootsSelect })
      .mockReturnValueOnce({ select: categoriesSelect });
    await getStyleCategoriesData();
    const mockIs = shootsSelect().is;
    expect(mockIs).toHaveBeenCalledWith("preview_slug", null);
  });
});
