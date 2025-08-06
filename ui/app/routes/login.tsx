import { useState } from "react";
import { redirect, NavLink, useNavigate } from "react-router";
import { useSignInUser, getCurrentUser } from "../apiClient/user";

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
  const navigate = useNavigate();
  const { mutate, isPending, isError, error } = useSignInUser((data, error) => {
    if (!error) {
      navigate(ACTIVE_USER_REDIRECT);
    }
  });
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
      {isPending ? (
        "Loading..."
      ) : (
        <>
          <LoginFormFields
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
          />
          <LoginFormFooter />
          {isError && (
            <div className="text-red-500">
              Error logging in: {error.message}
            </div>
          )}
        </>
      )}
    </div>
  );
}

type LoginFormFieldsProps = {
  formData: { email: string; password: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

function LoginFormFields({
  formData,
  onChange,
  onSubmit,
}: LoginFormFieldsProps) {
  return (
    <form onSubmit={onSubmit}>
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
          onChange={onChange}
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
          onChange={onChange}
        />
      </div>
      <button type="submit" className="btn btn-primary w-full mt-4">
        Sign In
      </button>
    </form>
  );
}

function LoginFormFooter() {
  return (
    <div className="text-center mt-4">
      <NavLink type="button" className="btn btn-link text-primary" to="/signup">
        Don't have an account? Sign Up
      </NavLink>
    </div>
  );
}
