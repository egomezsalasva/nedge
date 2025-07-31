import { render, screen } from "@testing-library/react";
import ErrorPage from "./page";

describe("ErrorPage", () => {
  it("renders the error message", () => {
    render(<ErrorPage />);
    const errorMessage = screen.getByText("Sorry, something went wrong");
    expect(errorMessage).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    render(<ErrorPage />);
    const paragraph = screen.getByRole("paragraph");
    expect(paragraph).toBeInTheDocument();
  });
});
