import { useState } from "react";
import { useNavigate } from "react-router";

import { useCreateUser } from "../apiClient/user";

export default function CreateAccount() {
  const navigate = useNavigate();
  const mutateUser = useCreateUser();
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div className="flex items-center justify-center min-h-screen">
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
        className="bg-white/95 w-full max-w-md border border-black p-8 space-y-6 rounded-lg shadow-[2px_2px_0_#222]"
      >
        <h2 className="text-4xl font-extrabold text-left mb-6 leading-tight text-black">
          Sign Up
        </h2>
        <div>
          <label
            className="block mb-1 font-bold text-black text-lg"
            htmlFor="name"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full px-4 py-3 border border-black bg-white text-black text-base rounded-lg shadow-[2px_2px_0_#222]"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label
            className="block mb-1 font-bold text-black text-lg"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-4 py-3 border border-black bg-white text-black text-base rounded-lg shadow-[2px_2px_0_#222]"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label
            className="block mb-1 font-bold text-black text-lg"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-4 py-3 border border-black bg-white text-black text-base rounded-lg shadow-[2px_2px_0_#222]"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="w-full mt-4 px-6 py-3 border border-black bg-green-200 hover:bg-green-300 text-black font-bold rounded-lg shadow-[2px_2px_0_#222] transition-[background,transform] duration-100 active:translate-x-0.5 active:translate-y-0.5"
        >
          Create Account
        </button>
        {errorMessage ? (
          <p className="text-red-500 mt-2">Error: {errorMessage}</p>
        ) : null}
      </form>
    </div>
  );
}
