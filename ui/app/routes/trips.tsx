import { useGetAllTrips } from "../apiClient/client";
import { Link } from "react-router";

export default function Trips() {
  const { isPending, isError, data, error } = useGetAllTrips();
  const trips = data?.trips || [];

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Your Trips</h1>
      <ul className="space-y-3">
        {trips.map((trip) => (
          <li key={trip.id}>
            <Link
              to={`/trips/${trip.id}`}
              className="flex items-center justify-between bg-white rounded-lg shadow p-4 hover:bg-blue-50 transition-colors border border-gray-200"
            >
              <div className="flex items-center gap-3">
                {/* if user is an owner in this trip add a crown */}
                <span className="text-yellow-500 text-xl" title="Trip Owner">
                  {/* Crown icon placeholder */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    className="w-5 h-5 mr-1 inline-block"
                  >
                    <path d="M2.166 6.5l2.97 7.11a1 1 0 00.92.64h7.888a1 1 0 00.92-.64l2.97-7.11a.5.5 0 00-.77-.57l-3.6 2.7a1 1 0 01-1.2 0l-2.1-1.58a1 1 0 00-1.2 0l-2.1 1.58a1 1 0 01-1.2 0l-3.6-2.7a.5.5 0 00-.77.57z" />
                    <path d="M4 16a2 2 0 002 2h8a2 2 0 002-2v-1H4v1z" />
                  </svg>
                </span>
                <span className="font-semibold text-lg truncate">
                  {trip.name}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {/* Placeholder for trip start date */}
                <span>Start: TBD</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
