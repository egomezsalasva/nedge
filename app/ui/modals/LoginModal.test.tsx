import { render, screen } from "@testing-library/react";
import LoginModal from "./LoginModal";

const push = vi.fn();
const useLockScreen = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
}));

vi.mock("@/app/utils", () => {
  return {
    useLockScreen: () => useLockScreen(),
  };
});

describe("LoginModal", () => {
  beforeEach(() => {
    push.mockClear();
    useLockScreen.mockClear();
  });
  it("renders with given title", () => {
    const setIsActive = vi.fn();
    render(<LoginModal setIsActive={setIsActive} title="Test Title" />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });
  it("calls setIsActive(false) when close button is clicked", () => {
    const setIsActive = vi.fn();
    render(<LoginModal setIsActive={setIsActive} title="Test Title" />);
    const closeButton = screen.getByRole("button", { name: /x/i });
    closeButton.click();
    expect(setIsActive).toHaveBeenCalledWith(false);
  });
  it("calls setIsActive(false) when clicking outside the modal content", () => {
    const setIsActive = vi.fn();
    render(<LoginModal setIsActive={setIsActive} title="Test Title" />);
    const overlay = screen.getByTestId("login-modal-container");
    overlay.click();
    expect(setIsActive).toHaveBeenCalledWith(false);
  });
  it("does not call setIsActive(false) when clicking inside the modal content", () => {
    const setIsActive = vi.fn();
    render(<LoginModal setIsActive={setIsActive} title="Test Title" />);
    const modalContent = screen.getByText("Test Title").parentElement!;
    modalContent.click();
    expect(setIsActive).not.toHaveBeenCalled();
  });
  it('navigates to "/login" when "Go to Login" button is clicked', () => {
    const setIsActive = vi.fn();
    render(<LoginModal setIsActive={setIsActive} title="Test Title" />);
    const goToLoginButton = screen.getByRole("button", {
      name: /go to login/i,
    });
    goToLoginButton.click();
    expect(push).toHaveBeenCalledWith("/login");
  });
  it("calls useLockScreen on mount", () => {
    const setIsActive = vi.fn();
    render(<LoginModal setIsActive={setIsActive} title="Test Title" />);
    expect(useLockScreen).toHaveBeenCalled();
  });
});
