'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/theme';
import Head from 'next/head';
import LoginForm from '@/components/dashboard/auth/LoginForm';
import ForgotPasswordForm from '@/components/dashboard/auth/ForgotPasswordForm';
import OTPForm from '@/components/dashboard/auth/OTPForm';
import ResetPasswordForm from '@/components/dashboard/auth/ResetPasswordForm';
import RegisterForm from '@/components/dashboard/auth/RegisterForm';

type AuthStep = 'login' | 'forgot-password' | 'otp-verification' | 'reset-password' | 'qr-scanner' | 'register';

const LoginPage = () => {
  const router = useRouter();
  const [authStep, setAuthStep] = useState<AuthStep>('login');
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [RegisterformData, setRegisterFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const streamRef = useRef<MediaStream | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const scanInterval = useRef<NodeJS.Timeout | null>(null);
  const { loginWithCredentials, registerWithCredentials, forgotPassword, verifyOTP, resetPassword, login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
    if (message) setMessage('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.identifier || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const loginInput: LoginInput = {
        identifier: formData.identifier,
        password: formData.password
      };

      const response = await loginWithCredentials(loginInput);

      switch (response.user.role) {
        case 'admin':
          router.push('/dashboard/admin');
          break;
        default:
          router.push('/dashboard/user');
      }

    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.identifier) {
      setError('Please enter your User ID, Email, or Phone number');
      setIsLoading(false);
      return;
    }

    try {
      const forgotPasswordInput: ForgotPasswordInput = {
        identifier: formData.identifier
      };

      const response = await forgotPassword(forgotPasswordInput);

      if (response.otpSent) {
        setMessage(response.message);
        setAuthStep('otp-verification');
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.otp) {
      setError('Please enter the OTP');
      setIsLoading(false);
      return;
    }

    try {
      const verifyOTPInput: VerifyOTPInput = {
        identifier: formData.identifier,
        otp: formData.otp
      };

      const response = await verifyOTP(verifyOTPInput);

      if (response.isValid && response.resetToken) {
        setResetToken(response.resetToken);
        setMessage('OTP verified successfully. Please set your new password.');
        setAuthStep('reset-password');
      } else {
        setError('Invalid or expired OTP. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const resetPasswordInput: ResetPasswordInput = {
        resetToken,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      };

      const response = await resetPassword(resetPasswordInput);

      if (response.success) {
        setMessage('Password reset successfully. Please login with your new password.');
        setFormData({
          identifier: '',
          password: '',
          otp: '',
          newPassword: '',
          confirmPassword: ''
        });
        setAuthStep('login');
        setResetToken('');
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Password reset failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetToLogin = () => {
    setAuthStep('login');
    setError('');
    setMessage('');
    setFormData({
      identifier: '',
      password: '',
      otp: '',
      newPassword: '',
      confirmPassword: ''
    });
    setResetToken('');
  };

  const getFormTitle = () => {
    switch (authStep) {
      case 'forgot-password':
        return 'Reset Password';
      case 'otp-verification':
        return 'Verify OTP';
      case 'reset-password':
        return 'Set New Password';
      default:
        return 'Smart Spend Portal';
    }
  };

  const renderForgotPasswordForm = () => {

    return (
      <ForgotPasswordForm
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleForgotPassword}
        isLoading={isLoading}
        error={error}
        message={message}
        onBack={resetToLogin}
        colors={colors}
      />
    );
  }


  const renderOTPForm = () => (
    <OTPForm
      formData={formData}
      onInputChange={handleInputChange}
      onSubmit={handleOTPVerification}
      isLoading={isLoading}
      error={error}
      message={message}
      onBack={resetToLogin}
      colors={colors}
    />
  );

  const renderResetPasswordForm = () => (
    <ResetPasswordForm
      formData={formData}
      onInputChange={handleInputChange}
      onSubmit={handlePasswordReset}
      isLoading={isLoading}
      error={error}
      message={message}
      colors={colors}
    />
  );

  const renderLoginForm = () => (
    <LoginForm
      formData={formData}
      onInputChange={handleInputChange}
      onSubmit={handleLogin}
      isLoading={isLoading}
      error={error}
      message={message}
      onForgotPassword={() => setAuthStep('forgot-password')}
      onRegister={() => setAuthStep('register')}
      colors={colors}
    />
  );
  const renderRegisterForm = () => {
    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setRegisterFormData({ ...RegisterformData, [e.target.name]: e.target.value });
    };
    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      if (!RegisterformData.username || !RegisterformData.email || !RegisterformData.password) {
        setError('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      try {
        const registerInput = {
          username: RegisterformData.username,
          email: RegisterformData.email,
          password: RegisterformData.password,
        };

        const response = await registerWithCredentials(registerInput); // You should define this API call

        switch (response.user.role) {
          case 'admin':
            router.push('/dashboard/admin');
            break;
          default:
            router.push('/dashboard');
        }

      } catch (err: any) {
        setError(err.message || 'Registration failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <RegisterForm
        formData={RegisterformData}
        onInputChange={handleRegisterChange}
        onSubmit={handleRegister}
        isLoading={isLoading}
        error={error}
        message={message}
        onLogin={() => setAuthStep('login')}
        colors={colors}
      />
    );
  }

  const renderCurrentForm = () => {
    switch (authStep) {
      case 'forgot-password':
        return renderForgotPasswordForm();
      case 'otp-verification':
        return renderOTPForm();
      case 'reset-password':
        return renderResetPasswordForm();
      case 'register':
        return renderRegisterForm();
      default:
        return renderLoginForm();
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      clearInterval(progressInterval.current!);
      clearTimeout(scanInterval.current!);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Smart Spend Login - Expense & Budget Management System</title>
        <meta name="description" content="Login to Smart Spend - Your personal finance and budgeting platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 opacity-30" />

        <div className="relative w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div
              style={{ backgroundColor: colors.smart.green || '#28a745' }}
              className="p-8 text-center"
            >
              <h1 className="text-2xl font-bold text-white mb-2">{getFormTitle()}</h1>
              <p className="text-green-100 text-sm">Expense & Budget Management</p>
              <p className="text-green-100 text-xs mt-1">Smart Spend by XYZ Corp</p>
            </div>

            <div className="p-8">
              {renderCurrentForm()}
            </div>
          </div>

          <div className="text-center mt-6 text-sm text-gray-500">
            <p>Smart Spend – Budgeting Reimagined</p>
            <p className="mt-1">Powered @debasis • © {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </>
  );
}
export default LoginPage;