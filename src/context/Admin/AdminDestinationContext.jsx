import React, { createContext, useContext, useState } from "react";
import { apiGetAllDestination } from "../../services/destinationService";

const AdminDestinationContext = createContext();

export const useAdminDestinationContext = () => {
  return useContext(AdminDestinationContext);
};

const AdminDestinationContextProvider = ({ children }) => {
  const [allDestination, setAllDestination] = useState([]);

  const [destinationData, setDestinationData] = useState([]);
  const [destModalData, setDestModalData] = useState({});

  const getAllDestination = async () => {
    try {
      const response = await apiGetAllDestination();

      const sortedResult = response.result.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );

      setAllDestination(sortedResult);
    } catch (error) {
      console.log(error);
    }
  };

  const updateDestinationData = (partial) => {
    setDestinationData((prev) => ({
      ...prev,
      ...partial,
    }));
  };
  const updateDestinationModalData = (partial) => {
    setDestModalData((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  const value = {
    destModalData,
    updateDestinationModalData,
    destinationData,
    allDestination,
    setDestinationData,
    updateDestinationData,
    getAllDestination,
  };

  return (
    <AdminDestinationContext.Provider value={value}>
      {children}
    </AdminDestinationContext.Provider>
  );
};

export default AdminDestinationContextProvider;
