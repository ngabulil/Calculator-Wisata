import React from "react";
import {
  apiGetAllActivity,
  apiGetAllRestaurant,
  apiGetAllTiketMasuk,
} from "../services/calculator/tour";

const TourContext = React.createContext();

export const useTourContext = () => React.useContext(TourContext);

const TourContextProvider = ({ children }) => {
  const [activitesData, setActivitesData] = React.useState([]);
  const [restaurantsData, setRestaurantsData] = React.useState([]);
  const [tiketsData, setTicketsData] = React.useState([]);

  const getActivites = async () => {
    try {
      const response = await apiGetAllActivity();
      setActivitesData(response.result);
    } catch (error) {
      console.log(error);
    }
  };
  const getRestaurants = async () => {
    try {
      const response = await apiGetAllRestaurant();
      setRestaurantsData(response.result);
    } catch (error) {
      console.log(error);
    }
  };
  const getTickets = async () => {
    try {
      const response = await apiGetAllTiketMasuk();
      setTicketsData(response.result);
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    activitesData,
    getActivites,
    restaurantsData,
    getRestaurants,
    tiketsData,
    getTickets,
  };

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
};

export default TourContextProvider;
