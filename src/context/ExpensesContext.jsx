import React from "react";
import { usePackageContext } from "./PackageContext";
import { useAkomodasiContext } from "./AkomodasiContext";
import { useTransportContext } from "./TransportContext";
// import { useTourContext } from "./TourContext";
import {
    apiGetAllActivity,
    apiGetAllRestaurant,
    apiGetAllTiketMasuk 
} from "../services/calculator/tour";
import {
  calculatePackageHotelTotal,
  calculatePackageTransportTotal,
  calculatePackageTotalPrice,
  calculatePackageTourTotal,
} from "../utils/comparisonCalculate";

const ExpensesContext = React.createContext();

export const useExpensesContext = () => {
  return React.useContext(ExpensesContext);
};

const ExpensesContextProvider = ({ children }) => {
  const [days, setDays] = React.useState([
    {
      id: 1,
      day_name: "Day 1",
      day_description: "",
      totals: [],
    },
  ]);

  const { selectedPackage } = usePackageContext();
  const { hotels, villas } = useAkomodasiContext();
  const { mobils, additional } = useTransportContext();
  const [destinasiData, setDestinasiData] = React.useState([]);
    const [activitesData, setActivitesData] = React.useState([]);
    const [restaurantsData, setRestaurantsData] = React.useState([]);
  const [comparisonPackages, setComparisonPackages] = React.useState([]);
  

   React.useEffect(() => {
        const fetchTourData = async () => {
            try {
                const destinasiResponse = await apiGetAllTiketMasuk();
                setDestinasiData(destinasiResponse.result);
                
                const activityResponse = await apiGetAllActivity();
                setActivitesData(activityResponse.result);
                
                const restaurantResponse = await apiGetAllRestaurant();
                setRestaurantsData(restaurantResponse.result);
            } catch (error) {
                console.error("Gagal mengambil data tur:", error);
            }
        };

        fetchTourData();
    }, []);

  React.useEffect(() => {
    if (
      (hotels && hotels.length > 0) ||
      (villas && villas.length > 0) ||
      (mobils && mobils.length > 0) ||
      (destinasiData && destinasiData.length > 0) ||
      (activitesData && activitesData.length > 0) ||
      (restaurantsData && restaurantsData.length > 0)
    ) {
      setComparisonPackages((prev) =>
        prev.map((pkg) => {
          const newCalculatedPrice = calculatePackageTotalPriceWrapper(pkg);
          return {
            ...pkg,
            totalPrice: newCalculatedPrice,
          };
        })
      );
    }
  }, [
    hotels,
    villas,
    mobils,
    destinasiData,
    activitesData,
    restaurantsData,
    additional,
  ]);

  const updateDay = (index, updatedDay) => {
    setDays((prev) => {
      const newDays = [...prev];
      newDays[index] = { ...newDays[index], ...updatedDay };
      return newDays;
    });
  };

  const addDay = () => {
    setDays((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        day_name: `Day ${prev.length + 1}`,
        day_description: "",
        totals: [],
      },
    ]);
  };

  const removeDay = (index) => {
    setDays((prev) => {
      const newDays = prev.filter((_, i) => i !== index);
      return newDays.map((day, i) => ({
        ...day,
        id: i + 1,
        day_name: `Day ${i + 1}`,
      }));
    });
  };

  const updateDayDescription = (dayIndex, description) => {
    setDays((prev) => {
      const newDays = [...prev];
      newDays[dayIndex] = {
        ...newDays[dayIndex],
        day_description: description,
      };
      return newDays;
    });
  };

  const addExpenseItem = (dayIndex) => {
    let newItemIndex;
    setDays((prev) => {
      const newDays = [...prev];
      newItemIndex = newDays[dayIndex].totals.length;
      newDays[dayIndex].totals.push({
        label: "",
        description: "",
        price: null,
        adultPrice: null,
        childPrice: null,
        quantity: 1,
        unit: "item",
        isEditing: true,
      });
      return newDays;
    });
    return newItemIndex;
  };

  const removeExpenseItem = (dayIndex, itemIndex) => {
    setDays((prev) => {
      const newDays = [...prev];
      newDays[dayIndex].totals = newDays[dayIndex].totals.filter(
        (_, i) => i !== itemIndex
      );
      return newDays;
    });
  };

  const updateExpenseItem = (dayIndex, itemIndex, key, value) => {
    setDays((prev) => {
      const newDays = [...prev];
      newDays[dayIndex].totals[itemIndex] = {
        ...newDays[dayIndex].totals[itemIndex],
        [key]: value,
      };
      return newDays;
    });
  };

  const addComparisonPackage = (pkg) => {
    setComparisonPackages((prev) => {
      if (prev.length >= 6) return prev;
      return [...prev, { ...pkg, calculatedPrice: 0 }];
    });
  };

  const removeComparisonPackage = (index) => {
    setComparisonPackages((prev) => prev.filter((_, i) => i !== index));
  };

const updateComparisonPackage = (index, pkg) => {
    setComparisonPackages((prev) => {
      const updated = [...prev];
      const calculatedPrice = calculatePackageTotalPriceWrapper(pkg);
      updated[index] = { ...pkg, calculatedPrice };
      return updated;
    });
};

  const calculateDayTotal = (dayIndex) => {
    const day = days[dayIndex];
    if (!day || !day.totals) return 0;

    const totalAdult = selectedPackage?.totalPaxAdult || 0;
    const totalChild = selectedPackage?.totalPaxChildren || 0;

    return day.totals.reduce((total, item) => {
      if (item.adultPrice !== null || item.childPrice !== null) {
        const adultTotal = (item.adultPrice || 0) * totalAdult;
        const childTotal = (item.childPrice || 0) * totalChild;
        return total + adultTotal + childTotal;
      }

      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return total + price * quantity;
    }, 0);
  };

  const calculateGrandTotal = () => {
    return days.reduce((total, _, dayIndex) => {
      return total + calculateDayTotal(dayIndex);
    }, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Wrapper functions that use the imported helpers with current context data
  const calculatePackageHotelTotalWrapper = (packageData) => {
    return calculatePackageHotelTotal(packageData, hotels, villas);
  };

  const calculatePackageTransportTotalWrapper = (packageData) => {
    return calculatePackageTransportTotal(packageData, mobils);
  };

  const calculatePackageTourTotalWrapper = (packageData) => {
    return calculatePackageTourTotal(
      packageData,
      destinasiData,
      activitesData,
      restaurantsData
    );
  };

    const calculatePackageTotalPriceWrapper = (packageData) => {
    return calculatePackageTotalPrice(
      packageData,
      hotels,
      villas,
      mobils,
      destinasiData,
      activitesData,
      restaurantsData
    );
  };

  return (
    <ExpensesContext.Provider
      value={{
        days,
        setDays,
        updateDay,
        addDay,
        removeDay,
        updateDayDescription,
        addExpenseItem,
        removeExpenseItem,
        updateExpenseItem,
        calculateDayTotal,
        calculateGrandTotal,
        formatCurrency,
        addComparisonPackage,
        removeComparisonPackage,
        updateComparisonPackage,
        comparisonPackages,
        calculatePackageTotalPrice: calculatePackageTotalPriceWrapper,
        calculatePackageTransportTotal: calculatePackageTransportTotalWrapper,
        calculatePackageHotelTotal: calculatePackageHotelTotalWrapper,
        calculatePackageTourTotal: calculatePackageTourTotalWrapper, 
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};

export default ExpensesContextProvider;
