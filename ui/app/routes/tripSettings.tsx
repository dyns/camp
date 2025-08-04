import { useState } from "react";
import { useParams, useNavigate } from "react-router";

import { useGetTrip, useUpdateTrip, useDeleteTrip } from "../apiClient/trips";

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

  return (
    <div>
      <TripDetailsForm trip={trip} onSubmit={onTripSubmit} />
      <DeleteTripFooter tripId={trip.id} />
    </div>
  );
}

function DeleteTripFooter({ tripId }: { tripId: number }) {
  const deleteTrip = useDeleteTrip();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const navigate = useNavigate();

  const handleDeleteTrip = async () => {
    deleteTrip.mutate(tripId, {
      onSuccess: () => {
        navigate("/trips");
      },
    });
  };

  return (
    <div className="bg-white border border-black p-6 w-full max-w-lg mx-auto flex flex-col gap-6">
      {showConfirmDelete ? (
        <button
          onClick={handleDeleteTrip}
          className="px-4 py-2 bg-black text-white font-bold font-mono border border-black rounded shadow hover:bg-gray-800 active:bg-gray-900 transition-colors"
          style={{ boxShadow: "2px 2px 0 #222", borderRadius: "0.25rem" }}
        >
          Confirm really delete trip
        </button>
      ) : null}
      <button
        onClick={() => {
          setShowConfirmDelete(true);
        }}
        className="px-4 py-2 bg-red-600 text-white font-bold font-mono border border-black rounded shadow hover:bg-red-700 active:bg-red-800 transition-colors"
        style={{ boxShadow: "2px 2px 0 #222", borderRadius: "0.25rem" }}
      >
        Delete Trip
      </button>
    </div>
  );
}
