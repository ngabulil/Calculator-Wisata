import React from "react";
import {
  apiGetAdditionalAkomodasi,
  apiGetAllHotel,
  apiGetAllVilla,
} from "../services/akomodasiService";

const AkomodasiContext = React.createContext();

export const useAkomodasiContext = () => {
  return React.useContext(AkomodasiContext);
};

const AkomodasiContextProvider = ({ children }) => {
  const [hotels, setHotels] = React.useState([]);
  const [villas, setVillas] = React.useState([]);
  const [additional, setAdditional] = React.useState([]);
  const [days, setDays] = React.useState([
    {
      id: 1,
      description: "",
      hotels: [],
      villas: [],
      additionalInfo: [],
      markup: { type: "percent", value: 0 },
    },
  ]);

  const updateDay = (index, updatedDay) => {
    setDays((prev) => {
      const newDays = [...prev];
      newDays[index] = { ...newDays[index], ...updatedDay };
      return newDays;
    });
  };
  const getHotels = async () => {
    try {
      const response = await apiGetAllHotel();
      setHotels(response.result);
    } catch (error) {
      console.log(error);
    }
  };
  const getVillas = async () => {
    try {
      const response = await apiGetAllVilla();
      setVillas(response.result);
    } catch (error) {
      console.log(error);
    }
  };
  const getAdditional = async () => {
    try {
      const response = await apiGetAdditionalAkomodasi();
      setAdditional(response.result);
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    hotels,
    villas,
    additional,
    setAdditional,
    getHotels,
    getVillas,
    getAdditional,
    days,
    setDays,
    updateDay,
  };

  return (
    <AkomodasiContext.Provider value={value}>
      {children}
    </AkomodasiContext.Provider>
  );
};

export default AkomodasiContextProvider;
