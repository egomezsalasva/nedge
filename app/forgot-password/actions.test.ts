import { createClient } from "@/utils/supabase/server";
import { checkAuthAction, forgotPasswordAction } from "./actions";
import { redirect } from "next/navigation";
import { Mock } from "vitest";

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("forgotPasswordAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return error when email is missing", async () => {
    const formData = new FormData();
    const result = await forgotPasswordAction(formData);
    expect(result).toEqual({ error: "Email is required" });
  });

  it("should return error when email is invalid", async () => {
    const formData = new FormData();
    formData.append("email", "invalid-email");
    const result = await forgotPasswordAction(formData);
    expect(result).toEqual({ error: "Please enter a valid email address" });
  });

  it("should return success when email is valid", async () => {
    const mockSupabase = {
      auth: {
        resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
      },
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const formData = new FormData();
    formData.append("email", "test@example.com");
    const result = await forgotPasswordAction(formData);
    expect(result).toEqual({ success: true });
    expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
      "test@example.com",
    );
  });

  it("should return error when Supabase returns an error", async () => {
    const mockSupabase = {
      auth: {
        resetPasswordForEmail: vi.fn().mockResolvedValue({
          error: { message: "User not found" },
        }),
      },
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const formData = new FormData();
    formData.append("email", "test@example.com");
    const result = await forgotPasswordAction(formData);
    expect(result).toEqual({ error: "User not found" });
  });

  it("should handle unexpected errors gracefully", async () => {
    (createClient as Mock).mockRejectedValue(new Error("Network error"));
    const formData = new FormData();
    formData.append("email", "test@example.com");
    const result = await forgotPasswordAction(formData);
    expect(result).toEqual({ error: "An unexpected error occurred" });
  });

  it("should handle different valid email formats", async () => {
    const mockSupabase = {
      auth: {
        resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
      },
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const testEmails = [
      "user+tag@domain.co.uk",
      "test.email@subdomain.example.com",
      "user123@domain.com",
    ];
    for (const email of testEmails) {
      const formData = new FormData();
      formData.append("email", email);
      const result = await forgotPasswordAction(formData);
      expect(result).toEqual({ success: true });
    }
  });

  it("should test checkAuthAction function", async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const result = await checkAuthAction();
    expect(result).toEqual({ isAuthenticated: false });
  });

  it("should redirect when user is authenticated", async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "123", email: "test@example.com" } },
        }),
      },
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    await checkAuthAction();
    expect(redirect).toHaveBeenCalledWith("/account/my-account");
  });

  it("should handle different error message formats", async () => {
    const mockSupabase = {
      auth: {
        resetPasswordForEmail: vi.fn().mockResolvedValue({
          error: { message: "Custom error message" },
        }),
      },
    };
    (createClient as Mock).mockResolvedValue(mockSupabase);
    const formData = new FormData();
    formData.append("email", "test@example.com");
    const result = await forgotPasswordAction(formData);
    expect(result).toEqual({ error: "Custom error message" });
  });
});
