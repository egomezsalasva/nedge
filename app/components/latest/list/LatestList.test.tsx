import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import LatestList from "./LatestList";

describe("Latest List", () => {
  it("renders without crashing", () => {
    render(<LatestList />);
  });
});
