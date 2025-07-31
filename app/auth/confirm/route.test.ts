import { describe, it, expect, vi, Mock } from "vitest";
import { GET } from "./route";
import type { NextRequest } from "next/server";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(),
}));

describe("Auth Confirm Route", () => {
  it("should redirect to error page when no token_hash or type provided", async () => {
    const { redirect } = await import("next/navigation");
    const request = new Request("http://localhost:3000/auth/confirm");
    await GET(request as NextRequest);
    expect(redirect).toHaveBeenCalledWith("/error");
  });

  it("should redirect to error page when OTP verification fails", async () => {
    const { redirect } = await import("next/navigation");
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
      auth: {
        verifyOtp: vi
          .fn()
          .mockResolvedValue({ error: new Error("Invalid OTP") }),
      },
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const request = new Request(
      "http://localhost:3000/auth/confirm?token_hash=abc123&type=signup",
    );
    await GET(request as NextRequest);
    expect(redirect).toHaveBeenCalledWith("/error");
  });

  it("should redirect to reset-password when OTP verification succeeds with recovery type", async () => {
    const { redirect } = await import("next/navigation");
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
      auth: {
        verifyOtp: vi.fn().mockResolvedValue({ error: null }),
      },
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const request = new Request(
      "http://localhost:3000/auth/confirm?token_hash=abc123&type=recovery",
    );
    await GET(request as NextRequest);
    expect(redirect).toHaveBeenCalledWith("/reset-password");
  });

  it("should redirect to custom next URL when OTP verification succeeds with non-recovery type", async () => {
    const { redirect } = await import("next/navigation");
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
      auth: {
        verifyOtp: vi.fn().mockResolvedValue({ error: null }),
      },
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const request = new Request(
      "http://localhost:3000/auth/confirm?token_hash=abc123&type=signup&next=/dashboard",
    );
    await GET(request as NextRequest);
    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("should redirect to root when OTP verification succeeds with non-recovery type and no next param", async () => {
    const { redirect } = await import("next/navigation");
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
      auth: {
        verifyOtp: vi.fn().mockResolvedValue({ error: null }),
      },
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const request = new Request(
      "http://localhost:3000/auth/confirm?token_hash=abc123&type=signup",
    );
    await GET(request as NextRequest);
    expect(redirect).toHaveBeenCalledWith("/");
  });
});
