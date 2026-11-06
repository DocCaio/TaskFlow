import { useMemo } from "react";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../../api/http";
import { Button } from "../ui/Button";
import { buttonStyles } from "../ui/buttonStyles";
import { useToast } from "../../context/toast-context";
import { QuickAddTask } from "../../features/tasks/components/QuickAddTask";
import { TaskCard } from "../../features/tasks/components/TaskCard";
import { TaskFilter } from "../../features/tasks/components/TaskFilter";
import { filterTasks } from "../../features/tasks/filter";
import { useDeleteTask, useTasks, useUpdateTask } from "../../features/tasks/hooks";
import { useTaskFilterStore } from "../../features/tasks/store";
import type { Task, TaskStatus } from "../../features/tasks/types";

export function Home() {
  const { data, isPending, isError, error, refetch } = useTasks();
  const status = useTaskFilterStore((state) => state.status);
  const search = useTaskFilterStore((state) => state.search);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const toast = useToast();

  const tasks = useMemo(() => data ?? [], [data]);
  const visibleTasks = useMemo(() => filterTasks(tasks, status, search), [tasks, status, search]);
  const busy = updateTask.isPending || deleteTask.isPending;

  function handleStatusChange(task: Task, newStatus: TaskStatus) {
    updateTask.mutate(
      {
        id: task.id,
        input: { title: task.title, description: task.description, status: newStatus },
      },
      {
        onSuccess: () => toast.show("Status atualizado"),
        onError: (err) => toast.show(getErrorMessage(err), "error"),
      },
    );
  }

  function handleDelete(task: Task) {
    if (!window.confirm(`Excluir a tarefa "${task.title}"?`)) return;

    deleteTask.mutate(task.id, {
      onSuccess: () => toast.show("Tarefa excluída"),
      onError: (err) => toast.show(getErrorMessage(err), "error"),
    });
  }

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-laranja">Minhas tarefas</h1>
          {data && (
            <p className="mt-1 text-sm text-texto/60">
              {data.length} {data.length === 1 ? "tarefa" : "tarefas"} no total
            </p>
          )}
        </div>
        <Link to="/postar" className={buttonStyles("primary")}>
          Nova tarefa
        </Link>
      </header>

      <QuickAddTask />

      <TaskFilter />

      {isPending && <p className="text-texto/70">Carregando tarefas...</p>}

      {isError && (
        <div role="alert" className="rounded-lg border border-perigo bg-superficie p-4">
          <p className="text-perigo">{getErrorMessage(error)}</p>
          <Button variant="secondary" className="mt-3" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        </div>
      )}

      {data && tasks.length === 0 && (
        <p className="rounded-lg border border-dashed border-borda p-6 text-center text-texto/70">
          Nenhuma tarefa ainda.{" "}
          <Link to="/postar" className="text-verde underline">
            Crie a primeira!
          </Link>
        </p>
      )}

      {data && tasks.length > 0 && visibleTasks.length === 0 && (
        <p className="rounded-lg border border-dashed border-borda p-6 text-center text-texto/70">
          Nenhuma tarefa encontrada com esses filtros.
        </p>
      )}

      {visibleTasks.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {visibleTasks.map((task) => (
            <li key={task.id}>
              <TaskCard
                task={task}
                disabled={busy}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
