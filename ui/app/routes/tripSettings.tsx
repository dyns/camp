import { useState } from "react";
import { useParams, useNavigate } from "react-router";

import { useGetTrip, useUpdateTrip, useDeleteTrip } from "../apiClient/trips";
import { useCurrentUser } from "../apiClient/user";

import { TripDetailsForm } from "../components/TripDetailsForm";
import type { TripForm } from "../components/TripDetailsForm";

import type { TripResponse, User } from "../types";

export default function TripSettings() {
  const { data: userResponse, isLoading: isUserLoading } = useCurrentUser();
  const user = userResponse?.user;

  const { id: idParam } = useParams();

  const tripId = Number(idParam);

  if (Number.isNaN(tripId)) {
    return "Error";
  }

  const { data, isLoading: isTripLoading, error } = useGetTrip(tripId);

  if (isTripLoading || isUserLoading) {
    return "loading";
  } else if (error) {
    return `error: ${error.message}`;
  } else if (data === undefined || user === undefined) {
    return "Error: Unable to load Trip Settings";
  }

  return (
    <div>
      <UpdateTripForm trip={data.trip} user={user} />
    </div>
  );
}

function UpdateTripForm({ trip, user }: { trip: TripResponse; user: User }) {
  const updateTrip = useUpdateTrip();
  const navigate = useNavigate();

  const isUserOwner = trip.owners.some((owner) => owner.email === user.email);

  const onTripSubmit = (tripForm: TripForm) => {
    updateTrip.mutate({ ...tripForm, id: trip.id });
    navigate(`/trips/${trip.id}`);
  };

  return (
    <div>
      <TripDetailsForm trip={trip} onSubmit={onTripSubmit} />
      {isUserOwner && <DeleteTripFooter tripId={trip.id} />}
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
