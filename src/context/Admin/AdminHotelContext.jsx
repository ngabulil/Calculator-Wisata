import React, { createContext, useContext, useState } from "react";
import {
  apiGetAllHotel,
  apiGetAllHotelRooms,
} from "../../services/hotelService";

const AdminHotelContext = createContext();

export const useAdminHotelContext = () => {
  return useContext(AdminHotelContext);
};

const AdminHotelContextProvider = ({ children }) => {
  const [allHotel, setAllHotel] = useState([]);
  const [roomTypeSelect, SetRoomTypeSelect] = useState([]);
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

  const getAllHotel = async () => {
    try {
      const response = await apiGetAllHotel();

      setAllHotel(response.result);
      return response.result;
    } catch (error) {
      console.log(error);
    }
  };

  const getRoomTypeSelect = async (id_hotel) => {
    try {
      const response = await apiGetAllHotelRooms();

      const roomType = response.result.filter(
        (room) => room.id_hotel === id_hotel
      );

      SetRoomTypeSelect(roomType);
      return response.result;
    } catch (error) {
      console.log(error); // Added error logging
    }
  };

  const updateHotelData = (partial) => {
    setHotelData((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  const value = {
    hotelData,
    allHotel,
    roomTypeSelect,
    setHotelData,
    updateHotelData,
    getAllHotel,
    getRoomTypeSelect,
  };

  return (
    <AdminHotelContext.Provider value={value}>
      {children}
    </AdminHotelContext.Provider>
  );
};

export default AdminHotelContextProvider;
