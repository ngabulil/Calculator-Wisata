import React from "react";

import {
  apiGetAllActivityVendor,
  apiGetAllRestaurant,
} from "../../services/packageService";

const AdminPackageContext = React.createContext();

export const useAdminPackageContext = () => {
  return React.useContext(AdminPackageContext);
};

const AdminPackageContextProvider = ({ children }) => {
  const [activities, setActivities] = React.useState([]);
  const [restaurant, setRestaurant] = React.useState([]);
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

  // fetch functions

  const getAllActivities = async () => {
    try {
      const response = await apiGetAllActivityVendor();
      setActivities(response.result);
    } catch (error) {
      console.log(error);
    }
  };
  const getAllRestaurant = async () => {
    try {
      const response = await apiGetAllRestaurant();
      setRestaurant(response.result);
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    days,
    updateDay,
    setDays,
    activities,
    restaurant,
    getAllActivities,
    getAllRestaurant,
  };

  return (
    <AdminPackageContext.Provider value={value}>
      {children}
    </AdminPackageContext.Provider>
  );
};

export default AdminPackageContextProvider;
