import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiError } from "../../api/http";
import * as api from "../../features/tasks/api";
import { makeTask } from "../../test/fixtures";
import { renderWithProviders } from "../../test/render";
import { EditarTarefa } from "../EditarTarefa";

vi.mock("../features/tasks/api");

function setup(route = "/tarefas/1/editar") {
  return renderWithProviders(<EditarTarefa />, { route, path: "/tarefas/:id/editar" });
}

describe("EditarTarefa", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("carrega a tarefa no formulário", async () => {
    vi.mocked(api.getTask).mockResolvedValue(makeTask({ id: 1, title: "Estudar React" }));
    setup();

    expect(screen.getByText("Carregando tarefa...")).toBeInTheDocument();
    expect(await screen.findByDisplayValue("Estudar React")).toBeInTheDocument();
    expect(api.getTask).toHaveBeenCalledWith(1);
  });

  it("salva as alterações e volta para a Home", async () => {
    vi.mocked(api.getTask).mockResolvedValue(makeTask({ id: 1, title: "Estudar React" }));
    vi.mocked(api.updateTask).mockResolvedValue(makeTask({ id: 1, title: "Estudar React Query" }));
    setup();

    const title = await screen.findByLabelText("Título");
    await userEvent.clear(title);
    await userEvent.type(title, "Estudar React Query");
    await userEvent.click(screen.getByRole("button", { name: "Salvar alterações" }));

    expect(api.updateTask).toHaveBeenCalledWith(1, {
      title: "Estudar React Query",
      description: "Fazer o CRUD completo",
      status: "TODO",
    });
    expect(await screen.findByText("Página inicial")).toBeInTheDocument();
    expect(screen.getByText("Tarefa atualizada")).toBeInTheDocument();
  });

  it("mostra erro quando a tarefa não existe", async () => {
    vi.mocked(api.getTask).mockRejectedValue(new ApiError(404, "Tarefa não encontrada: 99"));
    setup("/tarefas/99/editar");

    expect(await screen.findByText("Tarefa não encontrada: 99")).toBeInTheDocument();
  });

  it("rejeita ids inválidos sem chamar a API", () => {
    setup("/tarefas/abc/editar");

    expect(screen.getByText("Tarefa inválida.")).toBeInTheDocument();
    expect(api.getTask).not.toHaveBeenCalled();
  });
});
