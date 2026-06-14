import ProtectedRoute from "../protect-router";
import TenantDashboard from "./dashboard/page";

export default function Home() {
  return (
    <ProtectedRoute>
      <TenantDashboard />
    </ProtectedRoute>
  );
}
