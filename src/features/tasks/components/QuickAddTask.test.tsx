import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiError } from "../../../api/http";
import { makeTask } from "../../../test/fixtures";
import { renderWithProviders } from "../../../test/render";
import * as api from "../api";
import { QuickAddTask } from "./QuickAddTask";

vi.mock("../api");

describe("QuickAddTask", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("não envia com o título vazio", async () => {
    renderWithProviders(<QuickAddTask />);

    await userEvent.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(screen.getByRole("alert")).toHaveTextContent("O título é obrigatório");
    expect(api.createTask).not.toHaveBeenCalled();
  });

  it("salva a tarefa, limpa o campo e avisa", async () => {
    vi.mocked(api.createTask).mockResolvedValue(makeTask({ title: "Comprar leite" }));
    renderWithProviders(<QuickAddTask />);
    const input = screen.getByLabelText("Título da nova tarefa");

    await userEvent.type(input, "  Comprar leite  ");
    await userEvent.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(api.createTask).toHaveBeenCalledWith({ title: "Comprar leite" });
    expect(await screen.findByText("Tarefa adicionada")).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("envia ao apertar Enter", async () => {
    vi.mocked(api.createTask).mockResolvedValue(makeTask());
    renderWithProviders(<QuickAddTask />);

    await userEvent.type(screen.getByLabelText("Título da nova tarefa"), "Via Enter{Enter}");

    expect(api.createTask).toHaveBeenCalledWith({ title: "Via Enter" });
  });

  it("mostra o erro da API e mantém o texto digitado", async () => {
    vi.mocked(api.createTask).mockRejectedValue(new ApiError(0, "Não foi possível conectar ao servidor."));
    renderWithProviders(<QuickAddTask />);
    const input = screen.getByLabelText("Título da nova tarefa");

    await userEvent.type(input, "Minha tarefa");
    await userEvent.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(await screen.findByText("Não foi possível conectar ao servidor.")).toBeInTheDocument();
    expect(input).toHaveValue("Minha tarefa");
  });
});
