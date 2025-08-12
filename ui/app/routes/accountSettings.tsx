import { useState } from "react";
import { useNavigate } from "react-router";

import {
  useUpdateCurrentUser,
  useCurrentUser,
  signOut,
} from "../apiClient/user";
import { PageContent } from "../components/PageContent";
import { queryClient } from "../apiClient/clientUtils";

export default function AccountSettingsData() {
  const { data, isLoading, error } = useCurrentUser();
  const navigate = useNavigate();

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
    <PageContent>
      <div
        style={{ flexDirection: "column" }}
        className="flex justify-center items-start"
      >
        <AccountSettings user={data.user} />
        <button
          className="btn btn-outline btn-error mt-6 shadow"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
    </PageContent>
  );
}

function AccountSettings({ user }: { user: any }) {
  const [updateStatus, setUpdateStatus] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ status: "idle", message: "" });

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
      onSubmit={async (e) => {
        e.preventDefault();

        const name = formData.name.trim();
        const email = formData.email.trim();
        const confirmEmail = formData.confirmEmail.trim();

        setFormData({ name, email, confirmEmail });

        if (name && (!emailChanged || email === confirmEmail)) {
          try {
            await updateCurrentUser.mutateAsync({
              name: formData.name,
              email: formData.email,
            });

            setUpdateStatus({
              status: "success",
              message: "Updated successfully",
            });
          } catch (error) {
            setUpdateStatus({
              status: "error",
              message: "Error updating account",
            });
          }
        }
      }}
      className="w-full space-y-6"
    >
      <h2 className="page-title">Account Settings</h2>
      <div>
        <label className="input-label" htmlFor="nickname">
          Nickname
        </label>
        <input
          id="nickname"
          name="nickname"
          type="text"
          required
          className="input-field"
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
        <label className="input-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="input-field"
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
          <label className="input-label" htmlFor="email">
            Confirm Email
          </label>
          <input
            id="confirm-email"
            name="confirm-email"
            type="email"
            required
            className="input-field"
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
        className="green-button"
      >
        Update Account
      </button>

      {updateStatus.status === "success" || updateStatus.status === "error" ? (
        <span
          className={`ml-2 ${
            updateStatus.status === "success"
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {updateStatus.message}
        </span>
      ) : null}

      <span className="ml-2">
        {emailNotConfirmed ? "Emails must match" : null}
      </span>
    </form>
  );
}
