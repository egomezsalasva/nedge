import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("@/app/@ui", () => ({
  Card: ({ shoot }: { shoot: { title: string } }) => (
    <div data-testid="mock-card">{shoot.title}</div>
  ),
}));
import StyleShootsList from "./StyleShootsList";

describe("StyleShootsList", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ shoots: [] }),
        }),
      ),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the cards container and is empty initially", () => {
    render(<StyleShootsList subStyle="casual" />);
    const cardsContainer = screen.getByTestId("shoot-cards-list");
    expect(cardsContainer).toBeInTheDocument();
    expect(cardsContainer?.children.length).toBe(0);
  });

  it("renders cards when fetch returns shoots", async () => {
    const mockShoots = [
      { slug: "shoot-1", title: "Shoot 1" },
      { slug: "shoot-2", title: "Shoot 2" },
    ];

    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ shoots: mockShoots }),
        }),
      ),
    );

    render(<StyleShootsList subStyle="casual" />);
    const cards = await screen.findAllByTestId("mock-card");
    expect(cards).toHaveLength(mockShoots.length);
  });

  it("fetches and updates cards when subStyle prop changes", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({ shoots: [{ slug: "shoot-1", title: "Shoot 1" }] }),
      })
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            shoots: [
              { slug: "shoot-2", title: "Shoot 2" },
              { slug: "shoot-3", title: "Shoot 3" },
            ],
          }),
      });

    vi.stubGlobal("fetch", fetchMock);
    const { rerender } = render(<StyleShootsList subStyle="casual" />);
    const card = await screen.findByText("Shoot 1");
    expect(card).toBeInTheDocument();
    rerender(<StyleShootsList subStyle="formal" />);
    const card2 = await screen.findByText("Shoot 2");
    const card3 = await screen.findByText("Shoot 3");
    expect(card2).toBeInTheDocument();
    expect(card3).toBeInTheDocument();
    const cards = await screen.findAllByTestId("mock-card");
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent("Shoot 2");
    expect(cards[1]).toHaveTextContent("Shoot 3");
  });

  it("shows and hides loading indicator appropriately", async () => {
    let resolveFetch: (value: {
      json: () => Promise<{ shoots: { slug: string; title: string }[] }>;
    }) => void;
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve;
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(() => fetchPromise),
    );
    render(<StyleShootsList subStyle="casual" />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
    resolveFetch!({
      json: () =>
        Promise.resolve({ shoots: [{ slug: "shoot-1", title: "Shoot 1" }] }),
    });
    await screen.findByText("Shoot 1");
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
  });

  it("shows an error message if fetch fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("Network error"))),
    );
    render(<StyleShootsList subStyle="casual" />);
    const error = await screen.findByTestId("error");
    expect(error).toHaveTextContent("Failed to load shoots.");
  });

  it("shows a message when no shoots are found", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ shoots: [] }),
        }),
      ),
    );
    render(<StyleShootsList subStyle="casual" />);
    const noShoots = await screen.findByTestId("no-shoots");
    expect(noShoots).toHaveTextContent("No shoots found.");
  });

  it("calls the correct API endpoint with the subStyle prop", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ shoots: [] }),
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const subStyle = "streetwear";
    render(<StyleShootsList subStyle={subStyle} />);
    await screen.findByTestId("shoot-cards-list");
    expect(fetchMock).toHaveBeenCalledWith(
      `/api/explore/shoots-by-style?subStyle=${encodeURIComponent(subStyle)}`,
    );
  });

  it("does not call fetch again if subStyle prop does not change", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ shoots: [] }),
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const { rerender } = render(<StyleShootsList subStyle="minimal" />);
    await screen.findByTestId("shoot-cards-list");
    rerender(<StyleShootsList subStyle="minimal" />);
    await screen.findByTestId("shoot-cards-list");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("handles null shoots in API response gracefully", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ shoots: null }),
        }),
      ),
    );
    render(<StyleShootsList subStyle="casual" />);
    const noShoots = await screen.findByTestId("no-shoots");
    expect(noShoots).toHaveTextContent("No shoots found.");
  });
});
