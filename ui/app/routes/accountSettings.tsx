import { useState } from "react";
import { useNavigate } from "react-router";

import {
  useUpdateCurrentUser,
  useCurrentUser,
  signOut,
} from "../apiClient/user";

import { queryClient } from "../apiClient/clientUtils";

export default function AccountSettingsData() {
  const { data, isLoading, error } = useCurrentUser();
  const navigate = useNavigate();
  // const [] = useState();

  console.log("account settings", data);
  if (isLoading) {
    return "Loading";
  } else if (error) {
    return `Error: ${error.message}`;
  } else if (!data.user) {
    return "No user";
  }

  const handleSignOut = async () => {
    // issue sign out request to delete cookie
    await signOut();
    // clear cache
    queryClient.clear();

    navigate("/");
  };

  return (
    <div
      style={{ flexDirection: "column" }}
      className="flex items-center justify-center min-h-screen bg-base-200"
    >
      <AccountSettings user={data.user} />
      <button
        className="btn btn-outline btn-error w-full max-w-md mt-6 shadow"
        onClick={handleSignOut}
      >
        Sign Out
      </button>
    </div>
  );
}

function AccountSettings({ user }: { user: any }) {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    confirmEmail: string;
  }>({
    name: user.name,
    email: user.email,
    confirmEmail: "",
  });

  const updateCurrentUser = useUpdateCurrentUser();
  const emailChanged = user.email !== formData.email;
  const emailNotConfirmed =
    emailChanged && formData.email !== formData.confirmEmail;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const name = formData.name.trim();
        const email = formData.email.trim();
        const confirmEmail = formData.confirmEmail.trim();

        setFormData({ name, email, confirmEmail });

        if (name && (!emailChanged || email === confirmEmail)) {
          updateCurrentUser.mutate({
            name: formData.name,
            email: formData.email,
          });
        }
      }}
      className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6"
    >
      <h2 className="text-2xl font-bold text-center mb-4">Account Settings</h2>
      <div>
        <label className="block mb-1 font-semibold" htmlFor="nickname">
          Nickname
        </label>
        <input
          id="nickname"
          name="nickname"
          type="text"
          required
          className="input input-bordered w-full"
          placeholder="Enter your nickname"
          value={formData.name}
          onChange={(e) => {
            setFormData((prev) => {
              return { ...prev, name: e.target.value };
            });
          }}
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="input input-bordered w-full"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => {
            setFormData((prev) => {
              return { ...prev, email: e.target.value };
            });
          }}
        />
      </div>

      {emailChanged ? (
        <div>
          <label className="block mb-1 font-semibold" htmlFor="email">
            Confirm Email
          </label>
          <input
            id="confirm-email"
            name="confirm-email"
            type="email"
            required
            className="input input-bordered w-full"
            placeholder="Re-enter your email"
            value={formData.confirmEmail}
            onChange={(e) => {
              setFormData((prev) => {
                return { ...prev, confirmEmail: e.target.value };
              });
            }}
          />
        </div>
      ) : null}

      <button
        disabled={emailNotConfirmed}
        type="submit"
        className="btn btn-primary w-full mt-4"
      >
        Update Account
      </button>

      <span>{emailNotConfirmed ? "Emails must match" : null}</span>
    </form>
  );
}
