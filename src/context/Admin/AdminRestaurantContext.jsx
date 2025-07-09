import React, { createContext, useContext, useState } from "react";
import { apiGetAllRestaurant } from "../../services/restaurantService";

const AdminRestaurantContext = createContext();

export const useAdminRestaurantContext = () => {
  return useContext(AdminRestaurantContext);
};

const AdminRestaurantContextProvider = ({ children }) => {
  const [allRestaurant, setAllRestaurant] = useState([]);

  const [restaurantData, setRestaurantData] = useState({
    id: "",
    resto_name: "",
    packages: [],
  });

  const getAllRestaurant = async () => {
    try {
      const response = await apiGetAllRestaurant();

      setAllRestaurant(response.result);
    } catch (error) {
      console.log(error);
    }
  };

  const updateRestaurantData = (partial) => {
    setRestaurantData((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  const value = {
    restaurantData,
    allRestaurant,
    setRestaurantData,
    updateRestaurantData,
    getAllRestaurant,
  };

  return (
    <AdminRestaurantContext.Provider value={value}>
      {children}
    </AdminRestaurantContext.Provider>
  );
};

export default AdminRestaurantContextProvider;
