import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskForm } from "./TaskForm";

describe("TaskForm", () => {
  it("bloqueia o envio sem título", async () => {
    const onSubmit = vi.fn();
    render(<TaskForm submitLabel="Criar" onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole("button", { name: "Criar" }));

    expect(screen.getByRole("alert")).toHaveTextContent("O título é obrigatório");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("envia os valores tratados", async () => {
    const onSubmit = vi.fn();
    render(<TaskForm submitLabel="Criar" onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Título"), "  Nova tarefa  ");
    await userEvent.type(screen.getByLabelText("Descrição"), "Detalhes");
    await userEvent.selectOptions(screen.getByLabelText("Status"), "DOING");
    await userEvent.click(screen.getByRole("button", { name: "Criar" }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: "Nova tarefa",
      description: "Detalhes",
      status: "DOING",
    });
  });

  it("envia descrição nula quando ela fica vazia", async () => {
    const onSubmit = vi.fn();
    render(<TaskForm submitLabel="Criar" onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Título"), "Só título");
    await userEvent.click(screen.getByRole("button", { name: "Criar" }));

    expect(onSubmit).toHaveBeenCalledWith({ title: "Só título", description: null, status: "TODO" });
  });

  it("preenche os campos com os valores iniciais", () => {
    render(
      <TaskForm
        submitLabel="Salvar"
        initialValues={{ title: "Antiga", description: "Desc", status: "DONE" }}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Título")).toHaveValue("Antiga");
    expect(screen.getByLabelText("Descrição")).toHaveValue("Desc");
    expect(screen.getByLabelText("Status")).toHaveValue("DONE");
  });

  it("mostra os erros vindos do servidor", () => {
    render(
      <TaskForm
        submitLabel="Criar"
        serverErrors={{ title: "Título já existe" }}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Título já existe");
  });

  it("desabilita o botão enquanto envia", () => {
    render(<TaskForm submitLabel="Criar" isSubmitting onSubmit={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Salvando..." })).toBeDisabled();
  });
});
