import { useState } from "react";

import { redirect, NavLink, useNavigate } from "react-router";
import { useMutateCurrentUser, getCurrentUser } from "../apiClient/client";

const ACTIVE_USER_REDIRECT = "/trips";

export async function loader({ request }) {
  const cookie = request.headers.get("cookie") ?? "";
  try {
    const currentUser = await getCurrentUser({}, { Cookie: cookie });
    return redirect(ACTIVE_USER_REDIRECT);
  } catch (error) {}
}

export default function LogInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <LoginForm />
    </div>
  );
}

function LoginForm() {
  let navigate = useNavigate();

  const { mutate, isPending, isError, isSuccess, isIdle, error } =
    useMutateCurrentUser((data, error, variables, context) => {
      if (!error) {
        navigate(ACTIVE_USER_REDIRECT);
      }
    });

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Stop default form submission
    mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  const loginForm = (
    <>
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="input input-bordered w-full focus:invalid:border-red-500"
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
      {isError ? <div>Error logging in: {error.message}</div> : null}
    </>
  );

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
      {isPending ? "Loading..." : loginForm}
    </div>
  );
}
