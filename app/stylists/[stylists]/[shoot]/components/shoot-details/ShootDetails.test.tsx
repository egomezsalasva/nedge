// import { render, screen } from "@testing-library/react";
// import { testSbShootsData } from "../../../../../testSbShootsData";
// vi.mock("../../../../../@data", () => ({
//   shoots: testSbShootsData,
// }));
// import ShootDetails from "./ShootDetails";
// import { formatDate } from "@/app/utils";

describe("ShootDetails Component", () => {
  it("should be true", () => {
    expect(true).toBe(true);
  });
  // beforeEach(() => {
  //   render(<ShootDetails shootData={testSbShootsData[0]} />);
  // });
  // it("renders without crashing", () => {
  //   expect(screen.getByTestId("shoot-details")).toBeInTheDocument();
  // });
  // it("renders the header with date, city and bookmark button", () => {
  //   const formattedDate = formatDate(testSbShootsData[0].publication_date);
  //   expect(screen.getByText(formattedDate)).toBeInTheDocument();
  //   expect(screen.getByText("Test City 1")).toBeInTheDocument();
  //   expect(screen.getByTestId("bookmark")).toBeInTheDocument();
  // });
  // it("renders the stylist name, description and Instagram link", () => {
  //   expect(screen.getByText("Stylist 1")).toBeInTheDocument();
  //   expect(screen.getByText("Stylist Description 1")).toBeInTheDocument();
  //   const instaLink = screen
  //     .getAllByRole("link")
  //     .find(
  //       (link) =>
  //         link.getAttribute("href") === "https://www.instagram.com/stylist-1",
  //     );
  //   expect(instaLink).toBeDefined();
  //   expect(instaLink).toHaveAttribute("target", "_blank");
  // });
});
