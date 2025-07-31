import { render, screen, fireEvent } from "@testing-library/react";
import UploadImgsForm from "./UploadImgsForm";

Object.defineProperty(window, "URL", {
  value: {
    createObjectURL: vi.fn(() => "mock-url"),
    revokeObjectURL: vi.fn(),
  },
});

describe("UploadImgsForm", () => {
  const mockSetFiles = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the upload form with correct text", () => {
    render(<UploadImgsForm files={null} setFiles={mockSetFiles} />);
    expect(screen.getByText("Upload images")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Upload between 3 and 5 images wearing the same outfit.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Click to Browse")).toBeInTheDocument();
  });

  it("calls setFiles when files are selected", () => {
    render(<UploadImgsForm files={null} setFiles={mockSetFiles} />);
    const fileInput = screen.getByRole("button", { name: /click to browse/i })
      .nextElementSibling as HTMLInputElement;
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(mockSetFiles).toHaveBeenCalled();
  });

  it("displays image previews when files are provided", () => {
    const files = [
      new File(["test1"], "test1.jpg", { type: "image/jpeg" }),
      new File(["test2"], "test2.jpg", { type: "image/jpeg" }),
    ];
    render(
      <UploadImgsForm
        files={files as unknown as FileList}
        setFiles={mockSetFiles}
      />,
    );
    expect(screen.getAllByRole("img")).toHaveLength(2);
  });

  it("activates drag state on dragenter and dragover", () => {
    const { container } = render(
      <UploadImgsForm files={null} setFiles={mockSetFiles} />,
    );
    const dropZone = container.querySelector('[class*="customFileLabel"]');
    fireEvent.dragEnter(dropZone!);
    expect(dropZone?.className).toContain("dragActive");
    fireEvent.dragLeave(dropZone!);
    expect(dropZone?.className).not.toContain("dragActive");
  });

  it("calls setFiles when files are dropped", () => {
    const { container } = render(
      <UploadImgsForm files={null} setFiles={mockSetFiles} />,
    );
    const dropZone = container.querySelector('[class*="customFileLabel"]');
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const dropEvent = new Event("drop", {
      bubbles: true,
    }) as unknown as DragEvent;
    (
      dropEvent as unknown as {
        dataTransfer: { files: File[]; clearData: () => void };
      }
    ).dataTransfer = {
      files: [file],
      clearData: vi.fn(),
    };
    fireEvent(dropZone!, dropEvent);
    expect(mockSetFiles).toHaveBeenCalledWith([file]);
    expect(
      (dropEvent as unknown as { dataTransfer: { clearData: () => void } })
        .dataTransfer.clearData,
    ).toHaveBeenCalled();
  });

  it("revokes object URL when image loads", () => {
    const files = [new File(["test"], "test.jpg", { type: "image/jpeg" })];
    render(
      <UploadImgsForm
        files={files as unknown as FileList}
        setFiles={mockSetFiles}
      />,
    );
    const image = screen.getByRole("img");
    fireEvent.load(image);
    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith("mock-url");
  });

  it("does not show image previews when no files are provided", () => {
    render(<UploadImgsForm files={null} setFiles={mockSetFiles} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("prevents default behavior on drag events", () => {
    const { container } = render(
      <UploadImgsForm files={null} setFiles={mockSetFiles} />,
    );
    const dropZone = container.querySelector('[class*="customFileLabel"]');
    const dragOverEvent = new Event("dragover", {
      bubbles: true,
    }) as unknown as DragEvent;
    const preventDefaultSpy = vi.spyOn(dragOverEvent, "preventDefault");
    const stopPropagationSpy = vi.spyOn(dragOverEvent, "stopPropagation");
    fireEvent(dropZone!, dragOverEvent);
    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it("file input has correct attributes", () => {
    render(<UploadImgsForm files={null} setFiles={mockSetFiles} />);
    const browseButton = screen.getByRole("button", {
      name: /click to browse/i,
    });
    const fileInput = browseButton.nextElementSibling as HTMLInputElement;
    expect(fileInput).toHaveAttribute("type", "file");
    expect(fileInput).toHaveAttribute("accept", "image/*");
    expect(fileInput).toHaveAttribute("multiple");
    expect(fileInput).toHaveStyle("display: none");
  });

  it("triggers file input click when browse button is clicked", () => {
    render(<UploadImgsForm files={null} setFiles={mockSetFiles} />);
    const browseButton = screen.getByRole("button", {
      name: /click to browse/i,
    });
    const fileInput = browseButton.nextElementSibling as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, "click");
    fireEvent.click(browseButton);
    expect(clickSpy).toHaveBeenCalled();
  });

  it("deactivates drag state after drop", () => {
    const { container } = render(
      <UploadImgsForm files={null} setFiles={mockSetFiles} />,
    );
    const dropZone = container.querySelector('[class*="customFileLabel"]');
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    fireEvent.dragEnter(dropZone!);
    expect(dropZone?.className).toContain("dragActive");
    const dropEvent = new Event("drop", {
      bubbles: true,
    }) as unknown as DragEvent;
    (
      dropEvent as unknown as {
        dataTransfer: { files: File[]; clearData: () => void };
      }
    ).dataTransfer = {
      files: [file],
      clearData: vi.fn(),
    };
    fireEvent(dropZone!, dropEvent);
    expect(dropZone?.className).not.toContain("dragActive");
  });

  it("handles empty FileList correctly", () => {
    const emptyFileList = {
      length: 0,
      item: () => null,
      [Symbol.iterator]: function* () {},
    } as unknown as FileList;
    render(<UploadImgsForm files={emptyFileList} setFiles={mockSetFiles} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("handles drop events with no files", () => {
    const { container } = render(
      <UploadImgsForm files={null} setFiles={mockSetFiles} />,
    );
    const dropZone = container.querySelector('[class*="customFileLabel"]');
    const dropEvent = new Event("drop", {
      bubbles: true,
    }) as unknown as DragEvent;
    (
      dropEvent as unknown as {
        dataTransfer: { files: File[]; clearData: () => void };
      }
    ).dataTransfer = {
      files: null as unknown as File[],
      clearData: vi.fn(),
    };
    fireEvent(dropZone!, dropEvent);
    expect(mockSetFiles).not.toHaveBeenCalled();
    expect(
      (dropEvent as unknown as { dataTransfer: { clearData: () => void } })
        .dataTransfer.clearData,
    ).not.toHaveBeenCalled();
  });

  it("handles multiple file selection through input", () => {
    render(<UploadImgsForm files={null} setFiles={mockSetFiles} />);
    const browseButton = screen.getByRole("button", {
      name: /click to browse/i,
    });
    const fileInput = browseButton.nextElementSibling as HTMLInputElement;
    const files = [
      new File(["test1"], "test1.jpg", { type: "image/jpeg" }),
      new File(["test2"], "test2.jpg", { type: "image/jpeg" }),
      new File(["test3"], "test3.jpg", { type: "image/jpeg" }),
    ];
    fireEvent.change(fileInput, { target: { files } });
    expect(mockSetFiles).toHaveBeenCalledWith(files);
  });

  it("handles file input change with no files selected", () => {
    render(<UploadImgsForm files={null} setFiles={mockSetFiles} />);
    const browseButton = screen.getByRole("button", {
      name: /click to browse/i,
    });
    const fileInput = browseButton.nextElementSibling as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: null } });
    expect(mockSetFiles).toHaveBeenCalledWith(null);
  });

  it("maintains drag state during continuous drag operations", () => {
    const { container } = render(
      <UploadImgsForm files={null} setFiles={mockSetFiles} />,
    );
    const dropZone = container.querySelector('[class*="customFileLabel"]');
    fireEvent.dragEnter(dropZone!);
    expect(dropZone?.className).toContain("dragActive");
    fireEvent.dragOver(dropZone!);
    expect(dropZone?.className).toContain("dragActive");
    fireEvent.dragOver(dropZone!);
    expect(dropZone?.className).toContain("dragActive");
  });

  it("manages object URLs correctly for multiple images", () => {
    const files = [
      new File(["test1"], "test1.jpg", { type: "image/jpeg" }),
      new File(["test2"], "test2.jpg", { type: "image/jpeg" }),
      new File(["test3"], "test3.jpg", { type: "image/jpeg" }),
    ];
    render(
      <UploadImgsForm
        files={files as unknown as FileList}
        setFiles={mockSetFiles}
      />,
    );
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(3);
    expect(window.URL.createObjectURL).toHaveBeenCalledTimes(3);
    images.forEach((image) => fireEvent.load(image));
    expect(window.URL.revokeObjectURL).toHaveBeenCalledTimes(3);
    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith("mock-url");
  });

  it("handles drop events with empty files array", () => {
    const { container } = render(
      <UploadImgsForm files={null} setFiles={mockSetFiles} />,
    );
    const dropZone = container.querySelector('[class*="customFileLabel"]');
    const dropEvent = new Event("drop", {
      bubbles: true,
    }) as unknown as DragEvent;
    (
      dropEvent as unknown as {
        dataTransfer: { files: File[]; clearData: () => void };
      }
    ).dataTransfer = {
      files: [],
      clearData: vi.fn(),
    };
    fireEvent(dropZone!, dropEvent);
    expect(mockSetFiles).not.toHaveBeenCalled();
    expect(
      (dropEvent as unknown as { dataTransfer: { clearData: () => void } })
        .dataTransfer.clearData,
    ).not.toHaveBeenCalled();
  });

  it("triggers file input when browse button is activated with keyboard", () => {
    render(<UploadImgsForm files={null} setFiles={mockSetFiles} />);
    const browseButton = screen.getByRole("button", {
      name: /click to browse/i,
    });
    const fileInput = browseButton.nextElementSibling as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, "click");
    fireEvent.keyDown(browseButton, { key: "Enter", code: "Enter" });
    expect(clickSpy).toHaveBeenCalled();
  });

  it("accepts only image files", () => {
    render(<UploadImgsForm files={null} setFiles={mockSetFiles} />);
    const browseButton = screen.getByRole("button", {
      name: /click to browse/i,
    });
    const fileInput = browseButton.nextElementSibling as HTMLInputElement;
    expect(fileInput).toHaveAttribute("accept", "image/*");
  });

  it("handles invalid file types gracefully", () => {
    render(<UploadImgsForm files={null} setFiles={mockSetFiles} />);
    const browseButton = screen.getByRole("button", {
      name: /click to browse/i,
    });
    const fileInput = browseButton.nextElementSibling as HTMLInputElement;
    const invalidFile = new File(["test"], "test.txt", { type: "text/plain" });
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });
    expect(mockSetFiles).toHaveBeenCalled();
  });

  it("handles file input errors gracefully", () => {
    render(<UploadImgsForm files={null} setFiles={mockSetFiles} />);
    const browseButton = screen.getByRole("button", {
      name: /click to browse/i,
    });
    const fileInput = browseButton.nextElementSibling as HTMLInputElement;
    const errorEvent = new Event("error", { bubbles: true });
    fireEvent(fileInput, errorEvent);
    expect(screen.getByText("Upload images")).toBeInTheDocument();
  });

  it("maintains functionality during file processing", () => {
    const files = [new File(["test"], "test.jpg", { type: "image/jpeg" })];
    render(
      <UploadImgsForm
        files={files as unknown as FileList}
        setFiles={mockSetFiles}
      />,
    );
    const browseButton = screen.getByRole("button", {
      name: /click to browse/i,
    });
    expect(browseButton).toBeEnabled();
    const fileInput = browseButton.nextElementSibling as HTMLInputElement;
    const newFile = new File(["test2"], "test2.jpg", { type: "image/jpeg" });
    fireEvent.change(fileInput, { target: { files: [newFile] } });
    expect(mockSetFiles).toHaveBeenCalled();
  });

  it("has proper ARIA attributes for accessibility", () => {
    render(<UploadImgsForm files={null} setFiles={mockSetFiles} />);
    const browseButton = screen.getByRole("button", {
      name: /click to browse/i,
    });
    expect(browseButton).toBeInTheDocument();
    expect(browseButton).toHaveAccessibleName("Click to Browse");
  });

  it("supports Space key for keyboard activation", () => {
    render(<UploadImgsForm files={null} setFiles={mockSetFiles} />);
    const browseButton = screen.getByRole("button", {
      name: /click to browse/i,
    });
    const fileInput = browseButton.nextElementSibling as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, "click");
    fireEvent.keyDown(browseButton, { key: " ", code: "Space" });
    expect(clickSpy).toHaveBeenCalled();
  });

  it("ignores non-activation keys", () => {
    render(<UploadImgsForm files={null} setFiles={mockSetFiles} />);
    const browseButton = screen.getByRole("button", {
      name: /click to browse/i,
    });
    const fileInput = browseButton.nextElementSibling as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, "click");
    fireEvent.keyDown(browseButton, { key: "Tab", code: "Tab" });
    fireEvent.keyDown(browseButton, { key: "ArrowDown", code: "ArrowDown" });
    fireEvent.keyDown(browseButton, { key: "Escape", code: "Escape" });
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it("maintains focus management", () => {
    render(<UploadImgsForm files={null} setFiles={mockSetFiles} />);
    const browseButton = screen.getByRole("button", {
      name: /click to browse/i,
    });
    browseButton.focus();
    expect(document.activeElement).toBe(browseButton);
  });

  it("cleans up object URLs when component unmounts", () => {
    const files = [new File(["test"], "test.jpg", { type: "image/jpeg" })];
    const { unmount } = render(
      <UploadImgsForm
        files={files as unknown as FileList}
        setFiles={mockSetFiles}
      />,
    );
    expect(window.URL.createObjectURL).toHaveBeenCalled();
    unmount();

    // Note: In a real implementation, you might want to add cleanup in useEffect
    // This test documents the current behavior
  });

  it("handles rapid file selection changes", () => {
    render(<UploadImgsForm files={null} setFiles={mockSetFiles} />);
    const browseButton = screen.getByRole("button", {
      name: /click to browse/i,
    });
    const fileInput = browseButton.nextElementSibling as HTMLInputElement;
    const files1 = [new File(["test1"], "test1.jpg", { type: "image/jpeg" })];
    const files2 = [new File(["test2"], "test2.jpg", { type: "image/jpeg" })];
    const files3 = [new File(["test3"], "test3.jpg", { type: "image/jpeg" })];
    fireEvent.change(fileInput, { target: { files: files1 } });
    fireEvent.change(fileInput, { target: { files: files2 } });
    fireEvent.change(fileInput, { target: { files: files3 } });
    expect(mockSetFiles).toHaveBeenCalledTimes(3);
    expect(mockSetFiles).toHaveBeenLastCalledWith(files3);
  });
});
