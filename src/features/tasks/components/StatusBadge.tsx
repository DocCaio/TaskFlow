import { STATUS_LABEL } from "../status";
import type { TaskStatus } from "../types";

const STYLES: Record<TaskStatus, string> = {
  TODO: "border-laranja text-laranja",
  DOING: "border-roxo text-roxo",
  DONE: "border-verde text-verde",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
