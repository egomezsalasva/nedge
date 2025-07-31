import { describe, it, expect, vi, Mock } from "vitest";
import { DELETE } from "./route";
import type { NextRequest } from "next/server";

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

describe("DELETE /api/account/bookmarks/[id]", () => {
  it("should return 200 when bookmark is deleted successfully", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const mockRequest = {} as NextRequest;
    const mockParams = { params: Promise.resolve({ id: "123" }) };
    const response = await DELETE(mockRequest, mockParams);
    expect(response.status).toBe(200);
  });

  it("should return 500 when deletion fails", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi
            .fn()
            .mockResolvedValue({ error: { message: "Delete failed" } }),
        }),
      }),
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const mockRequest = {} as NextRequest;
    const mockParams = { params: Promise.resolve({ id: "123" }) };
    const response = await DELETE(mockRequest, mockParams);
    expect(response.status).toBe(500);
  });

  it("should use the correct id from params", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const mockEq = vi.fn().mockResolvedValue({ error: null });
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: mockEq,
        }),
      }),
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const mockRequest = {} as NextRequest;
    const mockParams = { params: Promise.resolve({ id: "456" }) };
    await DELETE(mockRequest, mockParams);
    expect(mockEq).toHaveBeenCalledWith("id", "456");
  });

  it("should call the correct table and method", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const mockFrom = vi.fn().mockReturnValue({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    });
    const mockSupabase = { from: mockFrom };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const mockRequest = {} as NextRequest;
    const mockParams = { params: Promise.resolve({ id: "123" }) };
    await DELETE(mockRequest, mockParams);
    expect(mockFrom).toHaveBeenCalledWith("profile_bookmarks");
  });

  it("should return success true when deletion succeeds", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const mockRequest = {} as NextRequest;
    const mockParams = { params: Promise.resolve({ id: "123" }) };
    const response = await DELETE(mockRequest, mockParams);
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  it("should return error message when deletion fails", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi
            .fn()
            .mockResolvedValue({ error: { message: "Database error" } }),
        }),
      }),
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const mockRequest = {} as NextRequest;
    const mockParams = { params: Promise.resolve({ id: "123" }) };
    const response = await DELETE(mockRequest, mockParams);
    const data = await response.json();
    expect(data.error).toBe("Database error");
  });

  it("should create supabase client", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const mockRequest = {} as NextRequest;
    const mockParams = { params: Promise.resolve({ id: "123" }) };
    await DELETE(mockRequest, mockParams);
    expect(createClient).toHaveBeenCalled();
  });
});
