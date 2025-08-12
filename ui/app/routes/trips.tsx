import { useGetAllTrips } from "../apiClient/trips";
import { Link } from "react-router";

import type { Trip } from "../types";

import { PageContent } from "../components/PageContent";

export default function Trips() {
  const { isPending, isError, data, error } = useGetAllTrips();
  const trips: Trip[] = data?.trips || [];

  return (
    <PageContent>
      <div className="flex items-center justify-between mb-6">
        <span className="page-title">Your Trips</span>
        <Link
          to={"/create-trip"}
          className="px-4 py-2 border border-black bg-green-200 hover:bg-green-300 text-black font-bold rounded-lg shadow-[2px_2px_0_#222] transition-colors"
        >
          Start a new trip
        </Link>
      </div>
      <ul className="space-y-3">
        {trips.map((trip) => {
          const date = new Date(trip.startDate);
          const formattedDate = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          return (
            <li key={trip.id}>
              <Link
                to={`/trips/${trip.id}`}
                className="flex items-center justify-between bg-white rounded-lg border border-black p-4 shadow-[2px_2px_0_#222] hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-lg truncate">
                    {trip.name}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  <span>Start: {formattedDate}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </PageContent>
  );
}
