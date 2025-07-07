import React, { createContext, useContext, useState } from "react";
import { apiGetAllVilla } from "../../services/akomodasiService";
import { apiGetAllVillaRooms } from "../../services/villaService";

const AdminVillaContext = createContext();

export const useAdminVillaContext = () => {
  return useContext(AdminVillaContext);
};

const AdminVillaContextProvider = ({ children }) => {
  const [roomTypeSelect, SetRoomTypeSelect] = useState([]);
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

  const getAllVilla = async () => {
    try {
      const response = await apiGetAllVilla();

      return response.result;
    } catch (error) {
      console.log(error);
    }
  };

  const getRoomTypeSelect = async (id_villa) => {
    try {
      const response = await apiGetAllVillaRooms();

      const roomType = response.result.filter(
        (room) => room.id_villa === id_villa
      );

      SetRoomTypeSelect(roomType);
      return response.result;
    } catch (error) {
      console.log(error); // Added error logging
    }
  };

  const getVilla = async (id_villa) => {
    try {
      const response = await apiGetAllVilla();

      const villa = response.result.find((villa) => villa.id === id_villa);

      setVillaData(villa);
      return response.result;
    } catch (error) {
      console.log(error);
    }
  };

  const updateVillaData = (partial) => {
    setVillaData((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  const value = {
    villaData,
    getVilla,
    roomTypeSelect,
    setVillaData,
    updateVillaData,
    getRoomTypeSelect,
    getAllVilla,
  };

  return (
    <AdminVillaContext.Provider value={value}>
      {children}
    </AdminVillaContext.Provider>
  );
};

export default AdminVillaContextProvider;
