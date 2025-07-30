import { useQuery, useMutation } from "@tanstack/react-query";

import { apiRequest, queryClient } from "./clientUtils";

export async function getCurrentUser(requestOptions = {}, headers = {}) {
  return await apiRequest("/auth/me", requestOptions, headers);
}

export function useMutateCurrentUser(
  onSettled: (data, error, variables, context) => void = () => {}
) {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return apiRequest("/auth/signin", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });
    },
    onSuccess: (data) => {
      // After login, optimistically update cached user data
      console.log("User logged in successfully:", { data });
      queryClient.setQueryData(["auth", "user"], data.user);
    },
    onSettled: onSettled,
    // onError: (err) => {
    //   console.error(err);
    // },
  });
}

export function useCurrentUser() {
  return useQuery({
    retry: false,
    queryKey: ["auth", "user", "trips"],
    queryFn: async () => {
      return getCurrentUser();
    },
  });
}
