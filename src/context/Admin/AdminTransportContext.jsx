import React, { createContext, useContext, useState } from "react";
import { apiGetAllMobil } from "../../services/transport";

const AdminTransportContext = createContext();

export const useAdminTransportContext = () => {
  return useContext(AdminTransportContext);
};

const AdminTransportContextProvider = ({ children }) => {
  const [allTransport, setAllTransport] = useState([]);
  const [mobilModalData, setMobilModalData] = useState({});
  const [transportData, setTransportData] = useState([]);
  const [transportDraft, setTransportDraft] = useState({});

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

  const updateMobilModalData = (partial) => {
    setMobilModalData((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  const value = {
    transportData,
    transportDraft,
    setTransportDraft,
    mobilModalData,
    allTransport,
    setTransportData,
    updateTransportData,
    updateMobilModalData,
    getAllTransport,
  };

  return (
    <AdminTransportContext.Provider value={value}>
      {children}
    </AdminTransportContext.Provider>
  );
};

export default AdminTransportContextProvider;
