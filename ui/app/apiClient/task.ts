import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "./clientUtils";

export function useMutateTask(
  onSettled: (data, error, variables, context) => void = () => {}
) {
  return useMutation({
    mutationFn: (tripUpdateFields: { id: Number; complete?: boolean }) => {
      return apiRequest(`/tasks/${tripUpdateFields.id}`, {
        method: "PATCH",
        body: JSON.stringify(tripUpdateFields),
      });
    },
    onSuccess: (data) => {
      console.log("mutate task success", `trip:${data.category.tripId}`);
      // queryClient.setQueryData([`trip:${data.category.tripId}`], data);
      queryClient.invalidateQueries({
        queryKey: [`trip:${data.category.tripId}`],
      });
    },
    onSettled: onSettled,
    // onError: (err) => {
    //   console.error(err);
    // },
  });
}
