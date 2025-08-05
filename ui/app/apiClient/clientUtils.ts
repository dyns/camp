import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

function getApiBaseUrl() {
  return window.ENV.PUBLIC_API_URL;
}
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
  const requestUrl = `${getApiBaseUrl()}${path}`;

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
