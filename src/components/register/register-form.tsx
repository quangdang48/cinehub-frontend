import { useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button, AuthCard, Alert, PasswordStrength, RadioGroup } from "../common";
import { registerSchema, verifyEmailSchema } from "@/utils/validation-schemas";
import { AuthService } from "@/services/AuthService";

interface RegisterFormValues {
  name: string;
  email: string;
  gender: 'male' | 'female';
  password: string;
  confirmPassword: string;
}

interface VerifyEmailFormValues {
  email: string;
  otp: string;
}

export default function RegisterForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [step, setStep] = useState<"register" | "verify">("register");
  const [registeredEmail, setRegisteredEmail] = useState<string>("");

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
        
        setRegisteredEmail(values.email);
        
        // Chuyển sang bước xác nhận email
        setTimeout(() => {
          setStep("verify");
          setSuccessMessage("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.");
        }, 2000);
      } catch (error: any) {
        setApiError(
          error?.response?.data?.message ||
          error?.message ||
          "Đã xảy ra lỗi khi đăng ký"
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Form xác nhận OTP
  const verifyFormik = useFormik<VerifyEmailFormValues>({
    initialValues: {
      email: registeredEmail,
      otp: "",
    },
    validationSchema: verifyEmailSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      setApiError("");
      setSuccessMessage("");

      try {
        await AuthService.verifyOtp({
          email: values.email,
          otp: values.otp,
          name: "123",
          gender: "male",
          password: "T@olao123",
        });
        
        setSuccessMessage("Xác thực thành công! Đang chuyển đến trang đăng nhập...");
        
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error: any) {
        setApiError(
          error?.response?.data?.message ||
          error?.message ||
          "Mã OTP không hợp lệ hoặc đã hết hạn"
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Gửi lại OTP
  const handleResendOtp = async () => {
    setIsLoading(true);
    setApiError("");
    setSuccessMessage("");

    try {
      await AuthService.resendOtp(registeredEmail);
      setSuccessMessage("Mã OTP mới đã được gửi đến email của bạn");
    } catch (error: any) {
      setApiError(
        error?.response?.data?.message ||
        error?.message ||
        "Không thể gửi lại mã OTP"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Render form đăng ký
  if (step === "register") {
    return (
      <AuthCard 
        title="Đăng ký" 
        subtitle="Tạo tài khoản CineHub của bạn"
      >
        <Alert message={apiError} variant="error" onClose={() => setApiError("")} />
        <Alert message={successMessage} variant="success" onClose={() => setSuccessMessage("")} />

        <form onSubmit={registerFormik.handleSubmit} className="space-y-6">
          <Input
            type="text"
            name="name"
            placeholder="Họ và tên"
            value={registerFormik.values.name}
            onChange={registerFormik.handleChange}
            onBlur={registerFormik.handleBlur}
            error={registerFormik.touched.name && registerFormik.errors.name ? registerFormik.errors.name : undefined}
            autoComplete="name"
          />

          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={registerFormik.values.email}
            onChange={registerFormik.handleChange}
            onBlur={registerFormik.handleBlur}
            error={registerFormik.touched.email && registerFormik.errors.email ? registerFormik.errors.email : undefined}
            autoComplete="email"
          />

          <Input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={registerFormik.values.password}
            onChange={registerFormik.handleChange}
            onBlur={registerFormik.handleBlur}
            error={registerFormik.touched.password && registerFormik.errors.password ? registerFormik.errors.password : undefined}
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
            error={registerFormik.touched.confirmPassword && registerFormik.errors.confirmPassword ? registerFormik.errors.confirmPassword : undefined}
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
          Bằng việc đăng ký, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.
        </p>
      </AuthCard>
    );
  }

  // Render form xác nhận email
  return (
    <AuthCard 
      title="Xác nhận email" 
      subtitle={`Nhập mã OTP đã được gửi đến ${registeredEmail}`}
    >
      <Alert message={apiError} variant="error" onClose={() => setApiError("")} />
      <Alert message={successMessage} variant="success" onClose={() => setSuccessMessage("")} />

      <form onSubmit={verifyFormik.handleSubmit} className="space-y-6">
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={verifyFormik.values.email}
          onChange={verifyFormik.handleChange}
          onBlur={verifyFormik.handleBlur}
          error={verifyFormik.touched.email && verifyFormik.errors.email ? verifyFormik.errors.email : undefined}
          autoComplete="email"
          disabled
        />

        <Input
          type="text"
          name="otp"
          placeholder="Nhập mã OTP"
          value={verifyFormik.values.otp}
          onChange={verifyFormik.handleChange}
          onBlur={verifyFormik.handleBlur}
          error={verifyFormik.touched.otp && verifyFormik.errors.otp ? verifyFormik.errors.otp : undefined}
          maxLength={6}
          helperText="Nhập mã gồm 6 chữ số đã được gửi đến email của bạn"
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
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
        <button
          type="button"
          onClick={() => setStep("register")}
          className="text-gray-400 text-sm hover:text-white transition"
        >
          ← Quay lại đăng ký
        </button>
      </div>
    </AuthCard>
  );
}
