import React from "react";
import {
  apiGetAllAdditionalMobil,
  apiGetAllMobil,
} from "../services/transport";

const TransportContext = React.createContext();

export const useTransportContext = () => {
  return React.useContext(TransportContext);
};

const TransportContextProvider = ({ children }) => {
  const [mobils, setMobils] = React.useState([]);
  const [additional, setAdditional] = React.useState([]);
  const [days, setDays] = React.useState([
    {
      id: 1,
      description: "",
      mobils: [],
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
  const getMobils = async () => {
    try {
      const response = await apiGetAllMobil();
      setMobils(response.result);
      console.log(response.result);
    } catch (error) {
      console.log(error);
    }
  };
  const getAdditionalMobil = async () => {
    try {
      const response = await apiGetAllAdditionalMobil();
      setAdditional(response.result);
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    mobils,
    additional,
    days,
    updateDay,
    getMobils,
    getAdditionalMobil,
    setMobils,
    setAdditional,
    setDays,
  };

  return (
    <TransportContext.Provider value={value}>
      {children}
    </TransportContext.Provider>
  );
};

export default TransportContextProvider;
