import { Navigate } from "react-router-dom";
import { getToken, getRole } from "../utils/storage";

export default function RequireAuth({ children, role }) {

  const token = getToken();
  const userRole = getRole();

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Wrong role
  if (role && userRole !== role) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Allowed
  return children;
}

