import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { buttonStyles } from "../../../components/ui/buttonStyles";
import { STATUS_LABEL, TASK_STATUSES } from "../status";
import type { Task, TaskStatus } from "../types";
import { StatusBadge } from "./StatusBadge";

interface TaskCardProps {
  task: Task;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  onDelete: (task: Task) => void;
  disabled?: boolean;
}

export function TaskCard({ task, onStatusChange, onDelete, disabled = false }: TaskCardProps) {
  const createdAt = new Date(task.createdAt).toLocaleDateString("pt-BR");

  return (
    <article className="rounded-lg border border-borda bg-superficie p-4">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-texto">{task.title}</h2>
        <StatusBadge status={task.status} />
      </div>

      {task.description && (
        <p className="mt-2 text-sm whitespace-pre-line text-texto/70">{task.description}</p>
      )}

      <p className="mt-3 text-xs text-texto/50">Criada em {createdAt}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <select
          aria-label={`Alterar status de ${task.title}`}
          value={task.status}
          disabled={disabled}
          onChange={(event) => onStatusChange(task, event.target.value as TaskStatus)}
          className="rounded-md border border-borda bg-fundo px-2 py-2 text-sm text-texto disabled:opacity-50"
        >
          {TASK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABEL[status]}
            </option>
          ))}
        </select>

        <Link
          to={`/tarefas/${task.id}/editar`}
          aria-label={`Editar ${task.title}`}
          className={buttonStyles("secondary")}
        >
          Editar
        </Link>

        <Button
          variant="danger"
          aria-label={`Excluir ${task.title}`}
          disabled={disabled}
          onClick={() => onDelete(task)}
        >
          Excluir
        </Button>
      </div>
    </article>
  );
}
