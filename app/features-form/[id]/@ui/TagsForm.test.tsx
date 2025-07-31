import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import TagsForm from "./TagsForm";

describe("TagsForm", () => {
  const mockSetSelectedTags = vi.fn();

  beforeEach(() => {
    mockSetSelectedTags.mockClear();
  });

  it("renders with initial state", () => {
    render(
      <TagsForm selectedTags={[]} setSelectedTags={mockSetSelectedTags} />,
    );
    expect(screen.getByText("Tags")).toBeInTheDocument();
    expect(
      screen.getByText(
        "You can either add a custom tag or select from the list of tags below.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Type to search or add a tag..."),
    ).toBeInTheDocument();
    expect(screen.getByText("View All Tags")).toBeInTheDocument();
  });

  it("displays selected tags when provided", () => {
    const selectedTags = ["Urban", "Minimalist"];
    render(
      <TagsForm
        selectedTags={selectedTags}
        setSelectedTags={mockSetSelectedTags}
      />,
    );
    expect(screen.getByText("SELECTED:")).toBeInTheDocument();
    expect(screen.getByText("Urban")).toBeInTheDocument();
    expect(screen.getByText("Minimalist")).toBeInTheDocument();
  });

  it("filters tags based on input", async () => {
    const user = userEvent.setup();
    render(
      <TagsForm selectedTags={[]} setSelectedTags={mockSetSelectedTags} />,
    );
    const input = screen.getByPlaceholderText("Type to search or add a tag...");
    await user.type(input, "ur");
    expect(screen.getByText("Urban")).toBeInTheDocument();
  });

  it("adds a tag when clicking on filtered suggestion", async () => {
    const user = userEvent.setup();
    render(
      <TagsForm selectedTags={[]} setSelectedTags={mockSetSelectedTags} />,
    );
    const input = screen.getByPlaceholderText("Type to search or add a tag...");
    await user.type(input, "ur");
    const urbanTag = screen.getByText("Urban");
    await user.click(urbanTag);
    expect(mockSetSelectedTags).toHaveBeenCalledWith(expect.any(Function));
  });

  it("adds a custom tag when pressing Enter", async () => {
    const user = userEvent.setup();
    render(
      <TagsForm selectedTags={[]} setSelectedTags={mockSetSelectedTags} />,
    );
    const input = screen.getByPlaceholderText("Type to search or add a tag...");
    await user.type(input, "CustomTag");
    await user.keyboard("{Enter}");
    expect(mockSetSelectedTags).toHaveBeenCalledWith(expect.any(Function));
  });

  it("removes a tag when clicking the X button", async () => {
    const user = userEvent.setup();
    const selectedTags = ["Urban"];
    render(
      <TagsForm
        selectedTags={selectedTags}
        setSelectedTags={mockSetSelectedTags}
      />,
    );
    const tagElement = screen.getByText("Urban");
    await user.click(tagElement);
    expect(mockSetSelectedTags).toHaveBeenCalledWith(expect.any(Function));
  });

  it("shows 'Add New' option for custom tags", async () => {
    const user = userEvent.setup();
    render(
      <TagsForm selectedTags={[]} setSelectedTags={mockSetSelectedTags} />,
    );
    const input = screen.getByPlaceholderText("Type to search or add a tag...");
    await user.type(input, "NonExistentTag");
    expect(screen.getByText("Add New:")).toBeInTheDocument();
    expect(screen.getByText("NonExistentTag")).toBeInTheDocument();
  });

  it("toggles 'View All Tags' functionality", async () => {
    const user = userEvent.setup();
    render(
      <TagsForm selectedTags={[]} setSelectedTags={mockSetSelectedTags} />,
    );
    const viewAllButton = screen.getByText("View All Tags");
    await user.click(viewAllButton);
    expect(screen.getByText("Hide All Tags")).toBeInTheDocument();
    expect(screen.getByText("Urban")).toBeInTheDocument();
    expect(screen.getByText("Minimalist")).toBeInTheDocument();
  });

  it("excludes already selected tags from filtered results", async () => {
    const user = userEvent.setup();
    const selectedTags = ["Urban"];
    render(
      <TagsForm
        selectedTags={selectedTags}
        setSelectedTags={mockSetSelectedTags}
      />,
    );
    const input = screen.getByPlaceholderText("Type to search or add a tag...");
    await user.type(input, "ur");
    const suggestions = screen.queryAllByText("Urban");
    expect(suggestions).toHaveLength(1);
  });

  it("clears input after adding a tag", async () => {
    const user = userEvent.setup();
    render(
      <TagsForm selectedTags={[]} setSelectedTags={mockSetSelectedTags} />,
    );
    const input = screen.getByPlaceholderText(
      "Type to search or add a tag...",
    ) as HTMLInputElement;
    await user.type(input, "TestTag");
    await user.keyboard("{Enter}");
    expect(input.value).toBe("");
  });

  it("prevents duplicate tags from being added", async () => {
    const user = userEvent.setup();
    const selectedTags = ["Urban"];
    render(
      <TagsForm
        selectedTags={selectedTags}
        setSelectedTags={mockSetSelectedTags}
      />,
    );
    const input = screen.getByPlaceholderText("Type to search or add a tag...");
    await user.type(input, "Urban");
    await user.keyboard("{Enter}");
    expect(mockSetSelectedTags).not.toHaveBeenCalled();
  });

  it("does not add empty or whitespace-only tags", async () => {
    const user = userEvent.setup();
    render(
      <TagsForm selectedTags={[]} setSelectedTags={mockSetSelectedTags} />,
    );
    const input = screen.getByPlaceholderText("Type to search or add a tag...");
    await user.keyboard("{Enter}");
    expect(mockSetSelectedTags).not.toHaveBeenCalled();
    await user.type(input, "   ");
    await user.keyboard("{Enter}");
    expect(mockSetSelectedTags).not.toHaveBeenCalled();
  });

  it("hides 'View All Tags' button when typing", async () => {
    const user = userEvent.setup();
    render(
      <TagsForm selectedTags={[]} setSelectedTags={mockSetSelectedTags} />,
    );
    expect(screen.getByText("View All Tags")).toBeInTheDocument();
    const input = screen.getByPlaceholderText("Type to search or add a tag...");
    await user.type(input, "test");
    expect(screen.queryByText("View All Tags")).not.toBeInTheDocument();
  });

  it("closes 'View All Tags' when adding a tag from the list", async () => {
    const user = userEvent.setup();
    render(
      <TagsForm selectedTags={[]} setSelectedTags={mockSetSelectedTags} />,
    );
    const viewAllButton = screen.getByText("View All Tags");
    await user.click(viewAllButton);
    expect(screen.getByText("Hide All Tags")).toBeInTheDocument();
    const urbanTag = screen.getByText("Urban");
    await user.click(urbanTag);
    expect(mockSetSelectedTags).toHaveBeenCalledWith(expect.any(Function));
  });

  it("excludes selected tags from 'View All Tags' list", () => {
    const selectedTags = ["Urban", "Minimalist"];
    render(
      <TagsForm
        selectedTags={selectedTags}
        setSelectedTags={mockSetSelectedTags}
      />,
    );
    const viewAllButton = screen.getByText("View All Tags");
    fireEvent.click(viewAllButton);
    const allUrbanElements = screen.getAllByText("Urban");
    const allMinimalistElements = screen.getAllByText("Minimalist");
    expect(allUrbanElements).toHaveLength(1);
    expect(allMinimalistElements).toHaveLength(1);
  });

  it("handles case-insensitive filtering", async () => {
    const user = userEvent.setup();
    render(
      <TagsForm selectedTags={[]} setSelectedTags={mockSetSelectedTags} />,
    );
    const input = screen.getByPlaceholderText("Type to search or add a tag...");
    await user.type(input, "URBAN");
    expect(screen.getByText("Urban")).toBeInTheDocument();
    await user.clear(input);
    await user.type(input, "MiNi");
    expect(screen.getByText("Minimalist")).toBeInTheDocument();
  });

  it("shows no filtered results when no tags match", async () => {
    const user = userEvent.setup();
    render(
      <TagsForm selectedTags={[]} setSelectedTags={mockSetSelectedTags} />,
    );
    const input = screen.getByPlaceholderText("Type to search or add a tag...");
    await user.type(input, "xyz123nonexistent");
    expect(screen.getByText("Add New:")).toBeInTheDocument();
    expect(screen.queryByText("Urban")).not.toBeInTheDocument();
  });

  it("adds custom tag by clicking 'Add New' button", async () => {
    const user = userEvent.setup();
    render(
      <TagsForm selectedTags={[]} setSelectedTags={mockSetSelectedTags} />,
    );
    const input = screen.getByPlaceholderText("Type to search or add a tag...");
    await user.type(input, "CustomNewTag");
    const addButton = screen.getByText("CustomNewTag");
    await user.click(addButton);
    expect(mockSetSelectedTags).toHaveBeenCalledWith(expect.any(Function));
  });

  //   it("trims whitespace when adding custom tags", async () => {
  //     const user = userEvent.setup();
  //     render(<TagsForm selectedTags={[]} setSelectedTags={mockSetSelectedTags} />);
  //     const input = screen.getByPlaceholderText("Type to search or add a tag...");
  //     await user.type(input, "  SpacedTag  ");
  //     await user.keyboard("{Enter}");
  //     expect(mockSetSelectedTags).toHaveBeenCalledWith(expect.any(Function));
  //     expect(screen.getByText("SpacedTag")).toBeInTheDocument();
  //   });

  it("does not show 'Add New' option for existing tags", async () => {
    const user = userEvent.setup();
    render(
      <TagsForm selectedTags={[]} setSelectedTags={mockSetSelectedTags} />,
    );
    const input = screen.getByPlaceholderText("Type to search or add a tag...");
    await user.type(input, "Urban");
    expect(screen.getByText("Urban")).toBeInTheDocument();
    expect(screen.queryByText("Add New:")).not.toBeInTheDocument();
  });

  it("does not show 'Add New' option for selected tags", async () => {
    const user = userEvent.setup();
    const selectedTags = ["Urban"];
    render(
      <TagsForm
        selectedTags={selectedTags}
        setSelectedTags={mockSetSelectedTags}
      />,
    );
    const input = screen.getByPlaceholderText("Type to search or add a tag...");
    await user.type(input, "Urban");
    expect(screen.queryByText("Add New:")).not.toBeInTheDocument();
  });

  it("handles Enter key only when input has content", async () => {
    const user = userEvent.setup();
    render(
      <TagsForm selectedTags={[]} setSelectedTags={mockSetSelectedTags} />,
    );
    const input = screen.getByPlaceholderText("Type to search or add a tag...");
    await user.click(input);
    await user.keyboard("{Enter}");
    expect(mockSetSelectedTags).not.toHaveBeenCalled();
    await user.type(input, "   ");
    await user.keyboard("{Enter}");
    expect(mockSetSelectedTags).not.toHaveBeenCalled();
  });

  it("shows 'View All Tags' button only when input is empty", async () => {
    const user = userEvent.setup();
    render(
      <TagsForm selectedTags={[]} setSelectedTags={mockSetSelectedTags} />,
    );
    const input = screen.getByPlaceholderText("Type to search or add a tag...");
    expect(screen.getByText("View All Tags")).toBeInTheDocument();
    await user.type(input, "test");
    expect(screen.queryByText("View All Tags")).not.toBeInTheDocument();
    expect(screen.queryByText("Hide All Tags")).not.toBeInTheDocument();
    await user.clear(input);
    expect(screen.getByText("View All Tags")).toBeInTheDocument();
  });

  //   it("prevents adding duplicate tags case-insensitively", async () => {
  //     const user = userEvent.setup();
  //     const selectedTags = ["Urban"];
  //     render(<TagsForm selectedTags={selectedTags} setSelectedTags={mockSetSelectedTags} />);
  //     const input = screen.getByPlaceholderText("Type to search or add a tag...");
  //     await user.type(input, "urban");
  //     await user.keyboard("{Enter}");
  //     expect(mockSetSelectedTags).not.toHaveBeenCalled();
  //   });
});
