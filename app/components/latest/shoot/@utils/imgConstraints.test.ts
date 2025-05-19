import { describe, expect, it, vi } from "vitest";
import { imgConstraints } from "./imgConstraints";

describe("imgConstraints", () => {
  it("logs an error if more than n images are provided", () => {
    const images = Array.from({ length: 11 }, (_, i) => `img${i}.jpg`);
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    imgConstraints(images, 10);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "No more than 10 images are allowed.",
    );

    consoleErrorSpy.mockRestore();
  });

  it("does not log an error if n or fewer images are provided", () => {
    const images = Array.from({ length: 10 }, (_, i) => `img${i}.jpg`);
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    imgConstraints(images, 10);

    expect(consoleErrorSpy).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
