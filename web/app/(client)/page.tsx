import ProtectedRoute from "../protect-router";
import HomePage from "./home/page";

export default function Home() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}
