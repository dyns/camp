import { useNavigate } from "react-router";

import { useCreateTrip } from "../apiClient/trips";
import { TripDetailsForm } from "../components/TripDetailsForm";

export default function CreateTrip() {
  const createTrip = useCreateTrip();
  const navigate = useNavigate();

  const handleSaveTrip = async (tripData) => {
    console.log("create new trip", tripData);
    const data = await createTrip.mutateAsync(tripData);
    navigate(`/trips/${data.trip.id}`);
  };

  return <TripDetailsForm onSubmit={handleSaveTrip} trip={null} />;
}
