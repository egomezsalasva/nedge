import { render, screen } from "@testing-library/react";
import Home from "./page";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Home Page", () => {
  it("renders without crashing and fetches the latest list and shoot", () => {
    render(<Home />);
    expect(mockFetch).toHaveBeenCalledWith("/api/latest/list");
    expect(mockFetch).toHaveBeenCalledWith("/api/latest/shoot");
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
