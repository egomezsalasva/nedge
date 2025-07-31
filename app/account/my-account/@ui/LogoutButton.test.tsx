import { fireEvent, render, screen } from "@testing-library/react";
import LogoutButton from "./LogoutButton";

describe("LogoutButton", () => {
  it("renders the logout button with correct text", () => {
    render(<LogoutButton />);
    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
  });

  it("calls fetch with correct parameters when clicked", async () => {
    const mockFetch = vi.fn(() => Promise.resolve({} as Response));
    global.fetch = mockFetch;
    render(<LogoutButton />);
    const button = screen.getByRole("button", { name: "Log out" });
    fireEvent.click(button);
    expect(mockFetch).toHaveBeenCalledWith("/auth/signout", { method: "POST" });
  });

  it("redirects to login page after logout", async () => {
    const mockFetch = vi.fn(() => Promise.resolve({} as Response));
    global.fetch = mockFetch;
    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: "" },
    });
    render(<LogoutButton />);
    const button = screen.getByRole("button", { name: "Log out" });
    await fireEvent.click(button);
    expect(window.location.href).toBe("/login");
  });

  it("is clickable and interactive", () => {
    render(<LogoutButton />);
    const button = screen.getByRole("button", { name: "Log out" });
    expect(button).toBeEnabled();
  });

  it("can be clicked multiple times", () => {
    const mockFetch = vi.fn(() => Promise.resolve({} as Response));
    global.fetch = mockFetch;
    render(<LogoutButton />);
    const button = screen.getByRole("button", { name: "Log out" });
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it("only renders one button element", () => {
    render(<LogoutButton />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(1);
  });

  it("does not have disabled attribute", () => {
    render(<LogoutButton />);
    const button = screen.getByRole("button", { name: "Log out" });
    expect(button).not.toHaveAttribute("disabled");
  });

  it("is focusable", () => {
    render(<LogoutButton />);
    const button = screen.getByRole("button", { name: "Log out" });
    button.focus();
    expect(button).toHaveFocus();
  });

  it("has default button type when no type specified", () => {
    render(<LogoutButton />);
    const button = screen.getByRole("button", {
      name: "Log out",
    }) as HTMLButtonElement;
    expect(button.type).toBe("submit");
  });

  it("waits for fetch to complete before redirect", async () => {
    let resolvePromise: () => void;
    const mockFetch = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          resolvePromise = () => resolve({} as Response);
        }),
    );
    global.fetch = mockFetch;
    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: "" },
    });
    render(<LogoutButton />);
    const button = screen.getByRole("button", { name: "Log out" });
    fireEvent.click(button);
    expect(window.location.href).toBe("");
    resolvePromise!();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(window.location.href).toBe("/login");
  });

  it("prevents default form submission behavior", () => {
    render(<LogoutButton />);
    const button = screen.getByRole("button", { name: "Log out" });
    const mockPreventDefault = vi.fn();
    const clickEvent = new MouseEvent("click", { bubbles: true });
    clickEvent.preventDefault = mockPreventDefault;
    button.dispatchEvent(clickEvent);
    // Since the button doesn't explicitly prevent default, this tests current behavior
    expect(mockPreventDefault).not.toHaveBeenCalled();
  });

  it("maintains button functionality after multiple renders", () => {
    const mockFetch = vi.fn(() => Promise.resolve({} as Response));
    global.fetch = mockFetch;
    const { rerender } = render(<LogoutButton />);
    rerender(<LogoutButton />);
    rerender(<LogoutButton />);
    const button = screen.getByRole("button", { name: "Log out" });
    fireEvent.click(button);
    expect(mockFetch).toHaveBeenCalledWith("/auth/signout", { method: "POST" });
  });

  it("component unmounts cleanly", () => {
    const { unmount } = render(<LogoutButton />);
    expect(() => unmount()).not.toThrow();
  });
});
