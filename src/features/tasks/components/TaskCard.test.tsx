import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { makeTask } from "../../../test/fixtures";
import { TaskCard } from "./TaskCard";

function setup(overrides = {}) {
  const task = makeTask(overrides);
  const onStatusChange = vi.fn();
  const onDelete = vi.fn();

  render(
    <MemoryRouter>
      <TaskCard task={task} onStatusChange={onStatusChange} onDelete={onDelete} />
    </MemoryRouter>,
  );

  return { task, onStatusChange, onDelete };
}

describe("TaskCard", () => {
  it("mostra título, descrição e status", () => {
    setup();

    expect(screen.getByRole("heading", { name: "Estudar Spring Boot" })).toBeInTheDocument();
    expect(screen.getByText("Fazer o CRUD completo")).toBeInTheDocument();
    expect(screen.getByText("A fazer", { selector: "span" })).toBeInTheDocument();
  });

  it("não mostra descrição quando ela é nula", () => {
    setup({ description: null });

    expect(screen.queryByText("Fazer o CRUD completo")).not.toBeInTheDocument();
  });

  it("aponta o link de edição para a rota da tarefa", () => {
    setup({ id: 7 });

    expect(screen.getByRole("link", { name: "Editar Estudar Spring Boot" })).toHaveAttribute(
      "href",
      "/tarefas/7/editar",
    );
  });

  it("avisa a mudança de status", async () => {
    const { task, onStatusChange } = setup();

    await userEvent.selectOptions(
      screen.getByLabelText("Alterar status de Estudar Spring Boot"),
      "DONE",
    );

    expect(onStatusChange).toHaveBeenCalledWith(task, "DONE");
  });

  it("avisa a exclusão", async () => {
    const { task, onDelete } = setup();

    await userEvent.click(screen.getByRole("button", { name: "Excluir Estudar Spring Boot" }));

    expect(onDelete).toHaveBeenCalledWith(task);
  });
});
