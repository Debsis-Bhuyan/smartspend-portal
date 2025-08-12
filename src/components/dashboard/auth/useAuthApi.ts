// hooks/useLogin.ts (or .js)
import { useState } from 'react';
import axios from 'axios';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string; // or whatever your backend returns
  user?: any;
}

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LoginResponse | null>(null);

  const login = async (credentials: LoginPayload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<LoginResponse>(
        'http://localhost:8080/api/auth/login',
        credentials
      );

      setData(response.data);

      // Optional: Store token in localStorage/sessionStorage
      localStorage.setItem('token', response.data.token);

      return response.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
    data,
  };
};
