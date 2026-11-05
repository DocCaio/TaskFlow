import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider } from "./ToastProvider";
import { useToast } from "./toast-context";

function Trigger() {
  const toast = useToast();
  return (
    <>
      <button onClick={() => toast.show("Salvo!")}>ok</button>
      <button onClick={() => toast.show("Deu ruim", "error")}>erro</button>
    </>
  );
}

describe("ToastProvider", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("mostra a mensagem e remove depois de alguns segundos", () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );

    act(() => screen.getByText("ok").click());
    expect(screen.getByText("Salvo!")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4500);
    });
    expect(screen.queryByText("Salvo!")).not.toBeInTheDocument();
  });

  it("mostra mensagens de erro", async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByText("erro"));

    expect(screen.getByText("Deu ruim")).toBeInTheDocument();
  });

  it("falha com mensagem clara fora do provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Trigger />)).toThrow("useToast deve ser usado dentro de <ToastProvider>");

    spy.mockRestore();
  });
});
