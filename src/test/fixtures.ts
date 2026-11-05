import type { Task } from "../features/tasks/types";

export function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 1,
    title: "Estudar Spring Boot",
    description: "Fazer o CRUD completo",
    status: "TODO",
    createdAt: "2026-11-04T18:30:00Z",
    ...overrides,
  };
}
