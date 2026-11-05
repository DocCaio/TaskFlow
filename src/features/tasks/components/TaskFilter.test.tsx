import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useTaskFilterStore } from "../store";
import { TaskFilter } from "./TaskFilter";

describe("TaskFilter", () => {
  beforeEach(() => {
    useTaskFilterStore.getState().reset();
  });

  it("marca 'Todas' por padrão", () => {
    render(<TaskFilter />);

    expect(screen.getByRole("button", { name: "Todas" })).toHaveAttribute("aria-pressed", "true");
  });

  it("atualiza o status no store ao clicar", async () => {
    render(<TaskFilter />);

    await userEvent.click(screen.getByRole("button", { name: "Concluídas" }));

    expect(useTaskFilterStore.getState().status).toBe("DONE");
    expect(screen.getByRole("button", { name: "Concluídas" })).toHaveAttribute("aria-pressed", "true");
  });

  it("atualiza a busca no store ao digitar", async () => {
    render(<TaskFilter />);

    await userEvent.type(screen.getByLabelText("Buscar tarefas"), "react");

    expect(useTaskFilterStore.getState().search).toBe("react");
  });
});
