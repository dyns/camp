import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "./clientUtils";

export function useCreateCategory(
  onSettled: (data, error, variables, context) => void = () => {}
) {
  return useMutation({
    mutationFn: (category: {
      name: string;
      description?: string;
      tripId: number;
    }) => {
      return apiRequest(`/categories`, {
        method: "POST",
        body: JSON.stringify(category),
      });
    },
    onSuccess: (data) => {
      const category = data.category;
      queryClient.invalidateQueries({
        queryKey: [`trip:${category.tripId}`],
      });
    },
    onSettled: onSettled,
    // onError: (err) => {
    //   console.error(err);
    // },
  });
}
