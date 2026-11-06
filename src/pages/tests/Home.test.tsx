import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiError } from "../../api/http";
import * as api from "../../features/tasks/api";
import { useTaskFilterStore } from "../../features/tasks/store";
import { makeTask } from "../../test/fixtures";
import { renderWithProviders } from "../../test/render";
import { Home } from "../Home";

vi.mock("../../features/tasks/api");

const tasks = [
  makeTask({ id: 1, title: "Estudar React", status: "TODO" }),
  makeTask({ id: 2, title: "Configurar CI", description: null, status: "DOING" }),
  makeTask({ id: 3, title: "Escrever testes", description: null, status: "DONE" }),
];

describe("Home", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    useTaskFilterStore.getState().reset();
  });

  it("mostra o carregando e depois as tarefas", async () => {
    vi.mocked(api.listTasks).mockResolvedValue(tasks);
    renderWithProviders(<Home />);

    expect(screen.getByText("Carregando tarefas...")).toBeInTheDocument();
    expect(await screen.findByText("Estudar React")).toBeInTheDocument();
    expect(screen.getByText("Configurar CI")).toBeInTheDocument();
    expect(screen.getByText("3 tarefas no total")).toBeInTheDocument();
  });

  it("mostra o estado vazio quando não há tarefas", async () => {
    vi.mocked(api.listTasks).mockResolvedValue([]);
    renderWithProviders(<Home />);

    expect(await screen.findByText(/Nenhuma tarefa ainda/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Crie a primeira!" })).toHaveAttribute("href", "/postar");
  });

  it("mostra o erro e permite tentar de novo", async () => {
    vi.mocked(api.listTasks)
      .mockRejectedValueOnce(new ApiError(500, "Servidor fora do ar"))
      .mockResolvedValueOnce(tasks);
    renderWithProviders(<Home />);

    expect(await screen.findByText("Servidor fora do ar")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(await screen.findByText("Estudar React")).toBeInTheDocument();
  });

  it("filtra por status", async () => {
    vi.mocked(api.listTasks).mockResolvedValue(tasks);
    renderWithProviders(<Home />);
    await screen.findByText("Estudar React");

    await userEvent.click(screen.getByRole("button", { name: "Concluídas" }));

    expect(screen.getByText("Escrever testes")).toBeInTheDocument();
    expect(screen.queryByText("Estudar React")).not.toBeInTheDocument();
  });

  it("filtra pela busca e avisa quando nada é encontrado", async () => {
    vi.mocked(api.listTasks).mockResolvedValue(tasks);
    renderWithProviders(<Home />);
    await screen.findByText("Estudar React");

    await userEvent.type(screen.getByLabelText("Buscar tarefas"), "ci");
    expect(screen.getByText("Configurar CI")).toBeInTheDocument();
    expect(screen.queryByText("Estudar React")).not.toBeInTheDocument();

    await userEvent.clear(screen.getByLabelText("Buscar tarefas"));
    await userEvent.type(screen.getByLabelText("Buscar tarefas"), "inexistente");
    expect(screen.getByText("Nenhuma tarefa encontrada com esses filtros.")).toBeInTheDocument();
  });

  it("atualiza o status pela tarefa", async () => {
    vi.mocked(api.listTasks).mockResolvedValue(tasks);
    vi.mocked(api.updateTask).mockResolvedValue(makeTask({ id: 1, status: "DONE" }));
    renderWithProviders(<Home />);
    await screen.findByText("Estudar React");

    await userEvent.selectOptions(screen.getByLabelText("Alterar status de Estudar React"), "DONE");

    expect(api.updateTask).toHaveBeenCalledWith(1, {
      title: "Estudar React",
      description: "Fazer o CRUD completo",
      status: "DONE",
    });
    expect(await screen.findByText("Status atualizado")).toBeInTheDocument();
  });

  it("exclui a tarefa depois de confirmar", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.mocked(api.listTasks).mockResolvedValue(tasks);
    vi.mocked(api.deleteTask).mockResolvedValue(undefined);
    renderWithProviders(<Home />);
    await screen.findByText("Estudar React");

    await userEvent.click(screen.getByRole("button", { name: "Excluir Estudar React" }));

    expect(api.deleteTask).toHaveBeenCalledWith(1);
    expect(await screen.findByText("Tarefa excluída")).toBeInTheDocument();
  });

  it("não exclui quando o usuário cancela", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    vi.mocked(api.listTasks).mockResolvedValue(tasks);
    renderWithProviders(<Home />);
    await screen.findByText("Estudar React");

    await userEvent.click(screen.getByRole("button", { name: "Excluir Estudar React" }));

    expect(api.deleteTask).not.toHaveBeenCalled();
  });

  it("mostra erro quando a exclusão falha", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.mocked(api.listTasks).mockResolvedValue(tasks);
    vi.mocked(api.deleteTask).mockRejectedValue(new ApiError(404, "Tarefa não encontrada: 1"));
    renderWithProviders(<Home />);
    await screen.findByText("Estudar React");

    await userEvent.click(screen.getByRole("button", { name: "Excluir Estudar React" }));

    expect(await screen.findByText("Tarefa não encontrada: 1")).toBeInTheDocument();
  });

  it("adiciona uma tarefa pelo campo rápido e atualiza a lista", async () => {
    const created = makeTask({ id: 4, title: "Tarefa rápida", description: null });
    vi.mocked(api.listTasks).mockResolvedValueOnce(tasks).mockResolvedValue([created, ...tasks]);
    vi.mocked(api.createTask).mockResolvedValue(created);
    renderWithProviders(<Home />);
    await screen.findByText("Estudar React");

    await userEvent.type(screen.getByLabelText("Título da nova tarefa"), "Tarefa rápida");
    await userEvent.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(await screen.findByText("Tarefa rápida")).toBeInTheDocument();
    expect(screen.getByText("4 tarefas no total")).toBeInTheDocument();
  });

  it("marca a tarefa como concluída pela caixa de seleção", async () => {
    vi.mocked(api.listTasks).mockResolvedValue(tasks);
    vi.mocked(api.updateTask).mockResolvedValue(makeTask({ id: 1, status: "DONE" }));
    renderWithProviders(<Home />);
    await screen.findByText("Estudar React");

    await userEvent.click(screen.getByRole("checkbox", { name: "Concluir Estudar React" }));

    expect(api.updateTask).toHaveBeenCalledWith(1, expect.objectContaining({ status: "DONE" }));
  });
});
