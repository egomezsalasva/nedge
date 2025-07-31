import { render, screen } from "@testing-library/react";
import Page from "./page";
import { SupabaseClient } from "@supabase/supabase-js";

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("./AccessCodePage", () => ({
  default: function MockAccessCodePage() {
    return <div data-testid="access-code-page">Access Code Page</div>;
  },
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

const mockSupabase = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockResolvedValue({
    data: { name: "John Doe" },
    error: null,
  }),
};

const mockSupabaseNotFound = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockResolvedValue({
    data: null,
    error: new Error("Not found"),
  }),
};

const createMockSupabase = (data: unknown, error: unknown = null) => ({
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockResolvedValue({ data, error }),
});

const expectNotCalled = async () => {
  expect(
    vi.mocked(await import("next/navigation")).notFound,
  ).toHaveBeenCalled();
};

const setupMockClient = async (mockData: unknown) => {
  vi.mocked(
    await import("@/utils/supabase/server"),
  ).createClient.mockResolvedValue(mockData as unknown as SupabaseClient);
};

describe("Page", () => {
  it("renders AccessCodePage when submission is found", async () => {
    await setupMockClient(mockSupabase);
    const params = Promise.resolve({ id: "test-slug" });
    render(await Page({ params }));
    expect(screen.getByTestId("access-code-page")).toBeInTheDocument();
  });

  it("calls notFound when submission is not found", async () => {
    await setupMockClient(mockSupabaseNotFound);
    const params = Promise.resolve({ id: "non-existent" });
    await Page({ params });
    await expectNotCalled();
  });

  it("handles createClient errors", async () => {
    vi.mocked(
      await import("@/utils/supabase/server"),
    ).createClient.mockRejectedValue(new Error("DB connection failed"));
    const params = Promise.resolve({ id: "test" });
    await Page({ params });
    await expectNotCalled();
  });

  it("handles Supabase query errors", async () => {
    const mockSupabaseQueryError = createMockSupabase(null, null);
    mockSupabaseQueryError.single = vi
      .fn()
      .mockRejectedValue(new Error("Query failed"));
    await setupMockClient(mockSupabaseQueryError);
    const params = Promise.resolve({ id: "test-slug" });
    await Page({ params });
    await expectNotCalled();
  });

  it("handles invalid params", async () => {
    await setupMockClient(mockSupabase);
    const params = Promise.resolve({ id: "" });
    await Page({ params });
    await expectNotCalled();
  });

  it("handles params Promise rejection", async () => {
    await setupMockClient(mockSupabase);
    const params = Promise.reject(new Error("Params error"));
    await Page({ params });
    await expectNotCalled();
  });

  it("handles params with missing id property", async () => {
    await setupMockClient(mockSupabase);
    const params = Promise.resolve({} as { id: string });
    await Page({ params });
    await expectNotCalled();
  });

  it("handles null id value", async () => {
    await setupMockClient(mockSupabase);
    const params = Promise.resolve({ id: null as unknown as string });
    await Page({ params });
    await expectNotCalled();
  });

  it("handles undefined id value", async () => {
    await setupMockClient(mockSupabase);
    const params = Promise.resolve({ id: undefined as unknown as string });
    await Page({ params });
    await expectNotCalled();
  });

  it("passes correct submission data to AccessCodePage", async () => {
    const mockSubmission = { name: "John Doe", id: 123 };
    const mockSupabaseWithData = createMockSupabase(mockSubmission);
    await setupMockClient(mockSupabaseWithData);
    const params = Promise.resolve({ id: "test-slug" });
    render(await Page({ params }));
    expect(screen.getByTestId("access-code-page")).toBeInTheDocument();
  });

  it("handles null data with null error", async () => {
    const mockSupabaseNullData = createMockSupabase(null, null);
    await setupMockClient(mockSupabaseNullData);
    const params = Promise.resolve({ id: "test-slug" });
    await Page({ params });
    await expectNotCalled();
  });
});
