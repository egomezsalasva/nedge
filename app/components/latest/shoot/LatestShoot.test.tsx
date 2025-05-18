import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import LatestShoot from "./LatestShoot";

describe("Latest Shoot", () => {
  it("renders without crashing", () => {
    render(<LatestShoot />);
  });
});
