import { useState } from "react";

import { redirect, NavLink } from "react-router";
import { useCurrentUser, useMutateCurrentUser } from "../apiClient/client";

function LoginStatus() {
  const {
    isPending,
    error: qError,
    data: qData,
    status: qStatus,
  } = useCurrentUser();

  // useQuery({
  //   retry: false,
  //   queryKey: ["repoData"],
  //   queryFn: async () => {
  //     const res = await fetch("http://localhost:3000/auth/me");

  //     const contentType = res.headers.get("Content-Type") || "";
  //     const data = contentType.includes("application/json")
  //       ? await res.json()
  //       : await res.text();

  //     if (!res.ok) {
  //       const message =
  //         typeof data === "string" ? data : data.error || "Unknown error";
  //       console.error("Error fetching data:", message);
  //       const error = new Error(message);
  //       // error.status = res.status;
  //       // error.data = data;
  //       throw error;
  //     }

  //     return data;
  //   },
  // });

  if (qError)
    return (
      "An error has occurred: " +
      qError.message +
      "status: " +
      JSON.stringify(qStatus)
    );

  if (isPending) return "Loading...";

  return (
    <div>
      api data: {JSON.stringify(qData)} status: {JSON.stringify(status)}
    </div>
  );
}

export default function LogInPage() {
  const { isPending, error, data, status } = useCurrentUser();

  console.log("LoginPage data", { isPending, error, data, status });

  if (isPending) return "Loading...";

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <LoginForm />
      </div>
    );
  }

  return <div>got user</div>;
}

function LoginForm() {
  const { mutate, isPending, isError, isSuccess, isIdle, error } =
    useMutateCurrentUser();

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleFormChange", e.target.name, e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("handleSubmit", formData);
    e.preventDefault(); // Stop default form submission
    mutate({
      email: formData.email,
      password: formData.password,
    });

    // try {
    //   await apiClient('/auth/signin', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(form),
    //   });
    //   // maybe redirect or refetch auth status here
    // } catch (err) {
    //   console.error(err);
    // }
  };

  if (isPending) return "Loading...";

  if (isError) {
    return (
      <div>
        Error logging in :{" "}
        {JSON.stringify({ isPending, isError, isSuccess, isIdle, error })}
      </div>
    );
  }

  return (
    <>
      <form
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center mb-4">
          Sign In ... state:{" "}
          {JSON.stringify({ isSuccess, isIdle, isError, isPending })}
        </h2>
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
            onChange={handleFormChange}
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="input input-bordered w-full"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleFormChange}
          />
        </div>
        <button type="submit" className="btn btn-primary w-full mt-4">
          Sign In
        </button>
      </form>
      <div className="text-center mt-4">
        <NavLink
          type="button"
          className="btn btn-link text-primary"
          to="/create-account"
        >
          Don't have an account? Sign Up
        </NavLink>
      </div>
    </>
  );
}
