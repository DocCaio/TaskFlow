import { useNavigate } from "react-router-dom";
import { ApiError, getErrorMessage } from "../api/http";
import { useToast } from "../context/toast-context";
import { TaskForm } from "../features/tasks/components/TaskForm";
import { useCreateTask } from "../features/tasks/hooks";

export function Postar() {
  const navigate = useNavigate();
  const toast = useToast();
  const createTask = useCreateTask();

  return (
    <section className="mx-auto flex max-w-xl flex-col gap-6">
      <h1 className="text-3xl font-bold text-laranja">Postar nova tarefa</h1>

      <TaskForm
        submitLabel="Criar tarefa"
        isSubmitting={createTask.isPending}
        serverErrors={createTask.error instanceof ApiError ? createTask.error.fieldErrors : undefined}
        onSubmit={(input) =>
          createTask.mutate(input, {
            onSuccess: () => {
              toast.show("Tarefa criada com sucesso");
              navigate("/");
            },
            onError: (err) => toast.show(getErrorMessage(err), "error"),
          })
        }
      />
    </section>
  );
}