import { useState } from "react";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { Input, Button, AuthCard, Alert, PasswordStrength } from "../common";
import { resetPasswordSchema, forgotPasswordSchema } from "@/utils/validation-schemas";
import type { ResetPasswordDto } from "@/types/ResetPasswordDto";
import { AuthService } from "@/services/AuthService";

interface ResetPasswordFormValues extends ResetPasswordDto {
  confirmPassword: string;
}

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [step, setStep] = useState<"email" | "reset">("email");

  const emailFormik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setApiError("");
      setSuccessMessage("");

      try {
        await AuthService.forgotPassword(values.email);
        setSuccessMessage("OTP has been sent to your email");
        setStep("reset");
        resetFormik.setFieldValue("email", values.email);
      } catch (error: any) {
        setApiError(
          error?.response?.data?.message ||
          error?.message ||
          "Failed to send OTP. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  const resetFormik = useFormik<ResetPasswordFormValues>({
    initialValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setApiError("");
      setSuccessMessage("");

      try {
        const { confirmPassword, ...resetData } = values;
        await AuthService.resetPassword(resetData);
        
        setSuccessMessage("Password reset successful! Redirecting to login...");
        
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } catch (error: any) {
        setApiError(
          error?.response?.data?.message ||
          error?.message ||
          "Failed to reset password. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleResendOtp = async () => {
    setIsLoading(true);
    setApiError("");
    setSuccessMessage("");

    try {
      await AuthService.forgotPassword(resetFormik.values.email);
      setSuccessMessage("OTP has been resent to your email");
    } catch (error: any) {
      setApiError(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to resend OTP"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Reset Password" 
      subtitle={step === "email" ? "Enter your email to receive OTP" : "Enter OTP and new password"}
    >
      <Alert message={apiError} variant="error" onClose={() => setApiError("")} />
      <Alert message={successMessage} variant="success" onClose={() => setSuccessMessage("")} />

      {step === "email" ? (
        <form onSubmit={emailFormik.handleSubmit} className="space-y-6">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={emailFormik.values.email}
            onChange={emailFormik.handleChange}
            onBlur={emailFormik.handleBlur}
            error={emailFormik.touched.email && emailFormik.errors.email ? emailFormik.errors.email : undefined}
            autoComplete="email"
            helperText="We'll send you an OTP to reset your password"
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            Send OTP
          </Button>

          <div className="text-center">
            <Link
              to="/login"
              className="text-gray-400 hover:text-white text-sm transition"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      ) : (
        <form onSubmit={resetFormik.handleSubmit} className="space-y-6">
          <Input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={resetFormik.values.otp}
            onChange={resetFormik.handleChange}
            onBlur={resetFormik.handleBlur}
            error={resetFormik.touched.otp && resetFormik.errors.otp ? resetFormik.errors.otp : undefined}
            maxLength={6}
            helperText="Enter the 6-digit OTP sent to your email"
          />

          <Input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={resetFormik.values.newPassword}
            onChange={resetFormik.handleChange}
            onBlur={resetFormik.handleBlur}
            error={resetFormik.touched.newPassword && resetFormik.errors.newPassword ? resetFormik.errors.newPassword : undefined}
            autoComplete="new-password"
          />
          <PasswordStrength password={resetFormik.values.newPassword} />

          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={resetFormik.values.confirmPassword}
            onChange={resetFormik.handleChange}
            onBlur={resetFormik.handleBlur}
            error={resetFormik.touched.confirmPassword && resetFormik.errors.confirmPassword ? resetFormik.errors.confirmPassword : undefined}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            Reset Password
          </Button>

          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isLoading}
              className="text-gray-400 hover:text-white text-sm transition disabled:opacity-50"
            >
              Resend OTP
            </button>
            <div>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="text-gray-400 hover:text-white text-sm transition"
              >
                Change Email
              </button>
            </div>
          </div>
        </form>
      )}
    </AuthCard>
  );
}
