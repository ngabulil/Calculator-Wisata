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
  const [onePackageFull, setOnePackageFull] = React.useState([]);
  const [packageDraft, setPackageDraft] = React.useState([]);
  const [headline, setHeadline] = React.useState({
    name: "",
    description: "",
  });
  const [days, setDays] = React.useState([
    {
      name: "",
      description_day: "",
      data: {
        akomodasi: {
          hotels: [],
          villas: [],
          additional: [],
        },
        tours: [],
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
  };

  const updatePackageFull = (data) => {
    setOnePackageFull(data);
  };

  const updatePackageDraft = (data) => {
    setPackageDraft(data);
  };

  // fetch functions

  const getAllPackageFull = async () => {
    try {
      const response = await apiGetAllPackageFull();

      const sortedWithDays = response.result.map((pkg) => ({
        ...pkg,
        days: (pkg.days?.sort((dayA, dayB) => dayA.id - dayB.id) || []).map(
          (day) => {
            // Urutkan tours sesuai nomor jika ada, kalau kosong pakai index
            const fixedTours = (day.data?.tours || []).map((tour, idx) => ({
              ...tour,
              no: tour.no && tour.no !== 0 ? tour.no : idx + 1,
            }));

            return {
              ...day,
              data: {
                ...day.data,
                tours: fixedTours,
              },
            };
          }
        ),
      }));

      setPackageFull(sortedWithDays);
      return sortedWithDays;
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
    packageDraft,
    updatePackageDraft,
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
    onePackageFull,
    updatePackageFull,
  };

  return (
    <AdminPackageContext.Provider value={value}>
      {children}
    </AdminPackageContext.Provider>
  );
};

export default AdminPackageContextProvider;
