import ForgotPasswordForm from "../components/forgot-password/forgot-password-form";
import { AuthLayout } from "@/components/common";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
