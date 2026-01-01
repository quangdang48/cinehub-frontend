import { useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import {
  Input,
  Button,
  AuthCard,
  Alert,
  PasswordStrength,
  RadioGroup,
} from "../common";
import { registerSchema } from "@/utils/validation-schemas";
import { AuthService } from "@/services/AuthService";

interface RegisterFormValues {
  name: string;
  email: string;
  gender: "male" | "female";
  password: string;
  confirmPassword: string;
}

export default function RegisterForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Form đăng ký
  const registerFormik = useFormik<RegisterFormValues>({
    initialValues: {
      name: "",
      email: "",
      gender: "male",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setApiError("");
      setSuccessMessage("");

      try {
        const { confirmPassword, ...registerData } = values;
        await AuthService.register(registerData);

        setSuccessMessage(
          "Đăng ký thành công! Đang chuyển đến trang xác nhận email...",
        );

        setTimeout(() => {
          navigate(`/verify-email?email=${encodeURIComponent(values.email)}`);
        }, 1500);
      } catch (error: any) {
        setApiError(
          error?.response?.data?.message ||
            error?.message ||
            "Đã xảy ra lỗi khi đăng ký",
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <AuthCard title="Đăng ký" subtitle="Tạo tài khoản CineHub của bạn">
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

      <form onSubmit={registerFormik.handleSubmit} className="space-y-6">
        <Input
          type="text"
          name="name"
          placeholder="Họ và tên"
          value={registerFormik.values.name}
          onChange={registerFormik.handleChange}
          onBlur={registerFormik.handleBlur}
          error={
            registerFormik.touched.name && registerFormik.errors.name
              ? registerFormik.errors.name
              : undefined
          }
          autoComplete="name"
        />

        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={registerFormik.values.email}
          onChange={registerFormik.handleChange}
          onBlur={registerFormik.handleBlur}
          error={
            registerFormik.touched.email && registerFormik.errors.email
              ? registerFormik.errors.email
              : undefined
          }
          autoComplete="email"
        />

        <Input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={registerFormik.values.password}
          onChange={registerFormik.handleChange}
          onBlur={registerFormik.handleBlur}
          error={
            registerFormik.touched.password && registerFormik.errors.password
              ? registerFormik.errors.password
              : undefined
          }
          autoComplete="new-password"
        />
        <PasswordStrength password={registerFormik.values.password} />

        <Input
          type="password"
          name="confirmPassword"
          placeholder="Xác nhận mật khẩu"
          value={registerFormik.values.confirmPassword}
          onChange={registerFormik.handleChange}
          onBlur={registerFormik.handleBlur}
          error={
            registerFormik.touched.confirmPassword &&
            registerFormik.errors.confirmPassword
              ? registerFormik.errors.confirmPassword
              : undefined
          }
          autoComplete="new-password"
        />

        <RadioGroup
          label="Giới tính"
          name="gender"
          options={[
            { value: "male", label: "Nam" },
            { value: "female", label: "Nữ" },
          ]}
          value={registerFormik.values.gender || "male"}
          onChange={(value) => registerFormik.setFieldValue("gender", value)}
          error={
            registerFormik.touched.gender && registerFormik.errors.gender
              ? registerFormik.errors.gender
              : undefined
          }
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
          Đăng ký
        </Button>
      </form>

      <div className="mt-8 pt-8 border-t border-gray-700 text-center">
        <p className="text-gray-400 text-sm">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="text-white hover:underline font-semibold"
          >
            Đăng nhập
          </Link>
        </p>
      </div>

      <p className="text-gray-500 text-xs mt-6 text-center">
        Bằng việc đăng ký, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo
        mật của chúng tôi.
      </p>
    </AuthCard>
  );
}
