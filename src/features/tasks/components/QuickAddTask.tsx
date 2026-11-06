import { useState, type FormEvent } from "react";
import { getErrorMessage } from "../../../api/http";
import { Button } from "../../../components/ui/Button";
import { useToast } from "../../../context/toast-context";
import { useCreateTask } from "../hooks";
import { validateTask } from "../validation";

export function QuickAddTask() {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const createTask = useCreateTask();
  const toast = useToast();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validateTask({ title, description: "" });
    if (errors.title) {
      setError(errors.title);
      return;
    }
    setError(null);

    createTask.mutate(
      { title: title.trim() },
      {
        onSuccess: () => {
          setTitle("");
          toast.show("Tarefa adicionada");
        },
        onError: (err) => toast.show(getErrorMessage(err), "error"),
      },
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <label htmlFor="quick-add-title" className="sr-only">
          Título da nova tarefa
        </label>
        <input
          id="quick-add-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "quick-add-error" : undefined}
          placeholder="O que precisa ser feito?"
          className={`w-full rounded-md border bg-superficie px-3 py-2 text-sm text-texto placeholder:text-texto/40 ${
            error ? "border-perigo" : "border-borda"
          }`}
        />
        <Button type="submit" disabled={createTask.isPending}>
          Adicionar
        </Button>
      </div>
      {error && (
        <p id="quick-add-error" role="alert" className="text-sm text-perigo">
          {error}
        </p>
      )}
    </form>
  );
}
