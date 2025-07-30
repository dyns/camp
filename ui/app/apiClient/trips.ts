import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "./clientUtils";

export async function getAllTrips() {
  return await apiRequest("/trips");
}

async function getTrip(id: Number) {
  return await apiRequest(`/trips/${id}`);
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

export function useGetTrip(tripId: Number) {
  return useQuery({
    retry: false,
    queryKey: [`trip:${tripId}`],
    queryFn: async () => {
      return getTrip(tripId);
    },
  });
}
