import React from 'react';

type Props = {
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string;
  message: string;
  colors: any;
};

const ResetPasswordForm = ({
  formData,
  onInputChange,
  onSubmit,
  isLoading,
  error,
  message,
  colors,
}: Props) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Reset Password</h2>

      {(error || message) && (
        <div className={`px-4 py-3 rounded-lg text-sm ${
          error ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'
        }`}>
          {error || message}
        </div>
      )}

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={onInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={onInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{ backgroundColor: colors.smart.blue }}
        className="w-full py-3 px-4 rounded-lg font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
