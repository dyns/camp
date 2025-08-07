import { useState } from "react";
import { useNavigate } from "react-router";

import { useCreateUser } from "../apiClient/user";

export default function CreateAccount() {
  const navigate = useNavigate();
  const mutateUser = useCreateUser();
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <form
        action={async (formData) => {
          setErrorMessage("");

          const name = formData.get("name");
          const email = formData.get("email");
          const password = formData.get("password");

          if (
            typeof name === "string" &&
            name &&
            typeof email === "string" &&
            email &&
            typeof password === "string" &&
            password
          ) {
            try {
              await mutateUser.mutateAsync({
                name,
                email,
                password,
              });

              navigate("/trips");
            } catch (error) {
              if (error instanceof Error) {
                setErrorMessage(error?.message);
              } else {
                setErrorMessage("An error occurred");
              }
            }
          } else {
            setErrorMessage("Please fill out all fields");
          }
        }}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="nickname">
            Nickname
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="input input-bordered w-full"
            placeholder="Enter your name"
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
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="text"
            required
            className="input input-bordered w-full"
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="btn btn-primary w-full mt-4">
          Create Account
        </button>
        {errorMessage ? (
          <p className="text-red-600">Error: {errorMessage}</p>
        ) : null}
      </form>
    </div>
  );
}
