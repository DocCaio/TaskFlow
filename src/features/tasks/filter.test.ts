import { makeTask } from "../../test/fixtures";
import { filterTasks } from "./filter";

const tasks = [
  makeTask({ id: 1, title: "Estudar React", description: null, status: "TODO" }),
  makeTask({ id: 2, title: "Configurar CI", description: "GitHub Actions", status: "DOING" }),
  makeTask({ id: 3, title: "Escrever testes", description: "Vitest", status: "DONE" }),
];

describe("filterTasks", () => {
  it("retorna tudo sem filtros", () => {
    expect(filterTasks(tasks, "ALL", "")).toHaveLength(3);
  });

  it("filtra por status", () => {
    expect(filterTasks(tasks, "DONE", "").map((t) => t.id)).toEqual([3]);
  });

  it("busca no título sem diferenciar maiúsculas", () => {
    expect(filterTasks(tasks, "ALL", "react").map((t) => t.id)).toEqual([1]);
  });

  it("busca na descrição", () => {
    expect(filterTasks(tasks, "ALL", "actions").map((t) => t.id)).toEqual([2]);
  });

  it("combina status e busca", () => {
    expect(filterTasks(tasks, "TODO", "ci")).toEqual([]);
  });

  it("ignora espaços ao redor da busca", () => {
    expect(filterTasks(tasks, "ALL", "  vitest  ").map((t) => t.id)).toEqual([3]);
  });
});
