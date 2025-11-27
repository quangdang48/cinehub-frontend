import { useState } from "react";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { Input, Button, AuthCard, Divider, Alert } from "../common";
import { loginSchema } from "@/utils/validation-schemas";
import type { LoginDto } from "@/types/LoginDto";
import { useAuth } from "@/hooks";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const { login } = useAuth();

  const formik = useFormik<LoginDto>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setApiError("");
      
      const result = await login(values);

      if (result?.status === "failed") {
        setApiError(result.message);
      }
      setIsLoading(false);
    },
  });

  return (
    <AuthCard title="Đăng nhập" subtitle="Chào mừng trở lại CineHub">
      <Alert message={apiError} variant="error" onClose={() => setApiError("")} />

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Input
          type="email"
          name="email"
          placeholder="Email hoặc số điện thoại"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
          autoComplete="email"
        />

        <Input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
          autoComplete="current-password"
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
          Đăng nhập
        </Button>
      </form>

      <Divider />

      <Button
        variant="secondary"
        fullWidth
        className="mt-4 flex items-center justify-center gap-2"
      >
        Đăng nhập với mã đăng nhập
      </Button>
      <Button
        variant="secondary"
        fullWidth
        onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`}
        className="mt-4 flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Đăng nhập với Google
      </Button>

      <div className="mt-8 text-center">
        <Link
          to="/forgot-password"
          className="text-gray-400 hover:text-white text-sm transition"
        >
          Quên mật khẩu?
        </Link>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-700 text-center">
        <p className="text-gray-400 text-sm">
          Thành viên mới?{" "}
          <Link
            to="/register"
            className="text-white hover:underline font-semibold"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>

      <p className="text-gray-500 text-xs mt-6 text-center">
        This page is protected by Google reCAPTCHA to ensure you're not a bot.
      </p>
    </AuthCard>
  );
}
