import { describe, expect, it, vi } from "vitest";
import { imgConstraints } from "./imgConstraints";

describe("imgConstraints", () => {
  it("logs an error and returns sliced array if more than n images are provided", () => {
    const images = Array.from({ length: 11 }, (_, i) => `img${i}.jpg`);
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const result = imgConstraints(images, 10);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "No more than 10 images are allowed. Found 11 images.",
    );
    expect(result).toEqual(images.slice(0, 10));
    expect(result).toHaveLength(10);
    consoleErrorSpy.mockRestore();
  });

  it("returns original array if n or fewer images are provided", () => {
    const images = Array.from({ length: 8 }, (_, i) => `img${i}.jpg`);
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const result = imgConstraints(images, 10);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(result).toEqual(images);
    expect(result).toHaveLength(8);
    consoleErrorSpy.mockRestore();
  });

  it("logs a warning and returns empty array for invalid input", () => {
    const consoleWarnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => {});
    const result1 = imgConstraints(null as any, 10);
    const result2 = imgConstraints(undefined as any, 10);
    const result3 = imgConstraints("not an array" as any, 10);
    expect(consoleWarnSpy).toHaveBeenCalledTimes(3);
    expect(consoleWarnSpy).toHaveBeenCalledWith("Images array is invalid");
    expect(result1).toEqual([]);
    expect(result2).toEqual([]);
    expect(result3).toEqual([]);
    consoleWarnSpy.mockRestore();
  });
  it("returns empty array for empty input array without warning", () => {
    const consoleWarnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => {});
    const result = imgConstraints([], 10);
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    expect(result).toEqual([]);
    consoleWarnSpy.mockRestore();
  });
});
