import React, { createContext, useContext, useState } from "react";

const AdminVillaContext = createContext();

export const useAdminVillaContext = () => {
  return useContext(AdminVillaContext);
};

const AdminVillaContextProvider = ({ children }) => {
  const [villaData, setVillaData] = useState({
    villaName: "",
    stars: "",
    roomType: "",
    photoLink: null,
    seasons: {
      normal: null,
      high: null,
      peak: null,
    },
    honeymoonpackage: "",
    extrabed: "",
    contractUntil: "",
  });

  const updateVillaData = (partial) => {
    setVillaData((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  const value = {
    villaData,
    setVillaData,
    updateVillaData,
  };

  return (
    <AdminVillaContext.Provider value={value}>
      {children}
    </AdminVillaContext.Provider>
  );
};

export default AdminVillaContextProvider;
