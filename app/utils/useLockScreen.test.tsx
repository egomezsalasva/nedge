import { render } from "@testing-library/react";
import { useLockScreen } from "./useLockScreen";

function TestComponent() {
  useLockScreen();
  return null;
}

describe("useLockScreen", () => {
  it("adds the 'lock-screen' class to the document element on mount", () => {
    render(<TestComponent />);
    expect(document.documentElement.classList.contains("lock-screen")).toBe(
      true,
    );
  });
  it("removes the 'lock-screen' class from the document element on unmount", () => {
    const { unmount } = render(<TestComponent />);
    expect(document.documentElement.classList.contains("lock-screen")).toBe(
      true,
    );
    unmount();
    expect(document.documentElement.classList.contains("lock-screen")).toBe(
      false,
    );
  });
  it("does not add the 'lock-screen' class multiple times if mounted more than once", () => {
    render(
      <>
        <TestComponent />
        <TestComponent />
      </>,
    );
    expect(document.documentElement.classList.contains("lock-screen")).toBe(
      true,
    );
    expect(
      Array.from(document.documentElement.classList).filter(
        (classItem) => classItem === "lock-screen",
      ).length,
    ).toBe(1);
  });
  it("removes the 'lock-screen' class when one of multiple instances is unmounted (current behavior)", () => {
    const { unmount: unmountFirst } = render(<TestComponent />);
    const { unmount: unmountSecond } = render(<TestComponent />);
    expect(document.documentElement.classList.contains("lock-screen")).toBe(
      true,
    );
    unmountFirst();
    expect(document.documentElement.classList.contains("lock-screen")).toBe(
      false,
    );
    unmountSecond();
    expect(document.documentElement.classList.contains("lock-screen")).toBe(
      false,
    );
  });
});
