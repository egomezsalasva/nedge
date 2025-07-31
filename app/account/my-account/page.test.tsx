import { render, screen } from "@testing-library/react";
import MyAccountPage from "./page";

vi.mock("./@ui/LogoutButton", () => ({
  default: () => <button>Log out</button>,
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() =>
        Promise.resolve({
          data: { user: { email: "test@example.com" } },
        }),
      ),
    },
  })),
}));

describe("MyAccountPage", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("renders the email section with user email", async () => {
    render(await MyAccountPage());
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("renders the password section with change password link", async () => {
    render(await MyAccountPage());
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByText("Change password")).toBeInTheDocument();
  });

  it("renders the subscription section with support link", async () => {
    render(await MyAccountPage());
    expect(screen.getByText("Subscription")).toBeInTheDocument();
    expect(screen.getByText("Support Nedge")).toBeInTheDocument();
  });

  it("renders the logout button", async () => {
    render(await MyAccountPage());
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });

  it("renders the main container with correct class", async () => {
    const { container } = render(await MyAccountPage());
    expect(container.querySelector("main")).toBeInTheDocument();
  });

  it("renders all section headings", async () => {
    render(await MyAccountPage());
    expect(screen.getByRole("heading", { name: "Email" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Password" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Subscription" }),
    ).toBeInTheDocument();
  });

  it("renders links with correct href attributes", async () => {
    render(await MyAccountPage());
    expect(
      screen.getByRole("link", { name: "Change password" }),
    ).toHaveAttribute("href", "/reset-password?title=Change%20password");
    expect(screen.getByRole("link", { name: "Support Nedge" })).toHaveAttribute(
      "href",
      "/support",
    );
  });

  it("renders component structure in correct order", async () => {
    render(await MyAccountPage());
    const headings = screen.getAllByRole("heading");
    expect(headings[0]).toHaveTextContent("Email");
    expect(headings[1]).toHaveTextContent("Password");
    expect(headings[2]).toHaveTextContent("Subscription");
  });

  it("renders exactly 2 links", async () => {
    render(await MyAccountPage());
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
  });

  it("renders exactly 1 button", async () => {
    render(await MyAccountPage());
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(1);
  });

  it("renders email as paragraph text", async () => {
    render(await MyAccountPage());
    const emailText = screen.getByText("test@example.com");
    expect(emailText.tagName).toBe("P");
  });

  it("renders component without errors", async () => {
    expect(async () => {
      render(await MyAccountPage());
    }).not.toThrow();
  });

  it("displays loading text when user email is not available", async () => {
    vi.doMock("@/utils/supabase/server", () => ({
      createClient: () =>
        Promise.resolve({
          auth: {
            getUser: () =>
              Promise.resolve({
                data: { user: null },
              }),
          },
        }),
    }));
    vi.doMock("./@ui/LogoutButton", () => ({
      default: () => <button>Log out</button>,
    }));
    vi.doMock("next/link", () => ({
      default: ({
        children,
        href,
      }: {
        children: React.ReactNode;
        href: string;
      }) => <a href={href}>{children}</a>,
    }));
    const { default: TestMyAccountPage } = await import("./page");
    render(await TestMyAccountPage());
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("has proper accessibility structure", async () => {
    render(await MyAccountPage());
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getAllByRole("heading")).toHaveLength(3);
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("renders component as an async function", async () => {
    const component = MyAccountPage();
    expect(component).toBeInstanceOf(Promise);
    const resolvedComponent = await component;
    expect(resolvedComponent).toBeDefined();
  });

  it("renders component with default export", () => {
    expect(MyAccountPage).toBeDefined();
    expect(typeof MyAccountPage).toBe("function");
  });

  it("renders without any console errors", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(await MyAccountPage());
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("renders component multiple times consistently", async () => {
    const { unmount: unmount1 } = render(await MyAccountPage());
    expect(screen.getByText("Email")).toBeInTheDocument();
    unmount1();
    const { unmount: unmount2 } = render(await MyAccountPage());
    expect(screen.getByText("Email")).toBeInTheDocument();
    unmount2();
  });

  it("renders with proper React element structure", async () => {
    const component = await MyAccountPage();
    expect(component).toHaveProperty("type", "main");
    expect(component).toHaveProperty("props");
    expect(component.props.children).toBeDefined();
  });

  it("renders all interactive elements correctly", async () => {
    render(await MyAccountPage());
    expect(screen.getByRole("link", { name: "Change password" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Support Nedge" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Log out" })).toBeVisible();
  });

  it("has no duplicate test content", async () => {
    render(await MyAccountPage());
    const emailElements = screen.getAllByText("Email");
    const passwordElements = screen.getAllByText("Password");
    const subscriptionElements = screen.getAllByText("Subscription");
    expect(emailElements).toHaveLength(1);
    expect(passwordElements).toHaveLength(1);
    expect(subscriptionElements).toHaveLength(1);
  });

  it("renders component with correct semantic structure", async () => {
    const { container } = render(await MyAccountPage());
    const main = container.querySelector("main");
    expect(main?.children).toHaveLength(4); // 3 divs + 1 LogoutButton
    expect(main?.firstElementChild?.tagName).toBe("DIV");
    expect(main?.lastElementChild?.tagName).toBe("BUTTON");
  });

  it("renders email text content without HTML markup", async () => {
    render(await MyAccountPage());
    const emailElement = screen.getByText("test@example.com");
    expect(emailElement.innerHTML).toBe("test@example.com");
  });

  it("cleans up properly when component unmounts", async () => {
    const { unmount } = render(await MyAccountPage());
    expect(screen.getByText("Email")).toBeInTheDocument();
    unmount();
    expect(screen.queryByText("Email")).not.toBeInTheDocument();
    expect(screen.queryByText("Password")).not.toBeInTheDocument();
    expect(screen.queryByText("Subscription")).not.toBeInTheDocument();
  });
});
