import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "./clientUtils";

export function useGetCategory(id: number) {
  return useQuery({
    retry: false,
    queryKey: [`category:${id}`],
    queryFn: async () => {
      return apiRequest(`/categories/${id}`);
    },
  });
}

export function useCreateCategory() {
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
  });
}

export function useUpdateCategory() {
  return useMutation({
    mutationFn: (category: {
      id: number;
      name?: string;
      description?: string;
    }) => {
      return apiRequest(`/categories/${category.id}`, {
        method: "PATCH",
        body: JSON.stringify(category),
      });
    },
    onSuccess: (data) => {
      const category = data.category;

      queryClient.invalidateQueries({
        queryKey: [`category:${category.id}`],
      });
    },
  });
}
