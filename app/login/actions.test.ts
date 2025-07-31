import { login, checkAuthAction } from "./actions";

const mockSignInWithPassword = vi.fn();
const mockGetUser = vi.fn();

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      getUser: mockGetUser,
    },
  })),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("login actions", () => {
  it("returns error when login fails", async () => {
    mockSignInWithPassword.mockResolvedValue({
      error: { message: "Invalid credentials" },
    });
    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "password123");
    const result = await login(formData);
    expect(result).toEqual({ error: true });
  });

  it("handles successful login", async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });
    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "password123");
    await login(formData);
    const { revalidatePath } = await import("next/cache");
    const { redirect } = await import("next/navigation");
    expect(revalidatePath).toHaveBeenCalledWith("/account", "layout");
    expect(redirect).toHaveBeenCalledWith("/account");
  });

  it("handles checkAuthAction when user is not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const result = await checkAuthAction();
    expect(result).toEqual({ isAuthenticated: false });
  });

  it("redirects when user is already authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "test-user" } } });
    await checkAuthAction();
    const { redirect } = await import("next/navigation");
    expect(redirect).toHaveBeenCalledWith("/account/my-account");
  });

  it("validates form data extraction", async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });
    const formData = new FormData();
    formData.append("email", "user@example.com");
    formData.append("password", "securepassword");
    await login(formData);
    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "securepassword",
    });
  });
});
