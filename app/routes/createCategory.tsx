import React from "react";

export default function CreateCategory() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center mb-4">Create Category</h2>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="categoryName">
            Name
          </label>
          <input
            id="categoryName"
            name="categoryName"
            type="text"
            required
            className="input input-bordered w-full"
            placeholder="Enter category name"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="categoryDesc">
            Description
          </label>
          <textarea
            id="categoryDesc"
            name="categoryDesc"
            rows={4}
            required
            className="textarea textarea-bordered w-full"
            placeholder="Describe this category..."
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="categoryImg">
            Image (optional)
          </label>
          <input
            id="categoryImg"
            name="categoryImg"
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
          />
        </div>
        <button type="submit" className="btn btn-primary w-full mt-4">
          Create Category
        </button>
      </form>
    </div>
  );
}
