import AuthLayout from "./components/AuthLayout";
import LoginForm from "@/features/auth/login/components/LoginForm";

export default function Page() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
