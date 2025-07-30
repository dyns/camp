import { useState } from "react";
import { useNavigate, useLocation } from "react-router";

import { useCreateCategory } from "../apiClient/categories";
import { useGetAllTrips } from "../apiClient/trips";

type CategoryData = {
  name: string;
  tripId: number | null;
  description?: string;
};

export default function CreateCategory() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const defaultTripId = Number.parseInt(searchParams.get("tripId")) || null;

  const mutateCategory = useCreateCategory();

  const [formData, setFormData] = useState<CategoryData>({
    name: "",
    description: "",
    tripId: defaultTripId,
  });
  const { data, isLoading, error } = useGetAllTrips();

  if (isLoading) {
    return "Loading";
  }

  if (error) {
    return "Error";
  }

  const trips = data.trips;

  const handleOnSubmit = (event) => {
    event.preventDefault();
    console.log("form data:", { formData });

    if (formData.tripId == null) {
      return;
    }

    mutateCategory.mutate(
      {
        name: formData.name,
        description: formData.description,
        tripId: formData.tripId,
      },
      {
        onSuccess: () => {
          navigate(`/trips/${formData?.tripId}`);
        },
      }
    );
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    console.log("form change", { name: e.target.name, value: e.target.value });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  console.log({ formData });
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <form
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6"
        onSubmit={handleOnSubmit}
      >
        <h2 className="text-2xl font-bold text-center mb-4">Create Category</h2>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="categoryName">
            Name
          </label>
          <input
            id="nameField"
            name="name"
            type="text"
            required
            className="input input-bordered w-full"
            placeholder="Enter category name"
            onChange={handleFormChange}
            value={formData.name}
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="tripSelect">
            Trip
          </label>
          <select
            id="tripSelect"
            name="tripId"
            className="select select-bordered w-full"
            value={formData.tripId != null ? formData.tripId : ""}
            required
            onChange={handleFormChange}
          >
            <option value="" disabled>
              Select a trip
            </option>
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="categoryDesc">
            Description
          </label>
          <textarea
            id="categoryDesc"
            name="description"
            rows={4}
            required={false}
            className="textarea textarea-bordered w-full"
            placeholder="Describe this category..."
            onChange={handleFormChange}
            value={formData.description}
          />
        </div>
        {/* <div>
          <label className="block mb-1 font-semibold" htmlFor="categoryImg">
            Image (optional)
          </label>
          <input
            id="categoryImg"
            name="categoryImg"
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
          />
        </div> */}
        <button type="submit" className="btn btn-primary w-full mt-4">
          Create Category
        </button>
      </form>
    </div>
  );
}
