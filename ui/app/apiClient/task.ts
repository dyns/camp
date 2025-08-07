import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "./clientUtils";

export function useCreateTask() {
  return useMutation({
    mutationFn: (task: { name: string; categoryId: number }) => {
      return apiRequest(`/tasks`, {
        method: "POST",
        body: JSON.stringify(task),
      });
    },
    onSuccess: (data) => {
      const task = data.task;

      queryClient.invalidateQueries({
        queryKey: [`trip:${task.category.tripId}`],
      });

      queryClient.invalidateQueries({
        queryKey: [`category:${task.categoryId}`],
      });
    },
  });
}

export function useUpdateTask() {
  return useMutation({
    mutationFn: (task: { id: number; complete?: boolean; name?: string }) => {
      return apiRequest(`/tasks/${task.id}`, {
        method: "PATCH",
        body: JSON.stringify(task),
      });
    },
    onSuccess: (data) => {
      const task = data.task;

      queryClient.invalidateQueries({
        queryKey: [`trip:${task.category.tripId}`],
      });

      queryClient.invalidateQueries({
        queryKey: [`category:${task.categoryId}`],
      });
    },
  });
}

export function useDeleteTask() {
  return useMutation({
    mutationFn: (id: number) => {
      return apiRequest(`/tasks/${id}`, {
        method: "DELETE",
        body: "{}",
      });
    },
    onSuccess: (data) => {
      const task = data.task;

      queryClient.invalidateQueries({
        queryKey: [`trip:${task.category.tripId}`],
      });

      queryClient.invalidateQueries({
        queryKey: [`category:${task.categoryId}`],
      });
    },
  });
}
