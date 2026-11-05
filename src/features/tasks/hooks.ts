import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, deleteTask, getTask, listTasks, updateTask } from "./api";
import type { TaskInput } from "./types";

export const taskKeys = {
  all: ["tasks"] as const,
  list: () => [...taskKeys.all, "list"] as const,
  detail: (id: number) => [...taskKeys.all, "detail", id] as const,
};

export function useTasks() {
  return useQuery({ queryKey: taskKeys.list(), queryFn: listTasks });
}

export function useTask(id: number, enabled = true) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => getTask(id),
    enabled,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TaskInput) => createTask(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: TaskInput }) => updateTask(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
}
