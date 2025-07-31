import { render, screen } from "@testing-library/react";
import AccountBookmarks from "./page";
import type { SupabaseClient } from "@supabase/supabase-js";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("./@ui/RemoveBookmarkButton", () => ({
  default: ({ id }: { id: number }) => (
    <button data-testid="remove-bookmark-button">Remove {id}</button>
  ),
}));

describe("AccountBookmarks", () => {
  it("renders 'No bookmarks yet' message when there are no bookmarks", async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    };
    const { createClient } = await import("@/utils/supabase/server");
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as SupabaseClient,
    );
    render(await AccountBookmarks());
    expect(screen.getByText("No bookmarks yet")).toBeInTheDocument();
  });

  it("renders bookmarks when data is available", async () => {
    const mockBookmarks = [
      {
        id: 1,
        shoot: {
          name: "Summer Collection",
          slug: "summer-collection",
          stylist: {
            name: "Jane Doe",
            slug: "jane-doe",
          },
          shoot_images: [
            {
              image_url: "/test-image.jpg",
            },
          ],
        },
      },
    ];
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({
        data: mockBookmarks,
        error: null,
      }),
    };
    const { createClient } = await import("@/utils/supabase/server");
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as SupabaseClient,
    );
    render(await AccountBookmarks());
    expect(screen.getByText("Summer Collection:")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByAltText("Summer Collection")).toBeInTheDocument();
    expect(screen.getByTestId("remove-bookmark-button")).toBeInTheDocument();
    expect(screen.queryByText("No bookmarks yet")).not.toBeInTheDocument();
  });

  it("handles error when fetching bookmarks fails", async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      }),
    };
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { createClient } = await import("@/utils/supabase/server");
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as SupabaseClient,
    );
    render(await AccountBookmarks());
    expect(consoleSpy).toHaveBeenCalledWith({ message: "Database error" });
    consoleSpy.mockRestore();
  });

  it("renders multiple bookmarks correctly", async () => {
    const mockBookmarks = [
      {
        id: 1,
        shoot: {
          name: "Summer Collection",
          slug: "summer-collection",
          stylist: {
            name: "Jane Doe",
            slug: "jane-doe",
          },
          shoot_images: [
            {
              image_url: "/test-image-1.jpg",
            },
          ],
        },
      },
      {
        id: 2,
        shoot: {
          name: "Winter Vibes",
          slug: "winter-vibes",
          stylist: {
            name: "John Smith",
            slug: "john-smith",
          },
          shoot_images: [
            {
              image_url: "/test-image-2.jpg",
            },
          ],
        },
      },
    ];
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({
        data: mockBookmarks,
        error: null,
      }),
    };
    const { createClient } = await import("@/utils/supabase/server");
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as SupabaseClient,
    );
    render(await AccountBookmarks());
    expect(screen.getByText("Summer Collection:")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Winter Vibes:")).toBeInTheDocument();
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getAllByTestId("remove-bookmark-button")).toHaveLength(2);
  });

  it("renders correct links to shoot pages", async () => {
    const mockBookmarks = [
      {
        id: 1,
        shoot: {
          name: "Summer Collection",
          slug: "summer-collection",
          stylist: {
            name: "Jane Doe",
            slug: "jane-doe",
          },
          shoot_images: [
            {
              image_url: "/test-image.jpg",
            },
          ],
        },
      },
    ];
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({
        data: mockBookmarks,
        error: null,
      }),
    };
    const { createClient } = await import("@/utils/supabase/server");
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as SupabaseClient,
    );
    render(await AccountBookmarks());
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    links.forEach((link) => {
      expect(link).toHaveAttribute(
        "href",
        "/stylists/jane-doe/summer-collection",
      );
    });
  });

  it("handles bookmark with empty shoot_images array", async () => {
    const mockBookmarks = [
      {
        id: 1,
        shoot: {
          name: "Summer Collection",
          slug: "summer-collection",
          stylist: {
            name: "Jane Doe",
            slug: "jane-doe",
          },
          shoot_images: [],
        },
      },
    ];
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({
        data: mockBookmarks,
        error: null,
      }),
    };
    const { createClient } = await import("@/utils/supabase/server");
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as SupabaseClient,
    );
    await expect(async () => {
      const component = await AccountBookmarks();
      render(component);
    }).rejects.toThrow();
  });

  it("handles bookmark with missing stylist data", async () => {
    const mockBookmarks = [
      {
        id: 1,
        shoot: {
          name: "Summer Collection",
          slug: "summer-collection",
          stylist: null,
          shoot_images: [
            {
              image_url: "/test-image.jpg",
            },
          ],
        },
      },
    ];
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({
        data: mockBookmarks,
        error: null,
      }),
    };
    const { createClient } = await import("@/utils/supabase/server");
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as SupabaseClient,
    );
    await expect(async () => {
      const component = await AccountBookmarks();
      render(component);
    }).rejects.toThrow();
  });

  it("passes correct bookmark ID to RemoveBookmarkButton", async () => {
    const mockBookmarks = [
      {
        id: 123,
        shoot: {
          name: "Summer Collection",
          slug: "summer-collection",
          stylist: {
            name: "Jane Doe",
            slug: "jane-doe",
          },
          shoot_images: [
            {
              image_url: "/test-image.jpg",
            },
          ],
        },
      },
    ];
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({
        data: mockBookmarks,
        error: null,
      }),
    };
    const { createClient } = await import("@/utils/supabase/server");
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as SupabaseClient,
    );
    render(await AccountBookmarks());
    expect(screen.getByText("Remove 123")).toBeInTheDocument();
  });

  it("renders correct image alt text", async () => {
    const mockBookmarks = [
      {
        id: 1,
        shoot: {
          name: "Autumn Fashion Shoot",
          slug: "autumn-fashion-shoot",
          stylist: {
            name: "Jane Doe",
            slug: "jane-doe",
          },
          shoot_images: [
            {
              image_url: "/test-image.jpg",
            },
          ],
        },
      },
    ];
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({
        data: mockBookmarks,
        error: null,
      }),
    };
    const { createClient } = await import("@/utils/supabase/server");
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as SupabaseClient,
    );
    render(await AccountBookmarks());
    expect(screen.getByAltText("Autumn Fashion Shoot")).toBeInTheDocument();
  });

  it("handles null data response from database", async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    };
    const { createClient } = await import("@/utils/supabase/server");
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as SupabaseClient,
    );
    render(await AccountBookmarks());
    // When bookmarks is null, it won't show "No bookmarks yet" and will render empty container
    expect(screen.queryByText("No bookmarks yet")).not.toBeInTheDocument();
  });

  it("calls Supabase with correct query parameters", async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    };
    const { createClient } = await import("@/utils/supabase/server");
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as SupabaseClient,
    );

    render(await AccountBookmarks());

    expect(mockSupabase.from).toHaveBeenCalledWith("profile_bookmarks");
    expect(mockSupabase.select).toHaveBeenCalledWith(`
    id,
    shoot:shoot_id (
      *,
      stylist:stylists!stylist_id (
        name,
        slug
      ),
      shoot_images (image_url)
    )
  `);
  });

  it("handles large number of bookmarks", async () => {
    const mockBookmarks = Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      shoot: {
        name: `Shoot ${index + 1}`,
        slug: `shoot-${index + 1}`,
        stylist: {
          name: `Stylist ${index + 1}`,
          slug: `stylist-${index + 1}`,
        },
        shoot_images: [
          {
            image_url: `/test-image-${index + 1}.jpg`,
          },
        ],
      },
    }));
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({
        data: mockBookmarks,
        error: null,
      }),
    };
    const { createClient } = await import("@/utils/supabase/server");
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as SupabaseClient,
    );
    render(await AccountBookmarks());
    expect(screen.getByText("Shoot 1:")).toBeInTheDocument();
    expect(screen.getByText("Shoot 50:")).toBeInTheDocument();
    expect(screen.getAllByTestId("remove-bookmark-button")).toHaveLength(50);
  });

  it("handles special characters in names", async () => {
    const mockBookmarks = [
      {
        id: 1,
        shoot: {
          name: "Spring & Summer '24",
          slug: "spring-summer-24",
          stylist: {
            name: "José María-González",
            slug: "jose-maria-gonzalez",
          },
          shoot_images: [
            {
              image_url: "/test-image.jpg",
            },
          ],
        },
      },
    ];
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({
        data: mockBookmarks,
        error: null,
      }),
    };
    const { createClient } = await import("@/utils/supabase/server");
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as SupabaseClient,
    );
    render(await AccountBookmarks());
    expect(screen.getByText("Spring & Summer '24:")).toBeInTheDocument();
    expect(screen.getByText("José María-González")).toBeInTheDocument();
    expect(screen.getByAltText("Spring & Summer '24")).toBeInTheDocument();
  });

  it("renders bookmarks in correct order", async () => {
    const mockBookmarks = [
      {
        id: 1,
        shoot: {
          name: "First Bookmark",
          slug: "first-bookmark",
          stylist: {
            name: "Jane Doe",
            slug: "jane-doe",
          },
          shoot_images: [
            {
              image_url: "/test-image-1.jpg",
            },
          ],
        },
      },
      {
        id: 2,
        shoot: {
          name: "Second Bookmark",
          slug: "second-bookmark",
          stylist: {
            name: "John Smith",
            slug: "john-smith",
          },
          shoot_images: [
            {
              image_url: "/test-image-2.jpg",
            },
          ],
        },
      },
    ];
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({
        data: mockBookmarks,
        error: null,
      }),
    };
    const { createClient } = await import("@/utils/supabase/server");
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as SupabaseClient,
    );
    render(await AccountBookmarks());
    const bookmarkElements = screen.getAllByText(/Bookmark:/);
    expect(bookmarkElements[0]).toHaveTextContent("First Bookmark:");
    expect(bookmarkElements[1]).toHaveTextContent("Second Bookmark:");
  });

  it("handles graceful degradation with malformed bookmark", async () => {
    const mockBookmarks = [
      {
        id: 1,
        shoot: {
          name: "Valid Bookmark",
          slug: "valid-bookmark",
          stylist: {
            name: "Jane Doe",
            slug: "jane-doe",
          },
          shoot_images: [
            {
              image_url: "/test-image.jpg",
            },
          ],
        },
      },
      {
        id: 2,
        shoot: null,
      },
    ];
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({
        data: mockBookmarks,
        error: null,
      }),
    };
    const { createClient } = await import("@/utils/supabase/server");
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as SupabaseClient,
    );
    await expect(async () => {
      const component = await AccountBookmarks();
      render(component);
    }).rejects.toThrow();
  });
});
