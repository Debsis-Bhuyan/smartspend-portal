import React from 'react';

type Props = {
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string;
  message: string;
  onBack: () => void;
  colors: any;
};

const ForgotPasswordForm = ({
  formData,
  onInputChange,
  onSubmit,
  isLoading,
  error,
  message,
  onBack,
  colors,
}: Props) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Forgot Password</h2>

      {(error || message) && (
        <div className={`px-4 py-3 rounded-lg text-sm ${
          error ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'
        }`}>
          {error || message}
        </div>
      )}

      <div>
        <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
          Enter your User ID, Email, or Phone
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

      <button
        type="submit"
        disabled={isLoading}
        style={{ backgroundColor: colors.smart.blue }}
        className="w-full py-3 px-4 rounded-lg font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {isLoading ? 'Sending OTP...' : 'Send OTP'}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="text-sm text-gray-600 hover:underline"
      >
        ← Back to Login
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
