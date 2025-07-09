import React, { createContext, useContext, useState } from "react";
import { apiGetAllMobil } from "../../services/transport";

const AdminTransportContext = createContext();

export const useAdminTransportContext = () => {
  return useContext(AdminTransportContext);
};

const AdminTransportContextProvider = ({ children }) => {
  const [allTransport, setAllTransport] = useState([]);

  const [transportData, setTransportData] = useState([]);

  const getAllTransport = async () => {
    try {
      const response = await apiGetAllMobil();

      setAllTransport(response.result);
    } catch (error) {
      console.log(error);
    }
  };

  const updateTransportData = (partial) => {
    setTransportData((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  const value = {
    transportData,
    allTransport,
    setTransportData,
    updateTransportData,
    getAllTransport,
  };

  return (
    <AdminTransportContext.Provider value={value}>
      {children}
    </AdminTransportContext.Provider>
  );
};

export default AdminTransportContextProvider;
