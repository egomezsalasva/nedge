import { describe, it, expect, vi, Mock } from "vitest";
import { GET, POST } from "./route";

vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((data, options) => ({
      json: vi.fn().mockResolvedValue(data),
      status: options?.status || 200,
    })),
  },
}));

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(),
}));

describe("GET /api/account/bookmarks", () => {
  it("should return 400 when shoot_id is missing", async () => {
    const request = new Request("http://localhost:3000/api/account/bookmarks");
    const response = await GET(request);
    expect(response.status).toBe(400);
  });

  it("should return 403 for preview shoots", async () => {
    const request = new Request(
      "http://localhost:3000/api/account/bookmarks?shoot_id=123&source_pathname=/shoot-preview/test",
    );
    const response = await GET(request);
    expect(response.status).toBe(403);
  });

  it("should return 401 when user is not authenticated", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
      auth: {
        getUser: vi
          .fn()
          .mockResolvedValue({ data: { user: null }, error: null }),
      },
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const request = new Request(
      "http://localhost:3000/api/account/bookmarks?shoot_id=123",
    );
    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it("should return 200 with isBookmarked true when bookmark exists", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
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
              single: vi
                .fn()
                .mockResolvedValue({ data: { id: 1 }, error: null }),
            }),
          }),
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi
                  .fn()
                  .mockResolvedValue({ data: { id: 1 }, error: null }),
              }),
            }),
          }),
        }),
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const request = new Request(
      "http://localhost:3000/api/account/bookmarks?shoot_id=123",
    );
    const response = await GET(request);
    expect(response.status).toBe(200);
  });

  it("should return 200 with isBookmarked false when bookmark does not exist", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
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
              single: vi
                .fn()
                .mockResolvedValue({ data: { id: 1 }, error: null }),
            }),
          }),
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: null, error: null }),
              }),
            }),
          }),
        }),
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const request = new Request(
      "http://localhost:3000/api/account/bookmarks?shoot_id=123",
    );
    const response = await GET(request);
    expect(response.status).toBe(200);
  });

  it("should return 404 when profile is not found", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { email: "test@example.com" } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi
              .fn()
              .mockResolvedValue({ data: null, error: new Error("Not found") }),
          }),
        }),
      }),
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const request = new Request(
      "http://localhost:3000/api/account/bookmarks?shoot_id=123",
    );
    const response = await GET(request);
    expect(response.status).toBe(404);
  });

  it("should return 401 when auth error occurs", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: new Error("Auth failed"),
        }),
      },
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const request = new Request(
      "http://localhost:3000/api/account/bookmarks?shoot_id=123",
    );
    const response = await GET(request);
    expect(response.status).toBe(401);
  });
});

describe("POST /api/account/bookmarks", () => {
  it("should return 400 when shoot_id is missing", async () => {
    const mockRequest = {
      json: vi.fn().mockResolvedValue({}),
    } as unknown as Request;
    const response = await POST(mockRequest);
    expect(response.status).toBe(400);
  });

  it("should return 403 for preview shoots", async () => {
    const mockRequest = {
      json: vi.fn().mockResolvedValue({
        shoot_id: "123",
        source_pathname: "/shoot-preview/test",
      }),
    } as unknown as Request;
    const response = await POST(mockRequest);
    expect(response.status).toBe(403);
  });

  it("should return 404 when profile is not found", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { email: "test@example.com" } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi
              .fn()
              .mockResolvedValue({ data: null, error: new Error("Not found") }),
          }),
        }),
      }),
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const mockRequest = {
      json: vi.fn().mockResolvedValue({ shoot_id: "123" }),
    } as unknown as Request;
    const response = await POST(mockRequest);
    expect(response.status).toBe(404);
  });

  it("should return 200 with action deleted when bookmark exists", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
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
              single: vi
                .fn()
                .mockResolvedValue({ data: { id: 1 }, error: null }),
            }),
          }),
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi
                  .fn()
                  .mockResolvedValue({ data: { id: 5 }, error: null }),
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const mockRequest = {
      json: vi.fn().mockResolvedValue({ shoot_id: "123" }),
    } as unknown as Request;
    const response = await POST(mockRequest);
    expect(response.status).toBe(200);
  });

  it("should return 200 with action inserted when bookmark does not exist", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
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
              single: vi
                .fn()
                .mockResolvedValue({ data: { id: 1 }, error: null }),
            }),
          }),
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: null, error: null }),
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          insert: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const mockRequest = {
      json: vi.fn().mockResolvedValue({ shoot_id: "123" }),
    } as unknown as Request;
    const response = await POST(mockRequest);
    expect(response.status).toBe(200);
  });

  it("should return 401 when auth error occurs", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: new Error("Auth failed"),
        }),
      },
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const mockRequest = {
      json: vi.fn().mockResolvedValue({ shoot_id: "123" }),
    } as unknown as Request;
    const response = await POST(mockRequest);
    expect(response.status).toBe(401);
  });

  it("should return 400 when request body is empty object", async () => {
    const mockRequest = {
      json: vi.fn().mockResolvedValue({}),
    } as unknown as Request;
    const response = await POST(mockRequest);
    expect(response.status).toBe(400);
  });

  it("should continue processing when source_pathname is not preview", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
      auth: {
        getUser: vi
          .fn()
          .mockResolvedValue({ data: { user: null }, error: null }),
      },
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const mockRequest = {
      json: vi.fn().mockResolvedValue({
        shoot_id: "123",
        source_pathname: "/regular/path",
      }),
    } as unknown as Request;
    const response = await POST(mockRequest);
    expect(response.status).toBe(401);
  });

  it("should return 401 when authentication error occurs", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: new Error("Authentication failed"),
        }),
      },
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const mockRequest = {
      json: vi.fn().mockResolvedValue({ shoot_id: "123" }),
    } as unknown as Request;
    const response = await POST(mockRequest);
    expect(response.status).toBe(401);
  });

  it("should return 401 when user is not authenticated", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
      auth: {
        getUser: vi
          .fn()
          .mockResolvedValue({ data: { user: null }, error: null }),
      },
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const mockRequest = {
      json: vi.fn().mockResolvedValue({ shoot_id: "123" }),
    } as unknown as Request;
    const response = await POST(mockRequest);
    expect(response.status).toBe(401);
  });
});
