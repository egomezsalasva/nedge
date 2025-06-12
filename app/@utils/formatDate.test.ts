import { describe, it, expect } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("should format date string to DD/MM/YYYY format", () => {
    const result = formatDate("2024-01-15");
    expect(result).toBe("15/01/2024");
  });

  it("should handle ISO date strings correctly", () => {
    const result = formatDate("2023-12-25T10:30:00Z");
    expect(result).toBe("25/12/2023");
  });

  it("should format single digit days and months with leading zeros", () => {
    const result = formatDate("2024-03-05");
    expect(result).toBe("05/03/2024");
  });
});
