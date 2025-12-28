import { useState } from "react";
import { useFormik } from "formik";
import { useSearchParams } from "react-router-dom";
import { Input, Button, AuthCard, Alert } from "../common";
import { verifyEmailSchema } from "@/utils/validation-schemas";
import { AuthService } from "@/services/AuthService";
import { useAuth } from "@/hooks";

interface VerifyEmailFormValues {
  email: string;
  otp: string;
}

export default function VerifyEmailForm() {
  const { verify } = useAuth();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const emailFromUrl = searchParams.get("email") || "";

  const formik = useFormik<VerifyEmailFormValues>({
    initialValues: {
      email: emailFromUrl,
      otp: "",
    },
    validationSchema: verifyEmailSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      setApiError("");
      setSuccessMessage("");

      const result = await verify({ email: values.email, otp: values.otp });
      if (result?.status !== "success") {
        setApiError(result?.message || "Xác thực thất bại");
      }
      setIsLoading(false);
    },
  });

  const handleResendOtp = async () => {
    setIsLoading(true);
    setApiError("");
    setSuccessMessage("");

    try {
      await AuthService.resendOtp(formik.values.email);
      setSuccessMessage("Mã OTP mới đã được gửi đến email của bạn");
    } catch (error: any) {
      setApiError(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể gửi lại mã OTP",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Xác nhận email"
      subtitle={`Nhập mã OTP đã được gửi đến ${formik.values.email || 'email của bạn'}`}
    >
      <Alert
        message={apiError}
        variant="error"
        onClose={() => setApiError("")}
      />
      <Alert
        message={successMessage}
        variant="success"
        onClose={() => setSuccessMessage("")}
      />

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.email && formik.errors.email
              ? formik.errors.email
              : undefined
          }
          autoComplete="email"
        />

        <Input
          type="text"
          name="otp"
          placeholder="Nhập mã OTP"
          value={formik.values.otp}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.otp && formik.errors.otp
              ? formik.errors.otp
              : undefined
          }
          maxLength={6}
          helperText="Nhập mã gồm 6 chữ số đã được gửi đến email của bạn"
        />

        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Xác nhận
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isLoading}
            className="text-sm text-gray-400 hover:text-white transition disabled:opacity-50"
          >
            Không nhận được mã? <span className="font-semibold">Gửi lại</span>
          </button>
        </div>
      </form>

      <div className="mt-8 pt-8 border-t border-gray-700 text-center">
        <p className="text-gray-400 text-sm">
          Đã xác thực?{" "}
          <a
            href="/login"
            className="text-white hover:underline font-semibold"
          >
            Đăng nhập
          </a>
        </p>
      </div>
    </AuthCard>
  );
}
