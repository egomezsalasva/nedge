import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShootDetailsForm from "./ShootDetailsForm";
import { useState } from "react";

const mockDetails = {
  stylistName: "John Doe",
  shootName: "Summer Collection",
  city: "New York",
};

const TestWrapper = ({ initialDetails = mockDetails }) => {
  const [details, setDetails] = useState(initialDetails);
  return <ShootDetailsForm details={details} setDetails={setDetails} />;
};

const mockSetDetails = vi.fn();

describe("ShootDetailsForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all input fields with correct placeholders", () => {
    render(
      <ShootDetailsForm details={mockDetails} setDetails={mockSetDetails} />,
    );
    expect(screen.getByPlaceholderText("Stylist Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Shoot Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("City")).toBeInTheDocument();
  });

  it("displays the correct values in input fields", () => {
    render(
      <ShootDetailsForm details={mockDetails} setDetails={mockSetDetails} />,
    );
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Summer Collection")).toBeInTheDocument();
    expect(screen.getByDisplayValue("New York")).toBeInTheDocument();
  });

  it("renders the Details heading", () => {
    render(
      <ShootDetailsForm details={mockDetails} setDetails={mockSetDetails} />,
    );
    expect(
      screen.getByRole("heading", { name: "Details" }),
    ).toBeInTheDocument();
  });

  it("updates city input value when user types", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);
    const cityInput = screen.getByPlaceholderText("City");
    await user.clear(cityInput);
    await user.type(cityInput, "LA");
    expect(cityInput).toHaveValue("LA");
  });

  it("updates stylist name input value when user types", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);
    const stylistInput = screen.getByPlaceholderText("Stylist Name");
    await user.clear(stylistInput);
    await user.type(stylistInput, "Jane Smith");
    expect(stylistInput).toHaveValue("Jane Smith");
  });

  it("updates shoot name input value when user types", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);
    const shootInput = screen.getByPlaceholderText("Shoot Name");
    await user.clear(shootInput);
    await user.type(shootInput, "Winter Collection");
    expect(shootInput).toHaveValue("Winter Collection");
  });
});
