import { createContext, useContext, useState, useEffect } from "react";
import { usePackageContext } from "./PackageContext";

const CheckoutContext = createContext();

export const useCheckoutContext = () => {
  return useContext(CheckoutContext);
};

const CheckoutContextProvider = ({ children }) => {
  const [breakdown, setBreakdown] = useState({
    hotels: 0,
    villas: 0,
    additionals: 0,
    transports: 0,
    tours: 0,
    markup: 0,
  });
  const [childTotal, setChildTotal] = useState(0);
  const [extrabedTotal, setExtrabedTotal] = useState(0);
  const [adultPriceTotal, setAdultPriceTotal] = useState(0);
  const [childPriceTotal, setChildPriceTotal] = useState(0);
  const [child9Total, setChild9Total] = useState(0);
  const [dayTotals, setDayTotals] = useState([]);
  const [detailedBreakdown, setDetailedBreakdown] = useState([]);
  const [userMarkup, setUserMarkup] = useState({
    type: "percent",
    value: 0,
  });
  const [childMarkup, setChildMarkup] = useState({
    type: "percent",
    value: 0,
  });

  const { selectedPackage } = usePackageContext();

  const getExtrabedQty = (item) => {
    if (item?.extrabedByTraveler && typeof item.extrabedByTraveler === "object") {
      return Object.values(item.extrabedByTraveler).reduce((acc, eb) => {
        return acc + (eb?.use ? (Number(eb.qty) || 0) : 0);
      }, 0);
    }
    return item?.useExtrabed ? (Number(item.jumlahExtrabed) || 0) : 0;
  };

  const calculateHotelTotal = (hotels = []) => {
    return hotels.reduce((sum, hotel) => {
      const roomCost = (Number(hotel.jumlahKamar) || 0) * (Number(hotel.hargaPerKamar) || 0);
      const extrabedCost = getExtrabedQty(hotel) * (Number(hotel.hargaExtrabed) || 0);
      return sum + roomCost + extrabedCost;
    }, 0);
  };

  const calculateVillaTotal = (villas = []) => {
    return villas.reduce((sum, villa) => {
      const roomCost = (Number(villa.jumlahKamar) || 0) * (Number(villa.hargaPerKamar) || 0);
      const extrabedCost = getExtrabedQty(villa) * (Number(villa.hargaExtrabed) || 0);
      return sum + roomCost + extrabedCost;
    }, 0);
  };

const calculateAkomodasiTotal = (days = selectedPackage?.days || []) => {
  return days.reduce((sum, day) => {
    const hotelTotal = calculateHotelTotal(day.hotels);
    const villaTotal = calculateVillaTotal(day.villas);

   let groupAdditionalTotal = 0;
    if (day.akomodasi_additionalsByTraveler && typeof day.akomodasi_additionalsByTraveler === "object") {
      Object.keys(day.akomodasi_additionalsByTraveler).forEach(travelerType => {
        const akomodasiArr = day.akomodasi_additionalsByTraveler[travelerType];
        if (Array.isArray(akomodasiArr)) {
          groupAdditionalTotal += akomodasiArr.reduce((acc, item) => {
            return acc + (Number(item.harga) || 0) * (Number(item.jumlah) || 1);
          }, 0);
        }
      });
    }
    return sum + hotelTotal + villaTotal + groupAdditionalTotal ;
  }, 0);
};

const calculateAdditionalTotal = (day) => {
  let akomodasiAdditionalTotal = 0;
  let transportAdditionalTotal = 0;

  if (day.akomodasi_additionalsByTraveler && typeof day.akomodasi_additionalsByTraveler === "object") {
    Object.keys(day.akomodasi_additionalsByTraveler).forEach(travelerType => {
      const akomodasiArr = day.akomodasi_additionalsByTraveler[travelerType];
      if (Array.isArray(akomodasiArr)) {
        akomodasiAdditionalTotal += akomodasiArr.reduce((acc, item) => {
          return acc + (Number(item.harga) || 0) * (Number(item.jumlah) || 1);
        }, 0);
      }
    });
  }

  if (day.transport_additionals_by_group && typeof day.transport_additionals_by_group === "object") {
    Object.keys(day.transport_additionals_by_group).forEach(travelerType => {
      const transportArr = day.transport_additionals_by_group[travelerType];
      if (Array.isArray(transportArr)) {
        transportAdditionalTotal += transportArr.reduce((acc, item) => {
          return acc + (Number(item.harga) || 0) * (Number(item.jumlah) || 1);
        }, 0);
      }
    });
  }


  return akomodasiAdditionalTotal + transportAdditionalTotal;
};

const calculateTransportTotal = (day) => {
  const mobilTotal = (day.mobils || []).reduce((sum, mobil) => {
    return sum + (Number(mobil.harga) || 0);
  }, 0);

  let groupAdditionalTotal = 0;
  if (day.transport_additionals_by_group && typeof day.transport_additionals_by_group === "object") {
    Object.keys(day.transport_additionals_by_group).forEach(travelerType => {
      const transportArr = day.transport_additionals_by_group[travelerType];
      if (Array.isArray(transportArr)) {
        groupAdditionalTotal += transportArr.reduce((acc, item) => {
          return acc + (Number(item.harga) || 0) * (Number(item.jumlah) || 1);
        }, 0);
      }
    });
  }

  return mobilTotal + groupAdditionalTotal;
};

  const calculateTourTotal = (day) => {
    const tours = day.tours || day.tour || [];

    return tours.reduce((sum, item) => {
      if (item.jenis_wisatawan) {
        const adultPrice = Number(item.hargaAdult) || 0;
        const childPrice = Number(item.hargaChild) || 0;
        const adultCount = Number(item.quantities?.adult) || 0;

        const childCount = Object.entries(item.quantities || {})
          .filter(([key]) => key !== 'adult')
          .reduce((acc, [, val]) => acc + (Number(val) || 0), 0);

        return sum + adultPrice * adultCount + childPrice * childCount;
      }
      if (item.harga && item.jumlah) {
        return sum + (Number(item.harga) || 0) * (Number(item.jumlah) || 0);
      }
      return sum;
    }, 0);
  };

  const calculateUserMarkup = (subtotal) => {
    if (!userMarkup.value || userMarkup.value <= 0) return 0;

    if (userMarkup.type === "percent") {
      return (subtotal * userMarkup.value) / 100;
    } else {
      return userMarkup.value;
    }
  };

  const calculateChildMarkup = (subtotalChild) => {
    if (!childMarkup.value || childMarkup.value <= 0) return 0;

    if (childMarkup.type === "percent") {
      return (subtotalChild * childMarkup.value) / 100;
    } else {
      return childMarkup.value;
    }
  };

  const updateUserMarkup = (type, value) => {
    const numericValue = parseFloat(value) || 0;
    setUserMarkup({ type, value: numericValue });
  };

  const updateChildMarkup = (type, value) => {
    const numericValue = parseFloat(value) || 0;
    setChildMarkup({ type, value: numericValue });
  };

  useEffect(() => {
    if (!selectedPackage?.days) {
      setBreakdown({ hotels: 0, villas: 0, additionals: 0, transports: 0, tours: 0, markup: 0 });
      setDayTotals([]);
      setDetailedBreakdown([]);
      setChildTotal(0);
      setExtrabedTotal(0);
      setAdultPriceTotal(0);
      setChildPriceTotal(0);
      return;
    }

    let totals = { hotels: 0, villas: 0, additionals: 0, transports: 0, tours: 0 };
    const dayTotals = [];
    const detailedBreakdown = [];

    selectedPackage.days.forEach((day, index) => {
      const dayHotels = calculateHotelTotal(day.hotels);
      const dayVillas = calculateVillaTotal(day.villas);
      const dayAdditionals = calculateAdditionalTotal(day);
      const dayTransports = calculateTransportTotal(day);
      const dayTours = calculateTourTotal(day);

      const dayTotal = dayHotels + dayVillas + dayAdditionals + dayTransports + dayTours;

      totals.hotels += dayHotels;
      totals.villas += dayVillas;
      totals.additionals += dayAdditionals;
      totals.transports += dayTransports;
      totals.tours += dayTours;

      dayTotals.push(dayTotal);
      detailedBreakdown.push({
        dayIndex: index,
        hotels: dayHotels,
        villas: dayVillas,
        additionals: dayAdditionals,
        transports: dayTransports,
        tours: dayTours,
        subtotal: dayTotal,
        total: dayTotal,
      });
    });

    setBreakdown({ ...totals, markup: 0 });
    setDayTotals(dayTotals);
    setDetailedBreakdown(detailedBreakdown);
  }, [selectedPackage, userMarkup]);

  // Calculated values
  const akomodasiTotal = breakdown.hotels + breakdown.villas + breakdown.additionals;
  const transportTotal = breakdown.transports;
  const tourTotal = breakdown.tours;
  const hotelVilla = calculateAkomodasiTotal(selectedPackage?.days || []);
  const subtotalBeforeUserMarkup = hotelVilla + transportTotal + tourTotal;

  const totalAdult = selectedPackage?.totalPaxAdult && selectedPackage.totalPaxAdult > 0 ? selectedPackage.totalPaxAdult : 1;
  const chidGroups = selectedPackage?.childGroups || []; 
  const totalChildren = chidGroups.reduce((total, group) => total + group.total, 0);

  const userMarkupAmount = calculateUserMarkup(subtotalBeforeUserMarkup);
  const totalMarkup = userMarkupAmount * totalAdult;
  const childMarkupAmount = calculateChildMarkup(childTotal);
  const totalMarkupChild = childMarkupAmount * totalChildren;
  const grandTotal = subtotalBeforeUserMarkup + totalMarkup + totalMarkupChild;

  const value = {
    breakdown,
    dayTotals,
    detailedBreakdown,
    grandTotal,
    akomodasiTotal,
    hotelVilla,
    transportTotal,
    tourTotal,
    childTotal,
    extrabedTotal,
    userMarkup,
    adultPriceTotal,
    childPriceTotal,
    userMarkupAmount,
    childMarkup,
    childMarkupAmount,
    totalMarkup,
    totalMarkupChild,
    subtotalBeforeUserMarkup,
    updateUserMarkup,
    updateChildMarkup,
    setAdultPriceTotal,
    setChildPriceTotal,
    setChild9Total,
    child9Total,
    calculateHotelTotal,
    calculateVillaTotal,
    calculateTransportTotal,
    calculateTourTotal,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

export default CheckoutContextProvider;