import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { testData } from "../../@testData";
vi.mock("../../../@data", () => ({
  shoots: testData,
}));
import ShootDetails from "./ShootDetails";

describe("ShootDetails Component", () => {
  beforeEach(() => {
    render(<ShootDetails shootData={testData[0]} />);
  });
  it("renders without crashing", () => {
    expect(screen.getByTestId("shoot-details")).toBeInTheDocument();
  });
  it("renders the header with date, city and bookmark button", () => {
    expect(screen.getByText("19/05/25")).toBeInTheDocument();
    expect(screen.getByText("Test City 1")).toBeInTheDocument();
    expect(screen.getByTestId("bookmark")).toBeInTheDocument();
  });
  it("renders the stylist name, description and follow button", () => {
    expect(screen.getByText("Stylist 1")).toBeInTheDocument();
    expect(screen.getByText("Stylist Description 1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Follow" })).toBeInTheDocument();
  });
  it("renders the shoot title, description and tags", () => {
    expect(screen.getByText("Test Shoot 1")).toBeInTheDocument();
    expect(screen.getByText("Shoot Description 1")).toBeInTheDocument();
    expect(screen.getByText("Tag 1")).toBeInTheDocument();
    expect(screen.getByText("Tag 2")).toBeInTheDocument();
  });
  it("renders the team members", () => {
    expect(screen.getByText("Role 1")).toBeInTheDocument();
    expect(screen.getByText("Name 1")).toBeInTheDocument();
    expect(screen.getByText("Role 2")).toBeInTheDocument();
    expect(screen.getByText("Name 2")).toBeInTheDocument();
    expect(screen.getByText("Role 3")).toBeInTheDocument();
    expect(screen.getByText("Name 3")).toBeInTheDocument();
  });
});
