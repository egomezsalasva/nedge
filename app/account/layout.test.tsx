import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MyAccountLayout from "./layout";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("./@ui/Header", () => ({
  default: () => <div data-testid="account-header">Account Header</div>,
}));

describe("MyAccountLayout", () => {
  it("renders layout with header and children when user is authenticated", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "user-123", email: "test@example.com" } },
          error: null,
        }),
      },
    };
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as SupabaseClient,
    );
    const TestChildren = () => (
      <div data-testid="test-children">Test Content</div>
    );
    const component = await MyAccountLayout({
      children: <TestChildren />,
    });
    const { getByTestId } = render(component);
    expect(getByTestId("account-header")).toBeInTheDocument();
    expect(getByTestId("test-children")).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects to signup when user is not authenticated", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: null,
        }),
      },
    };
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as SupabaseClient,
    );
    vi.mocked(redirect).mockImplementation(() => {
      throw new Error("REDIRECT");
    });
    const TestChildren = () => <div>Test Content</div>;
    await expect(
      MyAccountLayout({
        children: <TestChildren />,
      }),
    ).rejects.toThrow("REDIRECT");
    expect(redirect).toHaveBeenCalledWith("/signup");
  });

  it("redirects to signup when auth returns an error", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: "Auth error" },
        }),
      },
    };
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as SupabaseClient,
    );
    vi.mocked(redirect).mockImplementation(() => {
      throw new Error("REDIRECT");
    });
    const TestChildren = () => <div>Test Content</div>;
    await expect(
      MyAccountLayout({
        children: <TestChildren />,
      }),
    ).rejects.toThrow("REDIRECT");
    expect(redirect).toHaveBeenCalledWith("/signup");
  });

  it("creates supabase client on each render", async () => {
    vi.clearAllMocks(); // Reset mock call counts
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "user-123", email: "test@example.com" } },
          error: null,
        }),
      },
    };
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as SupabaseClient,
    );
    const TestChildren = () => (
      <div data-testid="test-children">Test Content</div>
    );
    await MyAccountLayout({
      children: <TestChildren />,
    });
    expect(createClient).toHaveBeenCalledTimes(1);
    expect(mockSupabase.auth.getUser).toHaveBeenCalledTimes(1);
  });

  it("renders main and div elements when authenticated", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "user-123", email: "test@example.com" } },
          error: null,
        }),
      },
    };
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as SupabaseClient,
    );
    const TestChildren = () => (
      <div data-testid="test-children">Test Content</div>
    );
    const component = await MyAccountLayout({
      children: <TestChildren />,
    });
    const { container, getByTestId } = render(component);
    expect(container.querySelector("main")).toBeInTheDocument();
    expect(container.querySelector("div")).toBeInTheDocument();
    expect(getByTestId("test-children")).toBeInTheDocument();
  });

  it("handles user with different data structure", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: "different-user-456",
              email: "different@example.com",
              name: "Test User",
              created_at: "2024-01-01",
            },
          },
          error: null,
        }),
      },
    };
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as SupabaseClient,
    );
    const TestChildren = () => (
      <div data-testid="test-children">Test Content</div>
    );
    const component = await MyAccountLayout({
      children: <TestChildren />,
    });
    const { getByTestId } = render(component);
    expect(getByTestId("account-header")).toBeInTheDocument();
    expect(getByTestId("test-children")).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("handles createClient throwing an error", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    vi.mocked(createClient).mockRejectedValue(
      new Error("Supabase connection failed"),
    );
    vi.mocked(redirect).mockImplementation(() => {
      throw new Error("REDIRECT");
    });
    const TestChildren = () => <div>Test Content</div>;
    await expect(
      MyAccountLayout({
        children: <TestChildren />,
      }),
    ).rejects.toThrow();
  });

  it("handles undefined user data", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: undefined },
          error: null,
        }),
      },
    };
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as SupabaseClient,
    );
    vi.mocked(redirect).mockImplementation(() => {
      throw new Error("REDIRECT");
    });
    const TestChildren = () => <div>Test Content</div>;
    await expect(
      MyAccountLayout({
        children: <TestChildren />,
      }),
    ).rejects.toThrow("REDIRECT");
    expect(redirect).toHaveBeenCalledWith("/signup");
  });

  it("handles getUser throwing an error", async () => {
    const { createClient } = await import("@/utils/supabase/server");

    const mockSupabase = {
      auth: {
        getUser: vi
          .fn()
          .mockRejectedValue(new Error("Auth service unavailable")),
      },
    };
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as SupabaseClient,
    );
    vi.mocked(redirect).mockImplementation(() => {
      throw new Error("REDIRECT");
    });
    const TestChildren = () => <div>Test Content</div>;
    await expect(
      MyAccountLayout({
        children: <TestChildren />,
      }),
    ).rejects.toThrow();
  });

  it("handles empty data object", async () => {
    const { createClient } = await import("@/utils/supabase/server");
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {},
          error: null,
        }),
      },
    };
    vi.mocked(createClient).mockResolvedValue(
      mockSupabase as unknown as SupabaseClient,
    );
    vi.mocked(redirect).mockImplementation(() => {
      throw new Error("REDIRECT");
    });
    const TestChildren = () => <div>Test Content</div>;
    await expect(
      MyAccountLayout({
        children: <TestChildren />,
      }),
    ).rejects.toThrow("REDIRECT");
    expect(redirect).toHaveBeenCalledWith("/signup");
  });
});
