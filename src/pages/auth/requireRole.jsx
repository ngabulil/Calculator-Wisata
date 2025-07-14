import { useEffect } from "react";
import { useAdminAuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const RequireRole = ({ children, allow }) => {
  const { role, getRole } = useAdminAuthContext();

  useEffect(() => {
    getRole();
  }, []);

  if (!role) return null;

  if (!allow.includes(role)) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default RequireRole;
