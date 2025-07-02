import React, { createContext, useContext, useState } from "react";

const AdminHotelContext = createContext();

export const useAdminHotelContext = () => {
  return useContext(AdminHotelContext);
};

const AdminHotelContextProvider = ({ children }) => {
  const [hotelData, setHotelData] = useState({
    hotelName: "",
    stars: "",
    roomType: "",
    photoLink: null,
    seasons: {
      normal: null,
      high: null,
      peak: null,
    },
    extrabed: "",
    contractUntil: "",
  });

  const updateHotelData = (partial) => {
    setHotelData((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  const value = {
    hotelData,
    setHotelData,
    updateHotelData,
  };

  return (
    <AdminHotelContext.Provider value={value}>
      {children}
    </AdminHotelContext.Provider>
  );
};

export default AdminHotelContextProvider;
