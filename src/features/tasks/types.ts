export type TaskStatus = "TODO" | "DOING" | "DONE";

export type StatusFilter = TaskStatus | "ALL";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: string;
}

export interface TaskInput {
  title: string;
  description?: string | null;
  status?: TaskStatus;
}
