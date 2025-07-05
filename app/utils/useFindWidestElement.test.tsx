import { renderHook } from "@testing-library/react";
import { useFindWidestElement, findLargestWidth } from "./useFindWidestElement";

describe("useFindWidestElement", () => {
  it("returns undefined initially", () => {
    const containerRef = { current: null };
    const { result } = renderHook(() =>
      useFindWidestElement(containerRef, "data-test"),
    );
    expect(result.current).toBeUndefined();
  });
  it("finds the largest width from a list of elements", () => {
    const elements: { offsetWidth: number }[] = [
      { offsetWidth: 10 },
      { offsetWidth: 50 },
      { offsetWidth: 30 },
    ];
    expect(findLargestWidth(elements)).toBe(50);
  });

  it("returns undefined if there are no elements with the data attribute", () => {
    const containerRef = {
      current: {
        querySelectorAll: () => [],
      } as unknown as HTMLDivElement,
    };
    const { result } = renderHook(() =>
      useFindWidestElement(containerRef, "data-test"),
    );
    expect(result.current).toBeUndefined();
  });

  it("returns undefined if containerRef.current is null", () => {
    const containerRef = { current: null };
    const { result } = renderHook(() =>
      useFindWidestElement(containerRef, "data-test"),
    );
    expect(result.current).toBeUndefined();
  });

  it("returns undefined if all elements have zero width", () => {
    const containerRef = {
      current: {
        querySelectorAll: () => [{ offsetWidth: 0 }, { offsetWidth: 0 }],
      } as unknown as HTMLDivElement,
    };

    const { result } = renderHook(() =>
      useFindWidestElement(containerRef, "data-test"),
    );
    expect(result.current).toBeUndefined();
  });

  it("ignores elements with missing or non-numeric offsetWidth", () => {
    const containerRef = {
      current: {
        querySelectorAll: () => [
          { offsetWidth: 0 },
          {}, // missing offsetWidth
          { offsetWidth: "not-a-number" },
          { offsetWidth: 20 },
        ],
      } as unknown as HTMLDivElement,
    };
    const { result } = renderHook(() =>
      useFindWidestElement(containerRef, "data-test"),
    );
    expect(result.current).toBe(21);
  });

  it("ignores negative offsetWidth values", () => {
    const containerRef = {
      current: {
        querySelectorAll: () => [
          { offsetWidth: -20 },
          { offsetWidth: 0 },
          { offsetWidth: 15 },
        ],
      } as unknown as HTMLDivElement,
    };
    const { result } = renderHook(() =>
      useFindWidestElement(containerRef, "data-test"),
    );
    expect(result.current).toBe(16);
  });
});
