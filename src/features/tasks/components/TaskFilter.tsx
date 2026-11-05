import { useTaskFilterStore, type TaskFilterState } from "../store";
import type { StatusFilter } from "../types";

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "Todas" },
  { value: "TODO", label: "A fazer" },
  { value: "DOING", label: "Em andamento" },
  { value: "DONE", label: "Concluídas" },
];

export function TaskFilter() {
  const status = useTaskFilterStore((state: TaskFilterState) => state.status);
  const search = useTaskFilterStore((state: TaskFilterState) => state.search);
  const setStatus = useTaskFilterStore((state: TaskFilterState) => state.setStatus);
  const setSearch = useTaskFilterStore((state: TaskFilterState) => state.setSearch);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <label htmlFor="task-search" className="sr-only">
          Buscar tarefas
        </label>
        <input
          id="task-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar tarefas..."
          className="w-full rounded-md border border-borda bg-superficie px-3 py-2 text-sm text-texto placeholder:text-texto/40 sm:w-64"
        />
      </div>

      <div role="group" aria-label="Filtrar por status" className="flex flex-wrap gap-2">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={status === value}
            onClick={() => setStatus(value)}
            className={`rounded-full border px-3 py-1 text-sm transition ${
              status === value
                ? "border-verde bg-verde/10 text-verde"
                : "border-borda text-texto hover:border-laranja hover:text-laranja"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}