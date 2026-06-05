import ProtectedRoute from "../protect-router";
import TenantDashboard from "./dashboard/page";
import HomePage from "./home/page";

export default function Home() {
  return (
    <ProtectedRoute>
      <TenantDashboard />
    </ProtectedRoute>
  );
}
