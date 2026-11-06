import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiError } from "../../api/http";
import * as api from "../../features/tasks/api";
import { makeTask } from "../../test/fixtures";
import { renderWithProviders } from "../../test/render";
import { Postar } from "../Postar";

vi.mock("../../features/tasks/api");

function setup() {
  return renderWithProviders(<Postar />, { route: "/postar", path: "/postar" });
}

describe("Postar", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("não envia com formulário inválido", async () => {
    setup();

    await userEvent.click(screen.getByRole("button", { name: "Criar tarefa" }));

    expect(screen.getByRole("alert")).toHaveTextContent("O título é obrigatório");
    expect(api.createTask).not.toHaveBeenCalled();
  });

  it("cria a tarefa, avisa e volta para a Home", async () => {
    vi.mocked(api.createTask).mockResolvedValue(makeTask());
    setup();

    await userEvent.type(screen.getByLabelText("Título"), "Nova tarefa");
    await userEvent.click(screen.getByRole("button", { name: "Criar tarefa" }));

    expect(api.createTask).toHaveBeenCalledWith({
      title: "Nova tarefa",
      description: null,
      status: "TODO",
    });
    expect(await screen.findByText("Página inicial")).toBeInTheDocument();
    expect(screen.getByText("Tarefa criada com sucesso")).toBeInTheDocument();
  });

  it("mostra o erro devolvido pela API", async () => {
    vi.mocked(api.createTask).mockRejectedValue(new ApiError(400, "Dados inválidos"));
    setup();

    await userEvent.type(screen.getByLabelText("Título"), "Nova tarefa");
    await userEvent.click(screen.getByRole("button", { name: "Criar tarefa" }));

    expect(await screen.findByText("Dados inválidos")).toBeInTheDocument();
    expect(screen.queryByText("Página inicial")).not.toBeInTheDocument();
  });
});
