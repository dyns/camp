import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

const API_BASE_URL = import.meta.env.VITE_CAMP_API_DOMAIN;

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

export async function apiRequest(path: string, options = {}, headers = {}) {
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

  if (!res.ok) {
    const message =
      typeof data === "string" ? data : data.error || "Unknown error";
    console.error("Error fetching data:", message);
    const error = new APIError(message, res.status, data);
    throw error;
  }

  return data;
}
