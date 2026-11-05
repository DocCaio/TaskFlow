import type { StatusFilter, Task } from "./types";

export function filterTasks(tasks: Task[], status: StatusFilter, search: string): Task[] {
  const term = search.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchesStatus = status === "ALL" || task.status === status;
    const matchesSearch =
      term === "" ||
      task.title.toLowerCase().includes(term) ||
      (task.description ?? "").toLowerCase().includes(term);

    return matchesStatus && matchesSearch;
  });
}
