import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { apiGetUser } from "../../services/adminService";
import toastConfig from "../../utils/toastConfig";
import { useAdminAuthContext } from "../../context/AuthContext";

const RequireAuth = ({ children }) => {
  const toast = useToast();
  const { updateUserData, updateRole, token } = useAdminAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiGetUser(token);
        if (res.status === 200) {
          updateUserData(res.result);
          updateRole(res.result.role);
          setIsAuthenticated(true);
        } else {
          toast(toastConfig("Error", "Failed to fetch admin users", "error"));
        }
      } catch (error) {
        toast(toastConfig("Error", "Invalid Token", "error"));
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) return null;

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

  return children;
};

export default RequireAuth;
