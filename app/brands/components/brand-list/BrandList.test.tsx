import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import BrandList from "./BrandList";
import { BrandType } from "./@utils/getBrandListData";

vi.mock("./@utils/getBrandListData", () => ({
  getBrandListData: vi
    .fn()
    .mockResolvedValue([
      { id: 1, name: "Test Brand", slug: "test", itemCount: 2, shootCount: 3 },
    ]),
}));

describe("BrandList Component", () => {
  it("should render brands", async () => {
    render(<BrandList />);
    await waitFor(() => {
      expect(screen.getByText("Test Brand")).toBeInTheDocument();
    });
  });

  it("should display search input", async () => {
    render(<BrandList />);
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Search brands..."),
      ).toBeInTheDocument();
    });
  });

  it("should render the brands heading", async () => {
    render(<BrandList />);
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Brands" }),
      ).toBeInTheDocument();
    });
  });

  it("should render the brand list container", async () => {
    render(<BrandList />);
    await waitFor(() => {
      expect(screen.getByTestId("brand-list")).toBeInTheDocument();
    });
  });

  it("should render brand links", async () => {
    render(<BrandList />);
    await waitFor(() => {
      expect(screen.getAllByRole("link")).toHaveLength(1);
    });
  });

  it("should generate correct link for brand", async () => {
    render(<BrandList />);
    await waitFor(() => {
      const brandLink = screen.getByRole("link");
      expect(brandLink).toHaveAttribute("href", "/brands/test");
    });
  });

  it("should display item and shoot counts", async () => {
    render(<BrandList />);
    await waitFor(() => {
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("Items")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("Shoots")).toBeInTheDocument();
    });
  });

  it("should filter brands when searching", async () => {
    render(<BrandList />);
    await waitFor(() => {
      expect(screen.getByText("Test Brand")).toBeInTheDocument();
    });
    const searchInput = screen.getByPlaceholderText("Search brands...");
    fireEvent.change(searchInput, { target: { value: "Test" } });
    expect(screen.getByText("Test Brand")).toBeInTheDocument();
    fireEvent.change(searchInput, { target: { value: "NonExistent" } });
    expect(screen.queryByText("Test Brand")).not.toBeInTheDocument();
  });

  it("should handle case-insensitive search", async () => {
    render(<BrandList />);
    await waitFor(() => {
      expect(screen.getByText("Test Brand")).toBeInTheDocument();
    });
    const searchInput = screen.getByPlaceholderText("Search brands...");
    fireEvent.change(searchInput, { target: { value: "test" } });
    expect(screen.getByText("Test Brand")).toBeInTheDocument();
    fireEvent.change(searchInput, { target: { value: "TEST" } });
    expect(screen.getByText("Test Brand")).toBeInTheDocument();
  });

  it("should clear search and show all brands", async () => {
    render(<BrandList />);
    await waitFor(() => {
      expect(screen.getByText("Test Brand")).toBeInTheDocument();
    });
    const searchInput = screen.getByPlaceholderText("Search brands...");
    fireEvent.change(searchInput, { target: { value: "NonExistent" } });
    expect(screen.queryByText("Test Brand")).not.toBeInTheDocument();
    fireEvent.change(searchInput, { target: { value: "" } });
    expect(screen.getByText("Test Brand")).toBeInTheDocument();
  });

  it("should clear search and show all brands", async () => {
    render(<BrandList />);
    await waitFor(() => {
      expect(screen.getByText("Test Brand")).toBeInTheDocument();
    });
    const searchInput = screen.getByPlaceholderText("Search brands...");
    fireEvent.change(searchInput, { target: { value: "NonExistent" } });
    expect(screen.queryByText("Test Brand")).not.toBeInTheDocument();
    fireEvent.change(searchInput, { target: { value: "" } });
    expect(screen.getByText("Test Brand")).toBeInTheDocument();
  });

  it("should handle empty search results gracefully", async () => {
    render(<BrandList />);
    await waitFor(() => {
      expect(screen.getByTestId("brand-list")).toBeInTheDocument();
    });
    const searchInput = screen.getByPlaceholderText("Search brands...");
    fireEvent.change(searchInput, { target: { value: "NonExistent" } });
    expect(screen.getByTestId("brand-list")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("should test search input value updates", async () => {
    render(<BrandList />);
    await waitFor(() => {
      expect(screen.getByText("Test Brand")).toBeInTheDocument();
    });
    const searchInput = screen.getByPlaceholderText("Search brands...");
    fireEvent.change(searchInput, { target: { value: "New Value" } });
    expect(searchInput).toHaveValue("New Value");
  });

  it("should test with multiple brands for sorting", async () => {
    vi.mocked(
      await import("./@utils/getBrandListData"),
    ).getBrandListData.mockResolvedValueOnce([
      { id: 2, name: "Beta Brand", slug: "beta", itemCount: 1, shootCount: 1 },
      {
        id: 1,
        name: "Alpha Brand",
        slug: "alpha",
        itemCount: 1,
        shootCount: 1,
      },
      {
        id: 3,
        name: "Gamma Brand",
        slug: "gamma",
        itemCount: 1,
        shootCount: 1,
      },
    ]);
    render(<BrandList />);
    await waitFor(() => {
      const brandLinks = screen.getAllByRole("link");
      expect(brandLinks).toHaveLength(3);
    });
    const brandNames = screen.getAllByText(/Brand$/);
    expect(brandNames[0]).toHaveTextContent("Alpha Brand");
    expect(brandNames[1]).toHaveTextContent("Beta Brand");
    expect(brandNames[2]).toHaveTextContent("Gamma Brand");
  });

  it("should test loading state", async () => {
    const promise = new Promise(() => {}); // Never resolves
    vi.mocked(
      await import("./@utils/getBrandListData"),
    ).getBrandListData.mockReturnValueOnce(
      promise as unknown as Promise<BrandType[]>,
    );
    render(<BrandList />);
    // Component should render but not show brands while loading
    expect(screen.getByTestId("brand-list")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("should test search with partial matches", async () => {
    render(<BrandList />);
    await waitFor(() => {
      expect(screen.getByText("Test Brand")).toBeInTheDocument();
    });
    const searchInput = screen.getByPlaceholderText("Search brands...");
    fireEvent.change(searchInput, { target: { value: "Test" } });
    expect(screen.getByText("Test Brand")).toBeInTheDocument();
    fireEvent.change(searchInput, { target: { value: "Brand" } });
    expect(screen.getByText("Test Brand")).toBeInTheDocument();
    fireEvent.change(searchInput, { target: { value: "st" } });
    expect(screen.getByText("Test Brand")).toBeInTheDocument();
  });

  it("should test singular vs plural labels", async () => {
    // Mock with different counts to test singular/plural
    vi.mocked(
      await import("./@utils/getBrandListData"),
    ).getBrandListData.mockResolvedValueOnce([
      {
        id: 1,
        name: "Single Brand",
        slug: "single",
        itemCount: 1,
        shootCount: 1,
      },
      {
        id: 2,
        name: "Multiple Brand",
        slug: "multiple",
        itemCount: 2,
        shootCount: 3,
      },
    ]);
    render(<BrandList />);
    await waitFor(() => {
      expect(screen.getByText("Single Brand")).toBeInTheDocument();
      expect(screen.getByText("Multiple Brand")).toBeInTheDocument();
    });
    expect(screen.getByText("Item")).toBeInTheDocument();
    expect(screen.getByText("Shoot")).toBeInTheDocument();
    expect(screen.getByText("Items")).toBeInTheDocument();
    expect(screen.getByText("Shoots")).toBeInTheDocument();
  });

  it("should test search input accessibility", async () => {
    render(<BrandList />);
    await waitFor(() => {
      expect(screen.getByText("Test Brand")).toBeInTheDocument();
    });
    const searchInput = screen.getByPlaceholderText("Search brands...");
    expect(searchInput).toHaveAttribute("type", "text");
    expect(searchInput).toBeInTheDocument();
    searchInput.focus();
    expect(searchInput).toHaveFocus();
  });

  it("should test component unmounting", async () => {
    const { unmount } = render(<BrandList />);
    await waitFor(() => {
      expect(screen.getByText("Test Brand")).toBeInTheDocument();
    });
    unmount();
    expect(screen.queryByText("Test Brand")).not.toBeInTheDocument();
    expect(screen.queryByTestId("brand-list")).not.toBeInTheDocument();
  });

  it("should test search with special characters", async () => {
    render(<BrandList />);
    await waitFor(() => {
      expect(screen.getByText("Test Brand")).toBeInTheDocument();
    });
    const searchInput = screen.getByPlaceholderText("Search brands...");
    fireEvent.change(searchInput, { target: { value: "Test!" } });
    expect(screen.queryByText("Test Brand")).not.toBeInTheDocument();
    fireEvent.change(searchInput, { target: { value: "Test Brand" } });
    expect(screen.getByText("Test Brand")).toBeInTheDocument();
  });
});
