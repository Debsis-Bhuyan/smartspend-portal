interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  role: 'admin' | 'doctor' | 'nurse' | 'patient';
  roles: {
    id: string;
    name: string;
  }[];
}

interface LoginInput {
  identifier: string;
  password: string;
}

interface ForgotPasswordInput {
  identifier: string;
}

interface VerifyOTPInput {
  identifier: string;
  otp: string;
}

interface ResetPasswordInput {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  loginWithCredentials: (input: LoginInput) => Promise<any>;
  forgotPassword: (input: ForgotPasswordInput) => Promise<any>;
  verifyOTP: (input: VerifyOTPInput) => Promise<any>;
  resetPassword: (input: ResetPasswordInput) => Promise<any>;
  refreshToken: () => Promise<boolean>;
  checkAuth: () => Promise<boolean>;
}
