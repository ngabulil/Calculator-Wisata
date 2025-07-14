import React, { createContext, useContext, useState } from "react";
import { apiGetAllAdmin } from "../../services/adminService";

const AdminManageContext = createContext();

export const useAdminManageContext = () => {
  return useContext(AdminManageContext);
};

const AdminManageContextProvider = ({ children }) => {
  const [allAdminAccount, setAllAdminAccount] = useState([]);

  const [adminData, setAdminData] = useState([]);

  const getAllAdmin = async () => {
    try {
      const response = await apiGetAllAdmin();

      setAllAdminAccount(response.result);
    } catch (error) {
      console.log(error);
    }
  };

  const updateAdminData = (partial) => {
    setAdminData((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  const value = {
    adminData,
    allAdminAccount,
    setAdminData,
    updateAdminData,
    getAllAdmin,
  };

  return (
    <AdminManageContext.Provider value={value}>
      {children}
    </AdminManageContext.Provider>
  );
};

export default AdminManageContextProvider;
