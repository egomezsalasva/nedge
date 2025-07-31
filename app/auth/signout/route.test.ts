import { POST } from "./route";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("POST /auth/signout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should redirect to login page when user signs out", async () => {
    const mockSignOut = vi.fn();
    const mockGetUser = vi.fn().mockResolvedValue({
      data: { user: { id: "user-123" } },
    });
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: mockGetUser,
        signOut: mockSignOut,
      },
    } as unknown as SupabaseClient);
    const request = new NextRequest("http://localhost:3000/auth/signout", {
      method: "POST",
    });
    // Act
    const response = await POST(request);
    // Assert
    expect(mockGetUser).toHaveBeenCalled();
    expect(mockSignOut).toHaveBeenCalled();
    expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith(
      "/account",
      "layout",
    );
    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login",
    );
  });

  it("should redirect to login page when no user is logged in", async () => {
    // Arrange
    const mockSignOut = vi.fn();
    const mockGetUser = vi.fn().mockResolvedValue({
      data: { user: null },
    });
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: mockGetUser,
        signOut: mockSignOut,
      },
    } as unknown as SupabaseClient);
    const request = new NextRequest("http://localhost:3000/auth/signout", {
      method: "POST",
    });
    // Act
    const response = await POST(request);
    // Assert
    expect(mockGetUser).toHaveBeenCalled();
    expect(mockSignOut).not.toHaveBeenCalled(); // Should NOT call signOut when no user
    expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith(
      "/account",
      "layout",
    );
    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login",
    );
  });

  it("should still redirect to login page when getUser throws an error", async () => {
    // Arrange
    const mockSignOut = vi.fn();
    const mockGetUser = vi
      .fn()
      .mockRejectedValue(new Error("Database connection failed"));
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: mockGetUser,
        signOut: mockSignOut,
      },
    } as unknown as SupabaseClient);
    const request = new NextRequest("http://localhost:3000/auth/signout", {
      method: "POST",
    });
    // Act & Assert
    await expect(POST(request)).rejects.toThrow("Database connection failed");
    expect(mockGetUser).toHaveBeenCalled();
    expect(mockSignOut).not.toHaveBeenCalled();
    expect(vi.mocked(revalidatePath)).not.toHaveBeenCalled();
  });

  it("should handle signOut error and still redirect to login", async () => {
    // Arrange
    const mockSignOut = vi.fn().mockRejectedValue(new Error("Sign out failed"));
    const mockGetUser = vi.fn().mockResolvedValue({
      data: { user: { id: "user-123" } },
    });
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: mockGetUser,
        signOut: mockSignOut,
      },
    } as unknown as SupabaseClient);
    const request = new NextRequest("http://localhost:3000/auth/signout", {
      method: "POST",
    });
    // Act & Assert
    await expect(POST(request)).rejects.toThrow("Sign out failed");
    expect(mockGetUser).toHaveBeenCalled();
    expect(mockSignOut).toHaveBeenCalled();
    expect(vi.mocked(revalidatePath)).not.toHaveBeenCalled();
  });

  it("should handle createClient error", async () => {
    // Arrange
    vi.mocked(createClient).mockRejectedValue(
      new Error("Failed to create Supabase client"),
    );
    const request = new NextRequest("http://localhost:3000/auth/signout", {
      method: "POST",
    });
    // Act & Assert
    await expect(POST(request)).rejects.toThrow(
      "Failed to create Supabase client",
    );
    expect(vi.mocked(createClient)).toHaveBeenCalled();
    expect(vi.mocked(revalidatePath)).not.toHaveBeenCalled();
  });

  it("should handle revalidatePath error but still redirect", async () => {
    // Arrange
    const mockSignOut = vi.fn();
    const mockGetUser = vi.fn().mockResolvedValue({
      data: { user: { id: "user-123" } },
    });
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: mockGetUser,
        signOut: mockSignOut,
      },
    } as unknown as SupabaseClient);
    vi.mocked(revalidatePath).mockImplementation(() => {
      throw new Error("Cache revalidation failed");
    });
    const request = new NextRequest("http://localhost:3000/auth/signout", {
      method: "POST",
    });
    // Act & Assert
    await expect(POST(request)).rejects.toThrow("Cache revalidation failed");
    expect(mockGetUser).toHaveBeenCalled();
    expect(mockSignOut).toHaveBeenCalled();
    expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith(
      "/account",
      "layout",
    );
  });
});
