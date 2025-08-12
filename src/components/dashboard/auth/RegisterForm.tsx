"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
type Props = {
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  error: string;
  isLoading: boolean;
  message: string;
  onLogin: () => void;
  colors: any;
};
const RegisterForm = ({
  formData,
  onInputChange,
  onSubmit,
  error,
  isLoading,
  message,
  onLogin,
  colors,
}: Props) => {



  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          id="username"
          name="username"
          placeholder="Enter Full name"
          type="text"
          value={formData.username}
          onChange={onInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          placeholder="Enter Email"
          type="email"
          value={formData.email}
          onChange={onInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={onInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 text-white w-full py-3 rounded-md hover:bg-blue-700 transition"
      >
        {isLoading ? "Registering..." : "Register"}
      </button>

      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account? <button
          type="button"
          onClick={onLogin}
          className="text-blue-600 hover:underline"
        >
          Login
        </button>
      </p>
    </form>
  );
}

export default RegisterForm