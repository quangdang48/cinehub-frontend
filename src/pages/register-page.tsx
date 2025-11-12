import RegisterForm from "../components/register/register-form";
import { AuthLayout } from "@/components/common";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
