import { useState } from "react";
import { useParams } from "react-router";

import { useGetTrip, useUpdateTrip } from "../apiClient/trips";
import { getUserByEmail } from "../apiClient/user";

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

  // const date = new Date(trip.startDate);

  // const [tripName, setTripName] = useState<string>(trip.name);
  // const [description, setDescription] = useState<string>(trip.description);
  // const [startDate, setStartDate] = useState<string>(
  //   date.toISOString().split("T")[0]
  // );
  // const [inviteEmail, setInviteEmail] = useState<string>("");
  // const [invited, setInvited] = useState<string[]>(
  //   trip.guests.map((guest) => {
  //     return guest.email;
  //   })
  // );

  // const [updateInviteStatus, setUpdateInviteStatus] = useState("");
  // const [saveStatus, setSaveStatus] = useState("");

  // const handleInvite = async (
  //   e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  // ) => {
  //   e.preventDefault();
  //   setUpdateInviteStatus("");

  //   const email = inviteEmail.trim();
  //   if (email && !invited.includes(email)) {
  //     // check that a user with that email exists

  //     let user = null;

  //     try {
  //       user = (await getUserByEmail(email)).user;
  //       console.log("found user:", user);
  //     } catch (e) {
  //       console.log("error finding user:", e);
  //     }

  //     if (user) {
  //       setInvited([...invited, email]);
  //       setInviteEmail("");
  //       setUpdateInviteStatus("");
  //     } else {
  //       setUpdateInviteStatus(`User not found with email: ${email}`);
  //     }
  //   }
  // };

  // const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setSaveStatus("");
  //   // check that fields are valid
  //   const formattedTripName = tripName.trim();
  //   const formattedDescription = description.trim();
  //   const formattedDate = new Date(startDate).toISOString();

  //   if (formattedTripName) {
  //     await updateTrip.mutateAsync({
  //       id: trip.id,
  //       name: formattedTripName,
  //       description: formattedDescription,
  //       guestEmails: invited,
  //       startDate: formattedDate,
  //     });
  //   } else {
  //     setSaveStatus("Name field is required");
  //   }
  // };

  const onTripSubmit = (tripForm) => {
    updateTrip.mutate(tripForm);
  };

  return <TripForm trip={trip} onSubmit={onTripSubmit} />;
}

function TripForm({ trip, onSubmit }) {
  const date = new Date(trip.startDate);

  const [tripName, setTripName] = useState<string>(trip.name);
  const [description, setDescription] = useState<string>(trip.description);
  const [startDate, setStartDate] = useState<string>(
    date.toISOString().split("T")[0]
  );
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [invited, setInvited] = useState<string[]>(
    trip.guests.map((guest) => {
      return guest.email;
    })
  );

  const [updateInviteStatus, setUpdateInviteStatus] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  const handleInvite = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setUpdateInviteStatus("");

    const email = inviteEmail.trim();
    if (email && !invited.includes(email)) {
      // check that a user with that email exists

      let user = null;

      try {
        user = (await getUserByEmail(email)).user;
        console.log("found user:", user);
      } catch (e) {
        console.log("error finding user:", e);
      }

      if (user) {
        setInvited([...invited, email]);
        setInviteEmail("");
        setUpdateInviteStatus("");
      } else {
        setUpdateInviteStatus(`User not found with email: ${email}`);
      }
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaveStatus("");
    // check that fields are valid
    const formattedTripName = tripName.trim();
    const formattedDescription = description.trim();
    const formattedDate = new Date(startDate).toISOString();

    if (formattedTripName) {
      onSubmit({
        id: trip.id,
        name: formattedTripName,
        description: formattedDescription,
        guestEmails: invited,
        startDate: formattedDate,
      });
    } else {
      setSaveStatus("Name field is required");
    }
  };

  return (
    <form
      className="bg-white border border-black p-6 w-full max-w-lg mx-auto flex flex-col gap-6"
      style={{
        fontFamily: 'Chicago, "Arial Black", Arial, sans-serif',
        boxShadow: "8px 8px 0 #222",
        borderRadius: "0.5rem",
      }}
      onSubmit={handleSave}
    >
      <h2
        className="text-2xl font-bold text-center mb-4 tracking-wide border-b border-black pb-2"
        style={{ letterSpacing: "2px" }}
      >
        Trip Settings
      </h2>
      <div>
        <label
          className="block mb-1 font-bold text-black text-sm"
          htmlFor="tripName"
        >
          Trip Name
        </label>
        <input
          id="tripName"
          name="tripName"
          type="text"
          required
          className="w-full px-2 py-1 border border-black bg-white text-black text-base font-mono"
          style={{ boxShadow: "2px 2px 0 #222", borderRadius: "0.25rem" }}
          placeholder="e.g. Campfire Adventure"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
        />
      </div>
      <div>
        <label
          className="block mb-1 font-bold text-black text-sm"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full px-2 py-1 border border-black bg-white text-black text-base font-mono"
          style={{ boxShadow: "2px 2px 0 #222", borderRadius: "0.25rem" }}
          placeholder="Tell us about your trip!"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label
          className="block mb-1 font-bold text-black text-sm"
          htmlFor="startDate"
        >
          Start Date
        </label>
        <input
          id="startDate"
          name="startDate"
          type="date"
          required
          className="w-full px-2 py-1 border border-black bg-white text-black text-base font-mono"
          style={{ boxShadow: "2px 2px 0 #222", borderRadius: "0.25rem" }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label
          className="block mb-1 font-bold text-black text-sm"
          htmlFor="inviteEmail"
        >
          Invite a friend
        </label>
        <div className="flex gap-2">
          <input
            id="inviteEmail"
            name="inviteEmail"
            type="email"
            className="flex-1 px-2 py-1 border border-black bg-white text-black text-base font-mono"
            style={{ boxShadow: "2px 2px 0 #222", borderRadius: "0.25rem" }}
            placeholder="Enter email..."
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <button
            type="button"
            className="px-4 py-1 border border-black bg-gray-200 text-black font-bold font-mono"
            style={{ boxShadow: "2px 2px 0 #222", borderRadius: "0.25rem" }}
            onClick={handleInvite}
          >
            Search
          </button>
        </div>
        {updateInviteStatus}
      </div>
      <div>
        <label className="block mb-2 font-bold text-black text-sm">
          Invited Members
        </label>
        <ul
          className="bg-white border border-black p-2"
          style={{ borderRadius: "0.25rem", boxShadow: "2px 2px 0 #222" }}
        >
          {invited.length === 0 ? (
            <li className="text-gray-500 italic text-sm">
              No members invited yet!
            </li>
          ) : (
            invited.map((email, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between text-black text-base font-mono mb-2"
              >
                <span
                  className="bg-gray-100 px-2 py-1 border border-black rounded"
                  style={{ borderRadius: "0.25rem" }}
                >
                  {email}
                </span>
                <button
                  className="ml-2 px-2 py-1 border border-black bg-red-500 text-white font-bold rounded"
                  style={{ boxShadow: "2px 2px 0 #222" }}
                  onClick={() => {
                    setInvited(invited.filter((e, i) => e !== email));
                  }}
                >
                  X
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
      {saveStatus}
      <button
        type="submit"
        className="px-6 py-2 border border-black bg-gray-200 text-black font-bold font-mono mt-4 hover:bg-gray-300 active:bg-gray-400 active:translate-x-0.5 active:translate-y-0.5"
        style={{
          boxShadow: "2px 2px 0 #222",
          borderRadius: "0.25rem",
          transition: "background 0.1s, transform 0.1s",
        }}
      >
        Save Trip Settings
      </button>
    </form>
  );
}
