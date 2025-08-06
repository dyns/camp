import { useQuery, useMutation } from "@tanstack/react-query";

import { apiRequest, queryClient } from "./clientUtils";

export async function getCurrentUser(requestOptions = {}, headers = {}) {
  return await apiRequest("/users/me", requestOptions, headers);
}

export async function getUserByEmail(email: string) {
  return await apiRequest("/users/search", {
    method: "POST",
    body: JSON.stringify({ email: email }),
  });
}

export async function signOut() {
  return await apiRequest("/auth/signout", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export function useSignInUser(
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
  });
}

export function useCurrentUser() {
  return useQuery({
    retry: false,
    queryKey: ["me"],
    queryFn: async () => {
      return getCurrentUser();
    },
  });
}

export function useUpdateCurrentUser() {
  return useMutation({
    mutationFn: (data: { email?: string; name?: string }) => {
      return apiRequest("/users/me", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      // After login, optimistically update cached user data
      queryClient.setQueryData(["me"], data);
    },
  });
}

export function useCreateUser() {
  return useMutation({
    mutationFn: (data: { email: string; name: string; password: string }) => {
      return apiRequest("/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], data.user);
    },
  });
}
