// Authentication related constants

export const AUTH_MESSAGES = {
  LOGIN: {
    SUCCESS: "Login successful! Redirecting...",
    ERROR: "Invalid email or password",
    NETWORK_ERROR: "Network error. Please check your connection.",
  },
  REGISTER: {
    SUCCESS: "Registration successful! Redirecting to login...",
    ERROR: "Registration failed. Please try again.",
    OTP_SENT: "OTP has been sent to your email",
    OTP_SEND_ERROR: "Failed to send OTP",
  },
  FORGOT_PASSWORD: {
    OTP_SENT: "OTP has been sent to your email",
    OTP_SEND_ERROR: "Failed to send OTP. Please try again.",
    OTP_RESENT: "OTP has been resent to your email",
    RESET_SUCCESS: "Password reset successful! Redirecting to login...",
    RESET_ERROR: "Failed to reset password. Please try again.",
  },
} as const;

export const AUTH_CONFIG = {
  OTP_LENGTH: 6,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 50,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  REDIRECT_DELAY: 2000, // milliseconds
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: "/dashboard",
} as const;

export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: "At least 8 characters",
  UPPERCASE: "One uppercase letter",
  LOWERCASE: "One lowercase letter",
  NUMBER: "One number",
} as const;
