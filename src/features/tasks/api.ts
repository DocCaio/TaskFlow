import { request } from "../../api/http";
import type { Task, TaskInput } from "./types";

export function listTasks() {
  return request<Task[]>("/tasks");
}

export function getTask(id: number) {
  return request<Task>(`/tasks/${id}`);
}

export function createTask(input: TaskInput) {
  return request<Task>("/tasks", { method: "POST", body: JSON.stringify(input) });
}

export function updateTask(id: number, input: TaskInput) {
  return request<Task>(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(input) });
}

export function deleteTask(id: number) {
  return request<void>(`/tasks/${id}`, { method: "DELETE" });
}
