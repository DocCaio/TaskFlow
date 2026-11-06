import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiError, getErrorMessage } from "../api/http";
import { useToast } from "../context/toast-context";
import { TaskForm } from "../features/tasks/components/TaskForm";
import { useTask, useUpdateTask } from "../features/tasks/hooks";

export function EditarTarefa() {
  const { id } = useParams();
  const taskId = Number(id);
  const invalidId = !Number.isInteger(taskId) || taskId <= 0;

  const navigate = useNavigate();
  const toast = useToast();
  const { data: task, isPending, isError, error } = useTask(taskId, !invalidId);
  const updateTask = useUpdateTask();

  return (
    <section className="mx-auto flex max-w-xl flex-col gap-6">
      <h1 className="text-3xl font-bold text-laranja">Editar tarefa</h1>

      {invalidId && <p role="alert" className="text-perigo">Tarefa inválida.</p>}

      {!invalidId && isPending && <p className="text-texto/70">Carregando tarefa...</p>}

      {!invalidId && isError && (
        <div role="alert" className="rounded-lg border border-perigo bg-superficie p-4">
          <p className="text-perigo">{getErrorMessage(error)}</p>
        </div>
      )}

      {task && (
        <TaskForm
          key={task.id}
          submitLabel="Salvar alterações"
          initialValues={{ title: task.title, description: task.description, status: task.status }}
          isSubmitting={updateTask.isPending}
          serverErrors={updateTask.error instanceof ApiError ? updateTask.error.fieldErrors : undefined}
          onSubmit={(input) =>
            updateTask.mutate(
              { id: task.id, input },
              {
                onSuccess: () => {
                  toast.show("Tarefa atualizada");
                  navigate("/");
                },
                onError: (err) => toast.show(getErrorMessage(err), "error"),
              },
            )
          }
        />
      )}

      <Link to="/" className="text-sm text-verde underline">
        Voltar para as tarefas
      </Link>
    </section>
  );
}
