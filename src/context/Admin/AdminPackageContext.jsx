import React from "react";

import {
  apiGetAllActivityVendor,
  apiGetAllDestination,
  apiGetAllPackageFull,
  apiGetAllRestaurant,
} from "../../services/packageService";

const AdminPackageContext = React.createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminPackageContext = () => {
  return React.useContext(AdminPackageContext);
};

const AdminPackageContextProvider = ({ children }) => {
  const [activities, setActivities] = React.useState([]);
  const [restaurant, setRestaurant] = React.useState([]);
  const [destination, setDestination] = React.useState([]);
  const [packageFull, setPackageFull] = React.useState([]);
  const [headline, setHeadline] = React.useState({
    name: "",
    description: "",
  });
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

  const updateHeadline = (name, description) => {
    setHeadline({ name, description });
  }

  // fetch functions

  const getAllPackageFull = async () => {
    try {
      const response = await apiGetAllPackageFull();
      setPackageFull(response.result);
    } catch (error) {
      console.log(error);
    }
  };

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
  const getAllDestination = async () => {
    try {
      const response = await apiGetAllDestination();
      setDestination(response.result);
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
    destination,
    packageFull,
    headline,
    updateHeadline,
    getAllDestination,
    getAllActivities,
    getAllRestaurant,
    getAllPackageFull,
  };

  return (
    <AdminPackageContext.Provider value={value}>
      {children}
    </AdminPackageContext.Provider>
  );
};

export default AdminPackageContextProvider;
