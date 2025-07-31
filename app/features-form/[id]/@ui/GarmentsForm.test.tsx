import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GarmentsForm from "./GarmentsForm";
import { useState } from "react";

const mockGarments = [
  {
    type: "Boots",
    name: "Tabi Ankle Boots",
    brand: "Maison Margiela",
  },
];

const TestWrapper = ({ initialGarments = mockGarments }) => {
  const [garments, setGarments] = useState(initialGarments);
  return <GarmentsForm garments={garments} setGarments={setGarments} />;
};

const mockSetGarments = vi.fn();

describe("GarmentsForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Garments heading", () => {
    render(
      <GarmentsForm garments={mockGarments} setGarments={mockSetGarments} />,
    );
    expect(
      screen.getByRole("heading", { name: "Garments" }),
    ).toBeInTheDocument();
  });

  it("renders all input fields with correct placeholders for first garment", () => {
    render(
      <GarmentsForm garments={mockGarments} setGarments={mockSetGarments} />,
    );
    expect(
      screen.getByPlaceholderText("Garment Type (e.g. Boots)"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Garment Name (e.g. Tabi Ankle Boots)"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Garment Brand (e.g. Maison Margiela)"),
    ).toBeInTheDocument();
  });

  it("displays the correct values in input fields", () => {
    render(
      <GarmentsForm garments={mockGarments} setGarments={mockSetGarments} />,
    );
    expect(screen.getByDisplayValue("Boots")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Tabi Ankle Boots")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Maison Margiela")).toBeInTheDocument();
  });

  it("renders the Add Another Garment button", () => {
    render(
      <GarmentsForm garments={mockGarments} setGarments={mockSetGarments} />,
    );
    expect(
      screen.getByRole("button", { name: "Add Another Garment" }),
    ).toBeInTheDocument();
  });

  it("updates garment type when user types", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);
    const typeInput = screen.getByPlaceholderText("Garment Type (e.g. Boots)");
    await user.clear(typeInput);
    await user.type(typeInput, "Shoes");
    expect(typeInput).toHaveValue("Shoes");
  });

  it("updates garment name when user types", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);
    const nameInput = screen.getByPlaceholderText(
      "Garment Name (e.g. Tabi Ankle Boots)",
    );
    await user.clear(nameInput);
    await user.type(nameInput, "Air Force 1");
    expect(nameInput).toHaveValue("Air Force 1");
  });

  it("updates garment brand when user types", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);
    const brandInput = screen.getByPlaceholderText(
      "Garment Brand (e.g. Maison Margiela)",
    );
    await user.clear(brandInput);
    await user.type(brandInput, "Nike");
    expect(brandInput).toHaveValue("Nike");
  });

  it("adds a new garment when Add Another Garment button is clicked", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);
    expect(screen.getAllByPlaceholderText(/Garment Type/).length).toBe(1);
    const addButton = screen.getByRole("button", {
      name: "Add Another Garment",
    });
    await user.click(addButton);
    expect(screen.getAllByPlaceholderText(/Garment Type/).length).toBe(2);
  });

  it("does not show remove button when there is only one garment", () => {
    render(
      <GarmentsForm garments={mockGarments} setGarments={mockSetGarments} />,
    );
    expect(screen.queryByText("X")).not.toBeInTheDocument();
  });

  it("shows remove button when there are multiple garments", () => {
    const multipleGarments = [
      ...mockGarments,
      { type: "Hat", name: "Beret", brand: "Minga London" },
    ];
    render(
      <GarmentsForm
        garments={multipleGarments}
        setGarments={mockSetGarments}
      />,
    );
    expect(screen.getAllByText("X")).toHaveLength(2);
  });

  it("removes a garment when remove button is clicked", async () => {
    const user = userEvent.setup();
    const multipleGarments = [
      ...mockGarments,
      { type: "Hat", name: "Beret", brand: "Minga London" },
    ];
    render(<TestWrapper initialGarments={multipleGarments} />);
    expect(screen.getAllByPlaceholderText(/Garment Type/).length).toBe(2);
    const removeButtons = screen.getAllByText("X");
    await user.click(removeButtons[0]);
    expect(screen.getAllByPlaceholderText(/Garment Type/).length).toBe(1);
  });

  it("renders different placeholders for different garment indices", () => {
    const multipleGarments = [
      { type: "", name: "", brand: "" },
      { type: "", name: "", brand: "" },
      { type: "", name: "", brand: "" },
    ];
    render(
      <GarmentsForm
        garments={multipleGarments}
        setGarments={mockSetGarments}
      />,
    );
    expect(
      screen.getByPlaceholderText("Garment Type (e.g. Boots)"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Garment Type (e.g. Bag)"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Garment Type (e.g. Hat)"),
    ).toBeInTheDocument();
  });

  it("renders instructional text about adding garments", () => {
    render(
      <GarmentsForm garments={mockGarments} setGarments={mockSetGarments} />,
    );
    expect(
      screen.getByText(/Add all the garments worn in the shoot/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Click/)).toBeInTheDocument();
    expect(screen.getByText('"Add Another Garment"')).toBeInTheDocument();
    expect(
      screen.getByText(/for each garment you want to add/),
    ).toBeInTheDocument();
  });

  it("renders clickable HERE link for benefits", () => {
    render(
      <GarmentsForm garments={mockGarments} setGarments={mockSetGarments} />,
    );
    const hereLink = screen.getByText("HERE");
    expect(hereLink).toBeInTheDocument();
    expect(hereLink).toHaveStyle({ textDecoration: "underline" });
  });

  it("scrolls to benefits section when HERE link is clicked", async () => {
    const user = userEvent.setup();
    const mockScrollIntoView = vi.fn();
    const mockGetElementById = vi.fn().mockReturnValue({
      scrollIntoView: mockScrollIntoView,
    });
    Object.defineProperty(document, "getElementById", {
      value: mockGetElementById,
      writable: true,
    });
    render(
      <GarmentsForm garments={mockGarments} setGarments={mockSetGarments} />,
    );
    const hereLink = screen.getByText("HERE");
    await user.click(hereLink);
    expect(mockGetElementById).toHaveBeenCalledWith("benefits");
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("does not remove garment when there is only one left", async () => {
    const user = userEvent.setup();
    const multipleGarments = [
      ...mockGarments,
      { type: "Hat", name: "Beret", brand: "Minga London" },
    ];
    render(<TestWrapper initialGarments={multipleGarments} />);
    const removeButtons = screen.getAllByText("X");
    await user.click(removeButtons[0]);
    expect(screen.getAllByPlaceholderText(/Garment Type/).length).toBe(1);
    expect(screen.queryByText("X")).not.toBeInTheDocument();
  });
});
