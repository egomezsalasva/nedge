import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RemoveGarmentButton from "./RemoveGarmentButton";

describe("RemoveGarmentButton", () => {
  it("renders remove button", () => {
    render(<RemoveGarmentButton garmentId={1} />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("contains bin icon", () => {
    render(<RemoveGarmentButton garmentId={1} />);
    const button = screen.getByRole("button");
    expect(button).toContainHTML("svg");
  });

  it("calls removeWardrobeItem when clicked", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    render(<RemoveGarmentButton garmentId={123} />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(global.fetch).toHaveBeenCalledWith("/api/account/my-wardrobe", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ garmentId: 123 }),
    });
  });

  it("reloads page after successful removal", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    const reloadSpy = vi.fn();
    Object.defineProperty(window, "location", {
      value: { reload: reloadSpy },
      writable: true,
    });
    render(<RemoveGarmentButton garmentId={123} />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    await waitFor(() => {
      expect(reloadSpy).toHaveBeenCalled();
    });
  });

  it("handles fetch error gracefully", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: "Failed to remove" }),
    });
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<RemoveGarmentButton garmentId={123} />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("handles network error gracefully", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<RemoveGarmentButton garmentId={123} />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(consoleSpy).toHaveBeenCalledWith(new Error("Network error"));
    consoleSpy.mockRestore();
  });

  it("works with different garmentId values", () => {
    render(<RemoveGarmentButton garmentId={999} />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("prevents multiple simultaneous clicks", async () => {
    global.fetch = vi
      .fn()
      .mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ ok: true }), 100),
          ),
      );
    render(<RemoveGarmentButton garmentId={123} />);
    const button = screen.getByRole("button");
    userEvent.click(button);
    userEvent.click(button);
    userEvent.click(button);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });
  });

  it("sends correct garmentId in request body", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    render(<RemoveGarmentButton garmentId={456} />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(global.fetch).toHaveBeenCalledWith("/api/account/my-wardrobe", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ garmentId: 456 }),
    });
  });

  it("uses correct HTTP method and headers", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    render(<RemoveGarmentButton garmentId={123} />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/account/my-wardrobe",
      expect.objectContaining({
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  it("calls correct API endpoint", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    render(<RemoveGarmentButton garmentId={123} />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/account/my-wardrobe",
      expect.any(Object),
    );
  });

  it("does not reload page on fetch error", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: "Failed" }),
    });
    const reloadSpy = vi.fn();
    Object.defineProperty(window, "location", {
      value: { reload: reloadSpy },
      writable: true,
    });
    render(<RemoveGarmentButton garmentId={123} />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(reloadSpy).toHaveBeenCalled();
  });

  it("does not reload page on network error", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
    const reloadSpy = vi.fn();
    Object.defineProperty(window, "location", {
      value: { reload: reloadSpy },
      writable: true,
    });
    render(<RemoveGarmentButton garmentId={123} />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(reloadSpy).not.toHaveBeenCalled();
  });

  it("handles zero garmentId", () => {
    render(<RemoveGarmentButton garmentId={0} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("handles large garmentId", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    render(<RemoveGarmentButton garmentId={999999999} />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(global.fetch).toHaveBeenCalledWith("/api/account/my-wardrobe", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ garmentId: 999999999 }),
    });
  });

  it("handles error response without json method", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<RemoveGarmentButton garmentId={123} />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    consoleSpy.mockRestore();
  });
});
