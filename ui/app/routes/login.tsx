import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useSignInUser } from "../apiClient/user";

const ACTIVE_USER_REDIRECT = "/trips";

export default function LogInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoginForm />
    </div>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const { mutate, isPending, isError, error } = useSignInUser();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      {
        email: formData.email,
        password: formData.password,
      },
      {
        onSettled: (data, error) => {
          if (!error) {
            navigate(ACTIVE_USER_REDIRECT);
          }
        },
      }
    );
  };

  return (
    <div className="bg-white/95 w-full max-w-md border border-black p-8 space-y-6 rounded-lg shadow-[2px_2px_0_#222]">
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
      <h2 className="text-4xl font-extrabold text-left mb-6 leading-tight text-black">
        Sign In
      </h2>
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
          value={formData.email}
          onChange={onChange}
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
          value={formData.password}
          onChange={onChange}
        />
      </div>
      <button
        type="submit"
        className="w-full mt-4 px-6 py-3 border border-black bg-green-200 hover:bg-green-300 text-black font-bold rounded-lg shadow-[2px_2px_0_#222] transition-[background,transform] duration-100 active:translate-x-0.5 active:translate-y-0.5"
      >
        Sign In
      </button>
    </form>
  );
}

function LoginFormFooter() {
  return (
    <div className="text-center mt-4">
      <NavLink
        type="button"
        className="text-blue-600 hover:underline font-medium"
        to="/signup"
      >
        Don't have an account? Sign Up
      </NavLink>
    </div>
  );
}
