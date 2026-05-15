import AuthLayout from "./components/AuthLayout";
import LoginForm from "@/features/auth/components/login/components/LoginForm";

export default function Page() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
