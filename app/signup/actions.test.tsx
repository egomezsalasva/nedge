import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkAuthAction, signup } from "./actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("Signup Actions", () => {
  const mockSupabase = {
    auth: {
      getUser: vi.fn(),
      signUp: vi.fn(),
    },
    from: vi.fn().mockReturnThis(),
    insert: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockSupabase);
  });

  it("checkAuthAction returns false when user is not authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
    });
    const result = await checkAuthAction();
    expect(result).toEqual({ isAuthenticated: false });
    expect(redirect).not.toHaveBeenCalled();
  });

  it("checkAuthAction redirects when user is authenticated", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "123", email: "test@example.com" } },
    });
    await checkAuthAction();
    expect(redirect).toHaveBeenCalledWith("/account/my-account");
  });

  it("signup returns success when registration is successful", async () => {
    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "password123");
    mockSupabase.auth.signUp.mockResolvedValue({
      error: null,
    });
    mockSupabase.insert.mockResolvedValue({
      error: null,
    });
    const result = await signup(formData);
    expect(result).toEqual({ success: true });
    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
    expect(mockSupabase.insert).toHaveBeenCalledWith([
      { email: "test@example.com" },
    ]);
  });

  it("signup returns error when auth signup fails", async () => {
    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "password123");
    mockSupabase.auth.signUp.mockResolvedValue({
      error: { message: "Email already exists" },
    });
    const result = await signup(formData);
    expect(result).toEqual({ error: true });
    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
    expect(mockSupabase.insert).not.toHaveBeenCalled();
  });

  it("signup returns error when profile creation fails", async () => {
    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "password123");
    mockSupabase.auth.signUp.mockResolvedValue({
      error: null,
    });
    mockSupabase.insert.mockResolvedValue({
      error: { message: "Database error" },
    });
    const result = await signup(formData);
    expect(result).toEqual({ error: true });
    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
    expect(mockSupabase.insert).toHaveBeenCalledWith([
      { email: "test@example.com" },
    ]);
  });

  it("checkAuthAction handles Supabase client creation errors", async () => {
    (createClient as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Failed to create Supabase client"),
    );
    await expect(checkAuthAction()).rejects.toThrow(
      "Failed to create Supabase client",
    );
  });

  it("checkAuthAction handles getUser errors", async () => {
    mockSupabase.auth.getUser.mockRejectedValue(new Error("Network error"));
    await expect(checkAuthAction()).rejects.toThrow("Network error");
  });

  it("signup handles empty FormData", async () => {
    const formData = new FormData();
    mockSupabase.auth.signUp.mockResolvedValue({
      error: { message: "Invalid email" },
    });
    const result = await signup(formData);
    expect(result).toEqual({ error: true });
    expect(mockSupabase.auth.signUp).toHaveBeenCalled();
  });

  it("signup handles Supabase client creation errors", async () => {
    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "password123");
    (createClient as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Failed to create Supabase client"),
    );
    await expect(signup(formData)).rejects.toThrow(
      "Failed to create Supabase client",
    );
  });
});
