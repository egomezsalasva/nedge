import { render, screen } from "@testing-library/react";
import Home from "./page";

vi.mock("./latest/shoot/LatestShoot", () => ({
  default: () => <div data-testid="latest-shoot">Latest Shoot Component</div>,
}));

vi.mock("./latest/list/LatestList", () => ({
  default: () => <div data-testid="latest-list">Latest List Component</div>,
}));

describe("Home Page", () => {
  it("renders without crashing", () => {
    render(<Home />);
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByTestId("latest-shoot")).toBeInTheDocument();
    expect(screen.getByTestId("latest-list")).toBeInTheDocument();
  });
});
