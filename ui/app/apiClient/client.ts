import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();
export { queryClient };

const API_BASE_URL = "http://localhost:3000";

export class APIError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "APIError";
  }
}

async function apiRequest(path: string, options = {}, headers = {}) {
  const requestUrl = `${API_BASE_URL}${path}`;

  const res = await fetch(requestUrl, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...options,
  });

  const contentType = res.headers.get("Content-Type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  console.log({ res, data });

  if (!res.ok) {
    const message =
      typeof data === "string" ? data : data.error || "Unknown error";
    console.error("Error fetching data:", message);
    const error = new APIError(message, res.status, data);
    throw error;
  }

  return data;
}

export async function getAllTrips() {
  return await apiRequest("/trips");
}

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

export function useGetAllTrips() {
  return useQuery({
    retry: false,
    queryKey: ["trips"],
    queryFn: async () => {
      return getAllTrips();
    },
  });
}
