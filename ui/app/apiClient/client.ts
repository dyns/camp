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

async function apiRequest(path: string, options = {}) {
  const requestUrl = `${API_BASE_URL}${path}`;

  console.log("Making API request to:", requestUrl, "with options:", options);

  const res = await fetch(requestUrl, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
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

export function useMutateCurrentUser() {
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
    // onError: (err) => {
    //   console.error(err);
    // },
  });
}

export function useCurrentUser() {
  return useQuery({
    retry: false,
    queryKey: ["auth", "user"],
    queryFn: async () => {
      return await apiRequest("/auth/me");
    },
  });
}
