import React, { useState } from 'react';
import { useLogin } from './useAuthApi';
import { useRouter } from 'next/navigation';

type Props = {
  formData: any;
  isLoading: boolean;
  error: string;
  message: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
  onRegister: () => void;
  colors: any;
};

const LoginForm = ({
  formData,
  isLoading,
  error,
  message,
  onInputChange,
  onSubmit,
  onForgotPassword,
  onRegister,
  colors,
}: Props) => {
  const router = useRouter();

  const { login, loading, error: err } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {(error || message) && (
        <div className={`px-4 py-3 rounded-lg text-sm ${error ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
          {error || message}
        </div>
      )}

      <div>
        <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          id="identifier"
          name="identifier"
          type="text"
          value={formData.identifier}
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
          value={formData.password}
          onChange={onInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input id="remember" type="checkbox" className="mr-2" />
          <label htmlFor="remember" className="text-sm text-gray-700">Remember me</label>
        </div>
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{ backgroundColor: colors.smart.blue }}
        className="w-full py-3 px-4 rounded-lg font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
      <p className="mt-4 text-center text-sm text-gray-500">
        Don't have an account?
        <button
          type="button"
          onClick={onRegister}
          className="text-blue-600 hover:underline"
        >
          Register
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
