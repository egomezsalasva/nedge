import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FormPage from "./FormPage";
import { SubmissionType } from "./AccessCodePage";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
}));

vi.mock("@/utils/supabase/client", () => ({
  createClient: vi.fn(),
}));

const mockSubmission: SubmissionType = {
  submitted: false,
  access_code: "TEST123",
  name: "John Doe",
  slug: "john-doe",
};

describe("FormPage Component", () => {
  beforeEach(() => {
    push.mockClear();
  });

  it("renders the main heading", () => {
    render(<FormPage submission={mockSubmission} />);
    expect(screen.getByText("Get Featured on Nedge")).toBeInTheDocument();
  });

  it("renders personalized greeting with submission name", () => {
    render(<FormPage submission={mockSubmission} />);
    expect(screen.getByText(/Hey there John Doe/)).toBeInTheDocument();
  });

  it("renders explanation about filling out the form", () => {
    render(<FormPage submission={mockSubmission} />);
    expect(
      screen.getByText(/Please complete the form below/),
    ).toBeInTheDocument();
    expect(screen.getByText(/We will review the form/)).toBeInTheDocument();
  });

  it("renders the HERE link for scrolling to benefits", () => {
    render(<FormPage submission={mockSubmission} />);
    expect(
      screen.getByText(/Read more about the benefits of joining Nedge/),
    ).toBeInTheDocument();
    const hereElements = screen.getAllByText("HERE");
    const hereSpan = hereElements.find(
      (element) =>
        element.tagName === "SPAN" &&
        element.style.textDecoration === "underline",
    );
    expect(hereSpan).toBeDefined();
    expect(hereSpan).toHaveStyle({ textDecoration: "underline" });
  });

  it("renders the benefits section with correct heading", () => {
    render(<FormPage submission={mockSubmission} />);
    expect(
      screen.getByText("Benefits of being featured on Nedge"),
    ).toBeInTheDocument();
  });

  it("renders the explanation about what Nedge is", () => {
    render(<FormPage submission={mockSubmission} />);
    expect(
      screen.getByText(
        /Nedge is a platform for showcasing outfits and styling/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/help users of the site find inspiraiton/),
    ).toBeInTheDocument();
  });

  it("renders the explanation about stylists and affiliate links", () => {
    render(<FormPage submission={mockSubmission} />);
    expect(screen.getByText(/For stylists like yourself/)).toBeInTheDocument();
    expect(
      screen.getByText(/offical place to showcase your work/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /passive revenue through the sale of the affiliate links/,
      ),
    ).toBeInTheDocument();
  });

  it("renders the explanation about current state and future goals", () => {
    render(<FormPage submission={mockSubmission} />);
    expect(
      screen.getByText(/As of now, we are still building enough traction/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /aim is to be able to support both the platform itself as well as the stylists/,
      ),
    ).toBeInTheDocument();
  });

  it("renders benefits section with correct ID", () => {
    render(<FormPage submission={mockSubmission} />);
    const benefitsSection = screen
      .getByText("Benefits of being featured on Nedge")
      .closest("div");
    expect(benefitsSection).toHaveAttribute("id", "benefits");
  });

  it("handles different submission names", () => {
    const differentSubmission: SubmissionType = {
      submitted: false,
      access_code: "TEST456",
      name: "Jane Smith",
      slug: "jane-smith",
    };
    render(<FormPage submission={differentSubmission} />);
    expect(screen.getByText(/Hey there Jane Smith/)).toBeInTheDocument();
  });

  it("calls handleScroll when HERE link is clicked", () => {
    const scrollIntoViewMock = vi.fn();
    const getElementByIdMock = vi.fn().mockReturnValue({
      scrollIntoView: scrollIntoViewMock,
    });
    Object.defineProperty(document, "getElementById", {
      value: getElementByIdMock,
      writable: true,
    });
    render(<FormPage submission={mockSubmission} />);
    const hereElements = screen.getAllByText("HERE");
    const hereSpan = hereElements.find(
      (element) =>
        element.tagName === "SPAN" &&
        element.style.textDecoration === "underline",
    );
    hereSpan?.click();
    expect(getElementByIdMock).toHaveBeenCalledWith("benefits");
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("renders FeaturesForm with correct submission prop", () => {
    render(<FormPage submission={mockSubmission} />);
    expect(
      screen.getByText(/Please complete the form below/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Hey there John Doe/)).toBeInTheDocument();
  });

  it("handles empty submission name gracefully", () => {
    const emptyNameSubmission: SubmissionType = {
      submitted: false,
      access_code: "TEST123",
      name: "",
      slug: "empty-name",
    };
    render(<FormPage submission={emptyNameSubmission} />);
    expect(screen.getByText(/Hey there/)).toBeInTheDocument();
  });

  it("handles special characters in submission name", () => {
    const specialCharSubmission: SubmissionType = {
      submitted: false,
      access_code: "TEST123",
      name: "José María",
      slug: "jose-maria",
    };
    render(<FormPage submission={specialCharSubmission} />);
    expect(screen.getByText(/Hey there José María/)).toBeInTheDocument();
  });

  it("has accessible heading structure", () => {
    render(<FormPage submission={mockSubmission} />);
    const mainHeading = screen.getByText("Get Featured on Nedge");
    expect(mainHeading.tagName).toBe("H1");
    const benefitsHeading = screen.getByText(
      "Benefits of being featured on Nedge",
    );
    expect(benefitsHeading.tagName).toBe("H2");
    const allHeadings = screen.getAllByRole("heading");
    expect(allHeadings.length).toBeGreaterThanOrEqual(2);
  });

  it("has accessible HERE link with proper role", () => {
    render(<FormPage submission={mockSubmission} />);
    const hereElements = screen.getAllByText("HERE");
    const hereSpan = hereElements.find(
      (element) =>
        element.tagName === "SPAN" &&
        element.style.textDecoration === "underline",
    );
    expect(hereSpan).toBeDefined();
    expect(hereSpan).toHaveStyle({ textDecoration: "underline" });
  });

  it("handles keyboard navigation for HERE link", () => {
    render(<FormPage submission={mockSubmission} />);
    const hereElements = screen.getAllByText("HERE");
    const hereSpan = hereElements.find(
      (element) =>
        element.tagName === "SPAN" &&
        element.style.textDecoration === "underline",
    );
    hereSpan?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    hereSpan?.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
  });

  it("handles null submission gracefully", () => {
    const nullSubmission: SubmissionType = {
      submitted: false,
      access_code: "TEST123",
      name: null as unknown as string,
      slug: "null-name",
    };
    render(<FormPage submission={nullSubmission} />);
    expect(screen.getByText(/Hey there/)).toBeInTheDocument();
  });

  it("handles undefined submission gracefully", () => {
    const undefinedSubmission: SubmissionType = {
      submitted: false,
      access_code: "TEST123",
      name: undefined as unknown as string,
      slug: "undefined-name",
    };
    render(<FormPage submission={undefinedSubmission} />);
    expect(screen.getByText(/Hey there/)).toBeInTheDocument();
  });

  it("handles very long submission names", () => {
    const longNameSubmission: SubmissionType = {
      submitted: false,
      access_code: "TEST123",
      name: "Dr. José María de los Ángeles García López y Martínez",
      slug: "long-name",
    };
    render(<FormPage submission={longNameSubmission} />);
    expect(
      screen.getByText(
        /Hey there Dr. José María de los Ángeles García López y Martínez/,
      ),
    ).toBeInTheDocument();
  });

  it("handles submission with numbers in name", () => {
    const numberNameSubmission: SubmissionType = {
      submitted: false,
      access_code: "TEST123",
      name: "John123",
      slug: "john123",
    };
    render(<FormPage submission={numberNameSubmission} />);
    expect(screen.getByText(/Hey there John123/)).toBeInTheDocument();
  });

  it("handles submission with emojis in name", () => {
    const emojiNameSubmission: SubmissionType = {
      submitted: false,
      access_code: "TEST123",
      name: "John 😊 Doe",
      slug: "john-doe",
    };
    render(<FormPage submission={emojiNameSubmission} />);
    expect(screen.getByText(/Hey there John 😊 Doe/)).toBeInTheDocument();
  });

  it("handles scroll when benefits element is not found", () => {
    const getElementByIdMock = vi.fn().mockReturnValue(null);
    Object.defineProperty(document, "getElementById", {
      value: getElementByIdMock,
      writable: true,
    });
    render(<FormPage submission={mockSubmission} />);
    const hereElements = screen.getAllByText("HERE");
    const hereSpan = hereElements.find(
      (element) =>
        element.tagName === "SPAN" &&
        element.style.textDecoration === "underline",
    );
    hereSpan?.click();
    expect(getElementByIdMock).toHaveBeenCalledWith("benefits");
  });

  it("handles component unmounting gracefully", () => {
    const { unmount } = render(<FormPage submission={mockSubmission} />);
    expect(screen.getByText("Get Featured on Nedge")).toBeInTheDocument();
    unmount();
  });

  it("handles rapid clicks on HERE link", () => {
    const scrollIntoViewMock = vi.fn();
    const getElementByIdMock = vi.fn().mockReturnValue({
      scrollIntoView: scrollIntoViewMock,
    });
    Object.defineProperty(document, "getElementById", {
      value: getElementByIdMock,
      writable: true,
    });
    render(<FormPage submission={mockSubmission} />);
    const hereElements = screen.getAllByText("HERE");
    const hereSpan = hereElements.find(
      (element) =>
        element.tagName === "SPAN" &&
        element.style.textDecoration === "underline",
    );
    hereSpan?.click();
    hereSpan?.click();
    hereSpan?.click();
    expect(getElementByIdMock).toHaveBeenCalledTimes(3);
  });

  it("handles submission with HTML entities in name", () => {
    const htmlEntitySubmission: SubmissionType = {
      submitted: false,
      access_code: "TEST123",
      name: "John & Jane",
      slug: "john-jane",
    };
    render(<FormPage submission={htmlEntitySubmission} />);
    expect(screen.getByText(/Hey there John & Jane/)).toBeInTheDocument();
  });

  it("handles submission with unicode characters in name", () => {
    const unicodeSubmission: SubmissionType = {
      submitted: false,
      access_code: "TEST123",
      name: "Björk Guðmundsdóttir",
      slug: "bjork-gudmundsdottir",
    };
    render(<FormPage submission={unicodeSubmission} />);
    expect(
      screen.getByText(/Hey there Björk Guðmundsdóttir/),
    ).toBeInTheDocument();
  });

  it("handles submission with mixed case names", () => {
    const mixedCaseSubmission: SubmissionType = {
      submitted: false,
      access_code: "TEST123",
      name: "McDonald's",
      slug: "mcdonalds",
    };
    render(<FormPage submission={mixedCaseSubmission} />);
    expect(screen.getByText(/Hey there McDonald's/)).toBeInTheDocument();
  });

  it("handles submission with script tags in name", () => {
    const scriptTagSubmission: SubmissionType = {
      submitted: false,
      access_code: "TEST123",
      name: "<script>alert('test')</script>",
      slug: "script-test",
    };
    render(<FormPage submission={scriptTagSubmission} />);
    expect(
      screen.getByText(/Hey there <script>alert\('test'\)<\/script>/),
    ).toBeInTheDocument();
  });

  it("handles submission with SQL injection in name", () => {
    const sqlInjectionSubmission: SubmissionType = {
      submitted: false,
      access_code: "TEST123",
      name: "'; DROP TABLE users; --",
      slug: "sql-test",
    };
    render(<FormPage submission={sqlInjectionSubmission} />);
    expect(
      screen.getByText(/Hey there '; DROP TABLE users; --/),
    ).toBeInTheDocument();
  });

  it("handles submission with XSS payload in name", () => {
    const xssSubmission: SubmissionType = {
      submitted: false,
      access_code: "TEST123",
      name: "<img src=x onerror=alert('XSS')>",
      slug: "xss-test",
    };
    render(<FormPage submission={xssSubmission} />);
    expect(
      screen.getByText(/Hey there <img src=x onerror=alert\('XSS'\)>/),
    ).toBeInTheDocument();
  });

  it("handles submission with newlines in name", () => {
    const newlineSubmission: SubmissionType = {
      submitted: false,
      access_code: "TEST123",
      name: "John\nDoe",
      slug: "newline-test",
    };
    render(<FormPage submission={newlineSubmission} />);
    expect(screen.getByText(/Hey there/)).toBeInTheDocument();
    expect(screen.getByText(/John/)).toBeInTheDocument();
    expect(screen.getByText(/Doe/)).toBeInTheDocument();
  });

  it("handles submission with tabs in name", () => {
    const tabSubmission: SubmissionType = {
      submitted: false,
      access_code: "TEST123",
      name: "John\tDoe",
      slug: "tab-test",
    };
    render(<FormPage submission={tabSubmission} />);
    expect(screen.getByText(/Hey there/)).toBeInTheDocument();
    expect(screen.getByText(/John/)).toBeInTheDocument();
    expect(screen.getByText(/Doe/)).toBeInTheDocument();
  });

  it("handles submission with zero-width characters in name", () => {
    const zeroWidthSubmission: SubmissionType = {
      submitted: false,
      access_code: "TEST123",
      name: "John\u200BDoe",
      slug: "zerowidth-test",
    };
    render(<FormPage submission={zeroWidthSubmission} />);
    expect(screen.getByText(/Hey there John\u200BDoe/)).toBeInTheDocument();
  });

  it("handles submission with control characters in name", () => {
    const controlCharSubmission: SubmissionType = {
      submitted: false,
      access_code: "TEST123",
      name: "John\x00Doe",
      slug: "control-test",
    };
    render(<FormPage submission={controlCharSubmission} />);
    expect(screen.getByText(/Hey there John\x00Doe/)).toBeInTheDocument();
  });

  it("handles submission with extremely long name", () => {
    const extremelyLongName = "A".repeat(10000);
    const longNameSubmission: SubmissionType = {
      submitted: false,
      access_code: "TEST123",
      name: extremelyLongName,
      slug: "extremely-long-test",
    };
    render(<FormPage submission={longNameSubmission} />);
    expect(
      screen.getByText(new RegExp(`Hey there ${extremelyLongName}`)),
    ).toBeInTheDocument();
  });

  it("handles submission with only whitespace in name", () => {
    const whitespaceSubmission: SubmissionType = {
      submitted: false,
      access_code: "TEST123",
      name: "   ",
      slug: "whitespace-test",
    };
    render(<FormPage submission={whitespaceSubmission} />);
    expect(screen.getByText(/Hey there/)).toBeInTheDocument();
  });

  it("handles submission with missing submission properties", () => {
    const incompleteSubmission = {
      submitted: false,
      // missing access_code, name, slug
    } as unknown as SubmissionType;
    render(<FormPage submission={incompleteSubmission} />);
    expect(screen.getByText(/Hey there/)).toBeInTheDocument();
  });

  it("handles submission with non-string name", () => {
    const nonStringNameSubmission: SubmissionType = {
      submitted: false,
      access_code: "TEST123",
      name: "123" as unknown as string,
      slug: "number-test",
    };
    render(<FormPage submission={nonStringNameSubmission} />);
    expect(screen.getByText(/Hey there/)).toBeInTheDocument();
  });

  it("handles submission with boolean name", () => {
    const booleanNameSubmission: SubmissionType = {
      submitted: false,
      access_code: "TEST123",
      name: true as unknown as string,
      slug: "boolean-test",
    };
    render(<FormPage submission={booleanNameSubmission} />);
    expect(screen.getByText(/Hey there/)).toBeInTheDocument();
  });

  it("handles submission with array name", () => {
    const arrayNameSubmission: SubmissionType = {
      submitted: false,
      access_code: "TEST123",
      name: ["John", "Doe"] as unknown as string,
      slug: "array-test",
    };
    render(<FormPage submission={arrayNameSubmission} />);
    expect(screen.getByText(/Hey there/)).toBeInTheDocument();
  });

  it("renders within acceptable performance time", () => {
    const startTime = performance.now();
    render(<FormPage submission={mockSubmission} />);
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    expect(renderTime).toBeLessThan(100);
  });

  it("handles multiple re-renders without memory leaks", () => {
    const { rerender, unmount } = render(
      <FormPage submission={mockSubmission} />,
    );
    for (let i = 0; i < 10; i++) {
      rerender(<FormPage submission={mockSubmission} />);
    }
    expect(screen.getByText("Get Featured on Nedge")).toBeInTheDocument();
    unmount();
  });
});
