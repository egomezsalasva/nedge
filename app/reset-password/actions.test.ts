import { resetPasswordAction } from "./actions";

const mockGetUser = vi.fn();
const mockUpdateUser = vi.fn();

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: mockGetUser,
      updateUser: mockUpdateUser,
    },
  })),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("resetPasswordAction", () => {
  it("returns error when password fields are missing", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "test-user" } },
      error: null,
    });
    const formData = new FormData();
    const result = await resetPasswordAction(formData);
    expect(result).toEqual({ error: "Both password fields are required" });
  });

  it("returns error when passwords do not match", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "test-user" } },
      error: null,
    });
    const formData = new FormData();
    formData.append("password", "password123");
    formData.append("confirmPassword", "password456");
    const result = await resetPasswordAction(formData);
    expect(result).toEqual({ error: "Passwords do not match" });
  });

  it("returns error when password is too short", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "test-user" } },
      error: null,
    });
    const formData = new FormData();
    formData.append("password", "123");
    formData.append("confirmPassword", "123");
    const result = await resetPasswordAction(formData);
    expect(result).toEqual({
      error: "Password must be at least 6 characters long",
    });
  });

  it("successfully updates password", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "test-user" } },
      error: null,
    });
    mockUpdateUser.mockResolvedValue({
      data: { user: { id: "test-user" } },
      error: null,
    });
    const formData = new FormData();
    formData.append("password", "newpassword123");
    formData.append("confirmPassword", "newpassword123");
    const result = await resetPasswordAction(formData);
    expect(result).toEqual({ success: true });
    expect(mockUpdateUser).toHaveBeenCalledWith({ password: "newpassword123" });
  });

  it("redirects when user is not authenticated", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });
    const formData = new FormData();
    formData.append("password", "newpassword123");
    formData.append("confirmPassword", "newpassword123");
    await resetPasswordAction(formData);
    const { redirect } = await import("next/navigation");
    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("returns error when Supabase update fails", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "test-user" } },
      error: null,
    });
    mockUpdateUser.mockResolvedValue({
      data: null,
      error: { message: "Invalid password format" },
    });
    const formData = new FormData();
    formData.append("password", "newpassword123");
    formData.append("confirmPassword", "newpassword123");
    const result = await resetPasswordAction(formData);
    expect(result).toEqual({ error: "Invalid password format" });
  });

  it("handles unexpected errors gracefully", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "test-user" } },
      error: null,
    });
    mockUpdateUser.mockRejectedValue(new Error("Network error"));
    const formData = new FormData();
    formData.append("password", "newpassword123");
    formData.append("confirmPassword", "newpassword123");
    const result = await resetPasswordAction(formData);
    expect(result).toEqual({ error: "An unexpected error occurred" });
  });

  it("revalidates cache on successful password update", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "test-user" } },
      error: null,
    });
    mockUpdateUser.mockResolvedValue({
      data: { user: { id: "test-user" } },
      error: null,
    });
    const formData = new FormData();
    formData.append("password", "newpassword123");
    formData.append("confirmPassword", "newpassword123");
    await resetPasswordAction(formData);
    const { revalidatePath } = await import("next/cache");
    expect(revalidatePath).toHaveBeenCalledWith("/account");
  });
});
