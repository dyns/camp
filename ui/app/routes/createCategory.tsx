import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router";

import { useCreateCategory } from "../apiClient/categories";
import { useGetTrip } from "../apiClient/trips";

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

  if (defaultTripId === null) {
    return "No trip selected";
  }

  const { data, isLoading, error } = useGetTrip(defaultTripId);

  if (isLoading || data === undefined) {
    return "Loading";
  }

  if (error) {
    return "Error";
  }

  const trip = data.trip;

  const handleOnSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (formData.tripId == null) {
      return;
    }

    mutateCategory.mutate(
      {
        name: formData.name,
        description: formData.description,
        tripId: trip.id,
      },
      {
        onSuccess: () => {
          navigate(`/trips/${trip.id}`);
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
        <label className="input-label" htmlFor="tripSelect">
          Trip: {trip.name}
        </label>
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
