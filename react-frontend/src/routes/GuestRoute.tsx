
import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import Header from "@/pages/layout/header";

export default function GuestRoute() {
  const token = useSelector((state) => state.auth.token);

  if (token) {
    return <Navigate to="/dashboard/order" replace />;
  }

  return <div className="min-h-screen">
    <Header />
    <Outlet />
  </div>
}

