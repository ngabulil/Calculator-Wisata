import React from "react";
import {
  apiGetAllMobil,
  apiGetAllAdditionalMobil,
} from "../../services/transport";
import {
  apiGetAllHotel,
  apiGetAllVilla,
  apiGetAdditionalAkomodasi,
} from "../../services/akomodasiService";

const AdminPackageContext = React.createContext();

export const useAdminPackageContext = () => {
  return React.useContext(AdminPackageContext);
};

const AdminPackageContextProvider = ({ children }) => {
  const [hotels, setHotels] = React.useState([]);
  const [villas, setVillas] = React.useState([]);
  const [akomodasiAdditional, setAkomodasiAdditional] = React.useState([]);
  const [mobils, setMobils] = React.useState([]);
  const [transportAdditional, setTransportAdditional] = React.useState([]);

  const [days, setDays] = React.useState([
    {
      name: "Hari 1 - Kedatangan dan Check-in",
      description_day:
        "Tiba di Bandara Ngurah Rai, check-in hotel, dan menikmati makan malam.",
      data: {
        akomodasi: {
          hotels: [],
          villas: [],
          additional: [],
        },
        tour: {
          destinations: [],
          activities: [],
          restaurants: [],
        },
        transport: {
          mobils: [],
          additional: [],
        },
      },
    },
  ]);

  const updateDay = (index, updatedDay) => {
    setDays((prev) => {
      const newDays = [...prev];
      newDays[index] = {
        ...newDays[index],
        ...updatedDay,
        data: {
          ...newDays[index].data,
          ...updatedDay.data,
        },
      };
      return newDays;
    });
  };

  // Fetch functions
  const getHotels = async () => {
    try {
      const res = await apiGetAllHotel();
      setHotels(res.result);
    } catch (err) {
      console.error(err);
    }
  };

  const getVillas = async () => {
    try {
      const res = await apiGetAllVilla();
      setVillas(res.result);
    } catch (err) {
      console.error(err);
    }
  };

  const getAkomodasiAdditional = async () => {
    try {
      const res = await apiGetAdditionalAkomodasi();
      setAkomodasiAdditional(res.result);
    } catch (err) {
      console.error(err);
    }
  };

  const getMobils = async () => {
    try {
      const res = await apiGetAllMobil();
      setMobils(res.result);
    } catch (err) {
      console.error(err);
    }
  };

  const getTransportAdditional = async () => {
    try {
      const res = await apiGetAllAdditionalMobil();
      setTransportAdditional(res.result);
    } catch (err) {
      console.error(err);
    }
  };

  const value = {
    hotels,
    villas,
    akomodasiAdditional,
    mobils,
    transportAdditional,
    days,
    updateDay,
    setDays,
    setHotels,
    setVillas,
    setAkomodasiAdditional,
    setMobils,
    setTransportAdditional,
    getHotels,
    getVillas,
    getAkomodasiAdditional,
    getMobils,
    getTransportAdditional,
  };

  return (
    <AdminPackageContext.Provider value={value}>
      {children}
    </AdminPackageContext.Provider>
  );
};

export default AdminPackageContextProvider;
