import { useState } from "react";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { Input, Button, AuthCard, Divider, Alert } from "../common";
import { loginSchema } from "@/utils/validation-schemas";
import type { LoginDto } from "@/types/LoginDto";
import useAuth from "@/hooks/useAuth";

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
    <AuthCard title="Sign In" subtitle="Welcome back to CineHub">
      <Alert message={apiError} variant="error" onClose={() => setApiError("")} />

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Input
          type="email"
          name="email"
          placeholder="Email or phone number"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
          autoComplete="email"
        />

        <Input
          type="password"
          name="password"
          placeholder="Password"
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
          Sign In
        </Button>
      </form>

      <Divider />

      <Button
        variant="secondary"
        fullWidth
        onClick={() => console.log("Sign in with code")}
      >
        Sign in with Code
      </Button>

      <div className="mt-8 text-center">
        <Link
          to="/forgot-password"
          className="text-gray-400 hover:text-white text-sm transition"
        >
          Forgot password?
        </Link>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-700 text-center">
        <p className="text-gray-400 text-sm">
          New to CineHub?{" "}
          <Link
            to="/register"
            className="text-white hover:underline font-semibold"
          >
            Sign up now
          </Link>
        </p>
      </div>

      <p className="text-gray-500 text-xs mt-6 text-center">
        This page is protected by Google reCAPTCHA to ensure you're not a bot.
      </p>
    </AuthCard>
  );
}
