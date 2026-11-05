import type { TaskStatus } from "./types";

export const TASK_STATUSES: TaskStatus[] = ["TODO", "DOING", "DONE"];

export const STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: "A fazer",
  DOING: "Em andamento",
  DONE: "Concluída",
};
