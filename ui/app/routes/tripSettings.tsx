import { useState } from "react";
import { useParams } from "react-router";

import { useGetTrip, useUpdateTrip } from "../apiClient/trips";
import { getUserByEmail } from "../apiClient/user";

import { TripDetailsForm } from "../components/TripDetailsForm";

export default function TripSettings() {
  const { id: idParam } = useParams();

  const tripId = Number(idParam);

  if (Number.isNaN(tripId)) {
    return "Error";
  }

  const { data, isLoading, error } = useGetTrip(tripId);

  if (isLoading) {
    return "loading";
  } else if (error) {
    return `error: ${error.message}`;
  }

  console.log("trip settings data", { data });
  return (
    <div>
      <UpdateTripForm trip={data.trip} />
    </div>
  );
}

function UpdateTripForm({ trip }) {
  const updateTrip = useUpdateTrip();

  const onTripSubmit = (tripForm) => {
    updateTrip.mutate({ ...tripForm, id: trip.id });
  };

  return <TripDetailsForm trip={trip} onSubmit={onTripSubmit} />;
}
