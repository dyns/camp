import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "./clientUtils";

export function useCreateTask(
  onSettled: (data, error, variables, context) => void = () => {}
) {
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
    onSettled: onSettled,
    // onError: (err) => {
    //   console.error(err);
    // },
  });
}

export function useUpdateTask(
  onSettled: (data, error, variables, context) => void = () => {}
) {
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
    onSettled: onSettled,
    // onError: (err) => {
    //   console.error(err);
    // },
  });
}

export function useDeleteTask(
  onSettled: (data, error, variables, context) => void = () => {}
) {
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
    onSettled: onSettled,
    // onError: (err) => {
    //   console.error(err);
    // },
  });
}
