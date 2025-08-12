import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router";

import { useCreateCategory } from "../apiClient/categories";
import { useGetAllTrips } from "../apiClient/trips";

import { PageContent } from "../components/PageContent";

import type { Trip } from "../types";

type CategoryData = {
  name: string;
  tripId: number | null;
  description?: string;
};

export default function CreateCategory() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const defaultTripId =
    Number.parseInt(searchParams.get("tripId") || "") || null;

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

  const handleOnSubmit = (event: FormEvent) => {
    event.preventDefault();

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <PageContent>
      <form onSubmit={handleOnSubmit} className="space-y-4">
        <h2 className="page-title">Create Category</h2>
        <div>
          <label className="input-label" htmlFor="categoryName">
            Name
          </label>
          <input
            id="nameField"
            name="name"
            type="text"
            required
            className="input-field"
            placeholder="Enter category name"
            onChange={handleFormChange}
            value={formData.name}
          />
        </div>
        <div>
          <label className="input-label" htmlFor="tripSelect">
            Trip
          </label>
          <select
            id="tripSelect"
            name="tripId"
            className="input-field"
            value={formData.tripId != null ? formData.tripId : ""}
            required
            onChange={handleFormChange}
          >
            <option value="" disabled>
              Select a trip
            </option>
            {trips.map((trip: Trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="input-label" htmlFor="categoryDesc">
            Description
          </label>
          <textarea
            id="categoryDesc"
            name="description"
            rows={4}
            required={false}
            className="input-field"
            placeholder="Describe this category..."
            onChange={handleFormChange}
            value={formData.description}
          />
        </div>

        <button type="submit" className="green-button">
          Create Category
        </button>
      </form>
    </PageContent>
  );
}
