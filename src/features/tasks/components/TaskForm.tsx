import { useState, type FormEvent } from "react";
import { Button } from "../../../components/ui/Button";
import { STATUS_LABEL, TASK_STATUSES } from "../status";
import type { TaskInput, TaskStatus } from "../types";
import { DESCRIPTION_MAX, TITLE_MAX, validateTask } from "../validation";

interface TaskFormProps {
  initialValues?: TaskInput;
  submitLabel: string;
  isSubmitting?: boolean;
  serverErrors?: Record<string, string>;
  onSubmit: (input: TaskInput) => void;
}

const FIELD =
  "w-full rounded-md border bg-fundo px-3 py-2 text-sm text-texto placeholder:text-texto/40";

export function TaskForm({
  initialValues,
  submitLabel,
  isSubmitting = false,
  serverErrors = {},
  onSubmit,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(initialValues?.status ?? "TODO");
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const errors = { ...serverErrors, ...clientErrors };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validateTask({ title, description });
    setClientErrors(found);
    if (Object.keys(found).length > 0) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      status,
    });
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-lg border border-borda bg-superficie p-5"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="task-title" className="text-sm font-medium">
          Título
        </label>
        <input
          id="task-title"
          value={title}
          maxLength={TITLE_MAX + 20}
          onChange={(event) => setTitle(event.target.value)}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "task-title-error" : undefined}
          placeholder="Ex.: Estudar TanStack Query"
          className={`${FIELD} ${errors.title ? "border-perigo" : "border-borda"}`}
        />
        {errors.title && (
          <p id="task-title-error" role="alert" className="text-sm text-perigo">
            {errors.title}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="task-description" className="text-sm font-medium">
          Descrição
        </label>
        <textarea
          id="task-description"
          rows={4}
          value={description}
          maxLength={DESCRIPTION_MAX + 50}
          onChange={(event) => setDescription(event.target.value)}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? "task-description-error" : undefined}
          placeholder="Detalhes da tarefa (opcional)"
          className={`${FIELD} ${errors.description ? "border-perigo" : "border-borda"}`}
        />
        {errors.description && (
          <p id="task-description-error" role="alert" className="text-sm text-perigo">
            {errors.description}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="task-status" className="text-sm font-medium">
          Status
        </label>
        <select
          id="task-status"
          value={status}
          onChange={(event) => setStatus(event.target.value as TaskStatus)}
          className={`${FIELD} border-borda`}
        >
          {TASK_STATUSES.map((value) => (
            <option key={value} value={value}>
              {STATUS_LABEL[value]}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Salvando..." : submitLabel}
      </Button>
    </form>
  );
}
