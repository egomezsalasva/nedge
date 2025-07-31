import { describe, it, expect, vi } from "vitest";
import { GET } from "./route";
import { createClient } from "@/utils/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: null },
        error: new Error("Unauthorized"),
      }),
    },
  })),
}));

describe("GET /api/account/my-wardrobe", () => {
  it("should handle requests with preview shoot source_pathname", async () => {
    const mockRequest = new Request(
      "http://localhost:3000/api/account/my-wardrobe?source_pathname=/shoot-preview/test",
    );
    const response = await GET(mockRequest);
    expect(response).toBeDefined();
  });

  it("should return 403 for preview shoot source_pathname", async () => {
    const mockRequest = new Request(
      "http://localhost:3000/api/account/my-wardrobe?source_pathname=/shoot-preview/test",
    );
    const response = await GET(mockRequest);
    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toBe("Cannot access wardrobe info for preview shoots.");
  });

  it("should return 401 for unauthorized user", async () => {
    const mockRequest = new Request(
      "http://localhost:3000/api/account/my-wardrobe",
    );
    const response = await GET(mockRequest);
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 when profile not found", async () => {
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { email: "test@example.com" } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: new Error("Profile not found"),
            }),
          }),
        }),
      }),
    } as unknown as SupabaseClient);
    const mockRequest = new Request(
      "http://localhost:3000/api/account/my-wardrobe",
    );
    const response = await GET(mockRequest);
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Profile not found");
  });

  it("should return isSaved status for specific garment", async () => {
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { email: "test@example.com" } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: "profile-123" },
              error: null,
            }),
            eq: vi.fn().mockResolvedValue({
              data: [{ id: "garment-1" }],
            }),
          }),
        }),
      }),
    } as unknown as SupabaseClient);
    const mockRequest = new Request(
      "http://localhost:3000/api/account/my-wardrobe?garment_id=123",
    );
    const response = await GET(mockRequest);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.isSaved).toBe(true);
  });

  it("should return full wardrobe when no garment_id provided", async () => {
    const mockWardrobeData = [
      {
        garment_id: "123",
        source_pathname: "/stylists/test/shoot1",
        garments: {
          name: "Test Garment",
          brands: { name: "Test Brand" },
          garment_type: { name: "Shirt" },
        },
      },
    ];
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { email: "test@example.com" } },
          error: null,
        }),
      },
      from: vi
        .fn()
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "profile-123" },
                error: null,
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: mockWardrobeData,
              error: null,
            }),
          }),
        }),
    } as unknown as SupabaseClient);
    const mockRequest = new Request(
      "http://localhost:3000/api/account/my-wardrobe",
    );
    const response = await GET(mockRequest);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.wardrobe).toEqual(mockWardrobeData);
  });

  it("should return 400 for POST request missing garment_id", async () => {
    const mockRequest = new Request(
      "http://localhost:3000/api/account/my-wardrobe",
      {
        method: "POST",
        body: JSON.stringify({}),
        headers: { "Content-Type": "application/json" },
      },
    );
    const { POST } = await import("./route");
    const response = await POST(mockRequest);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Missing garment_id");
  });

  it("should return 403 for POST request with preview shoot source_pathname", async () => {
    const mockRequest = new Request(
      "http://localhost:3000/api/account/my-wardrobe",
      {
        method: "POST",
        body: JSON.stringify({
          garment_id: "123",
          source_pathname: "/shoot-preview/test",
        }),
        headers: { "Content-Type": "application/json" },
      },
    );
    const { POST } = await import("./route");
    const response = await POST(mockRequest);
    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toBe("Cannot save garments from preview shoots.");
  });

  it("should return 401 for POST request with unauthorized user", async () => {
    const mockRequest = new Request(
      "http://localhost:3000/api/account/my-wardrobe",
      {
        method: "POST",
        body: JSON.stringify({
          garment_id: "123",
          source_pathname: "/stylists/test/shoot1",
        }),
        headers: { "Content-Type": "application/json" },
      },
    );
    const { POST } = await import("./route");
    const response = await POST(mockRequest);
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 400 for DELETE request missing garmentId", async () => {
    const mockRequest = new Request(
      "http://localhost:3000/api/account/my-wardrobe",
      {
        method: "DELETE",
        body: JSON.stringify({}),
        headers: { "Content-Type": "application/json" },
      },
    );
    const { DELETE } = await import("./route");
    const response = await DELETE(mockRequest);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("garmentId is required");
  });

  it("should return 403 for DELETE request with preview shoot source_pathname", async () => {
    const mockRequest = new Request(
      "http://localhost:3000/api/account/my-wardrobe",
      {
        method: "DELETE",
        body: JSON.stringify({
          garmentId: "123",
          source_pathname: "/shoot-preview/test",
        }),
        headers: { "Content-Type": "application/json" },
      },
    );
    const { DELETE } = await import("./route");
    const response = await DELETE(mockRequest);
    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toBe("Cannot delete garments from preview shoots.");
  });

  it("should successfully delete garment for DELETE request", async () => {
    vi.mocked(createClient).mockResolvedValueOnce({
      from: vi.fn().mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: null,
          }),
        }),
      }),
    } as unknown as SupabaseClient);

    const mockRequest = new Request(
      "http://localhost:3000/api/account/my-wardrobe",
      {
        method: "DELETE",
        body: JSON.stringify({
          garmentId: "123",
          source_pathname: "/stylists/test/shoot1",
        }),
        headers: { "Content-Type": "application/json" },
      },
    );
    const { DELETE } = await import("./route");
    const response = await DELETE(mockRequest);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  it("should return 500 for DELETE request with database error", async () => {
    vi.mocked(createClient).mockResolvedValueOnce({
      from: vi.fn().mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            error: new Error("Database connection failed"),
          }),
        }),
      }),
    } as unknown as SupabaseClient);
    const mockRequest = new Request(
      "http://localhost:3000/api/account/my-wardrobe",
      {
        method: "DELETE",
        body: JSON.stringify({
          garmentId: "123",
          source_pathname: "/stylists/test/shoot1",
        }),
        headers: { "Content-Type": "application/json" },
      },
    );
    const { DELETE } = await import("./route");
    const response = await DELETE(mockRequest);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe("Database connection failed");
  });

  it("should return isSaved false when garment not found", async () => {
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { email: "test@example.com" } },
          error: null,
        }),
      },
      from: vi
        .fn()
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "profile-123" },
                error: null,
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: [],
              }),
            }),
          }),
        }),
    } as unknown as SupabaseClient);
    const mockRequest = new Request(
      "http://localhost:3000/api/account/my-wardrobe?garment_id=456",
    );
    const response = await GET(mockRequest);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.isSaved).toBe(false);
  });

  it("should return 500 when wardrobe fetch fails", async () => {
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { email: "test@example.com" } },
          error: null,
        }),
      },
      from: vi
        .fn()
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "profile-123" },
                error: null,
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: null,
              error: new Error("Database error"),
            }),
          }),
        }),
    } as unknown as SupabaseClient);
    const mockRequest = new Request(
      "http://localhost:3000/api/account/my-wardrobe",
    );
    const response = await GET(mockRequest);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe("Error fetching wardrobe");
  });

  it("should return 404 for POST request when profile not found", async () => {
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { email: "test@example.com" } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: new Error("Profile not found"),
            }),
          }),
        }),
      }),
    } as unknown as SupabaseClient);
    const mockRequest = new Request(
      "http://localhost:3000/api/account/my-wardrobe",
      {
        method: "POST",
        body: JSON.stringify({
          garment_id: "123",
          source_pathname: "/stylists/test/shoot1",
        }),
        headers: { "Content-Type": "application/json" },
      },
    );
    const { POST } = await import("./route");
    const response = await POST(mockRequest);
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Profile not found");
  });

  it("should delete existing garment for POST request", async () => {
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { email: "test@example.com" } },
          error: null,
        }),
      },
      from: vi
        .fn()
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "profile-123" },
                error: null,
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: "existing-garment-123" },
                }),
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({}),
          }),
        }),
    } as unknown as SupabaseClient);
    const mockRequest = new Request(
      "http://localhost:3000/api/account/my-wardrobe",
      {
        method: "POST",
        body: JSON.stringify({
          garment_id: "123",
          source_pathname: "/stylists/test/shoot1",
        }),
        headers: { "Content-Type": "application/json" },
      },
    );
    const { POST } = await import("./route");
    const response = await POST(mockRequest);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.action).toBe("deleted");
  });

  it("should insert new garment for POST request", async () => {
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { email: "test@example.com" } },
          error: null,
        }),
      },
      from: vi
        .fn()
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "profile-123" },
                error: null,
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: null,
                }),
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          insert: vi.fn().mockResolvedValue({}),
        }),
    } as unknown as SupabaseClient);
    const mockRequest = new Request(
      "http://localhost:3000/api/account/my-wardrobe",
      {
        method: "POST",
        body: JSON.stringify({
          garment_id: "456",
          source_pathname: "/stylists/test/shoot1",
        }),
        headers: { "Content-Type": "application/json" },
      },
    );
    const { POST } = await import("./route");
    const response = await POST(mockRequest);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.action).toBe("inserted");
  });

  it("should return empty wardrobe array when no garments found", async () => {
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { email: "test@example.com" } },
          error: null,
        }),
      },
      from: vi
        .fn()
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "profile-123" },
                error: null,
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }),
        }),
    } as unknown as SupabaseClient);
    const mockRequest = new Request(
      "http://localhost:3000/api/account/my-wardrobe",
    );
    const response = await GET(mockRequest);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.wardrobe).toEqual([]);
  });

  it("should handle null data for garment query", async () => {
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { email: "test@example.com" } },
          error: null,
        }),
      },
      from: vi
        .fn()
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: "profile-123" },
                error: null,
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: null,
              }),
            }),
          }),
        }),
    } as unknown as SupabaseClient);
    const mockRequest = new Request(
      "http://localhost:3000/api/account/my-wardrobe?garment_id=789",
    );
    const response = await GET(mockRequest);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.isSaved).toBe(false);
  });
  it("should handle auth error without user data", async () => {
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { email: "test@example.com" } },
          error: new Error("Auth service unavailable"),
        }),
      },
    } as unknown as SupabaseClient);
    const mockRequest = new Request(
      "http://localhost:3000/api/account/my-wardrobe",
    );
    const response = await GET(mockRequest);
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 when profile data is null but no error", async () => {
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { email: "test@example.com" } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }),
        }),
      }),
    } as unknown as SupabaseClient);
    const mockRequest = new Request(
      "http://localhost:3000/api/account/my-wardrobe",
    );
    const response = await GET(mockRequest);
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Profile not found");
  });

  it("should handle auth error for POST request", async () => {
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { email: "test@example.com" } },
          error: new Error("Auth service unavailable"),
        }),
      },
    } as unknown as SupabaseClient);

    const mockRequest = new Request(
      "http://localhost:3000/api/account/my-wardrobe",
      {
        method: "POST",
        body: JSON.stringify({
          garment_id: "123",
          source_pathname: "/stylists/test/shoot1",
        }),
        headers: { "Content-Type": "application/json" },
      },
    );
    const { POST } = await import("./route");
    const response = await POST(mockRequest);
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 for POST when profile data is null but no error", async () => {
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { email: "test@example.com" } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }),
        }),
      }),
    } as unknown as SupabaseClient);
    const mockRequest = new Request(
      "http://localhost:3000/api/account/my-wardrobe",
      {
        method: "POST",
        body: JSON.stringify({
          garment_id: "123",
          source_pathname: "/stylists/test/shoot1",
        }),
        headers: { "Content-Type": "application/json" },
      },
    );
    const { POST } = await import("./route");
    const response = await POST(mockRequest);
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Profile not found");
  });
});
