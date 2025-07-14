import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AdminAuthContext = createContext();

export const useAdminAuthContext = () => {
  return useContext(AdminAuthContext);
};

const AdminAuthContextProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const savedToken = Cookies.get("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const updateUserData = (value) => {
    setUserData(value);
  };

  const updateToken = (value) => {
    setToken(value);
    Cookies.set("token", value, { expires: 7 });
  };
  const getToken = () => {
    return Cookies.get("token");
  };
  const updateRole = (value) => {
    setRole(value);
    Cookies.set("admin_role", value, { expires: 7 });
  };
  const getRole = () => {
    return setRole(Cookies.get("admin_role") || "");
  };

  const value = {
    token,
    role,
    userData,
    updateUserData,
    updateToken,
    updateRole,
    getToken,
    getRole,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContextProvider;
