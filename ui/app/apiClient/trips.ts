import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "./clientUtils";

export async function getAllTrips() {
  return await apiRequest("/trips");
}

async function getTrip(id: Number) {
  return await apiRequest(`/trips/${id}`);
}

export function useDeleteTrip() {
  return useMutation({
    mutationFn: (id: number) => {
      return apiRequest(`/trips/${id}`, {
        method: "DELETE",
        body: JSON.stringify({}),
      });
    },
    onSuccess: (data) => {
      const trip = data.trip;

      queryClient.invalidateQueries({
        queryKey: [`trip:${trip.id}`],
      });
    },
  });
}

export function useCreateTrip() {
  return useMutation({
    mutationFn: (trip: {
      name: string;
      description: string;
      startDate: Date;
      guestEmails: string[];
    }) => {
      return apiRequest(`/trips`, {
        method: "POST",
        body: JSON.stringify(trip),
      });
    },
    onSuccess: (data) => {
      const trip = data.trip;

      queryClient.invalidateQueries({
        queryKey: [`trip:${trip.id}`],
      });
    },
    // onError: (err) => {
    //   console.error(err);
    // },
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

export function useGetTrip(tripId: Number) {
  return useQuery({
    retry: false,
    queryKey: [`trip:${tripId}`],
    queryFn: async () => {
      return getTrip(tripId);
    },
  });
}

export function useUpdateTrip(
  onSettled: (data, error, variables, context) => void = () => {}
) {
  return useMutation({
    mutationFn: (trip: {
      id: number;
      name?: string;
      description?: string;
      startDate?: Date;
      guestEmails?: string[];
    }) => {
      return apiRequest(`/trips/${trip.id}`, {
        method: "PATCH",
        body: JSON.stringify(trip),
      });
    },
    onSuccess: (data) => {
      const trip = data.trip;

      queryClient.invalidateQueries({
        queryKey: [`trip:${trip.id}`],
      });
    },
    onSettled: onSettled,
    // onError: (err) => {
    //   console.error(err);
    // },
  });
}
