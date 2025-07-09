import React from "react";

export default function CreateAccount() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
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
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="profilePic">
            Profile Picture
          </label>
          <input
            id="profilePic"
            name="profilePic"
            type="file"
            accept="image/*"
            required
            className="file-input file-input-bordered w-full"
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
        <button type="submit" className="btn btn-primary w-full mt-4">
          Create Account
        </button>
      </form>
    </div>
  );
}
