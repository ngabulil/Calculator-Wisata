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

  const calculateHotelTotal = (hotels = []) => {
    return hotels.reduce((sum, hotel) => {
      const roomCost = (hotel.jumlahKamar || 0) * (hotel.hargaPerKamar || 0);
      const extrabedCost = hotel.useExtrabed
        ? (hotel.jumlahExtrabed || 0) * (hotel.hargaExtrabed || 0)
        : 0;
      return sum + roomCost + extrabedCost;
    }, 0);
  };

  const calculateVillaTotal = (villas = []) => {
    return villas.reduce((sum, villa) => {
      const roomCost = (villa.jumlahKamar || 0) * (villa.hargaPerKamar || 0);
      const extrabedCost = villa.useExtrabed
        ? (villa.jumlahExtrabed || 0) * (villa.hargaExtrabed || 0)
        : 0;
      return sum + roomCost + extrabedCost;
    }, 0);
  };

  const calculateExtrabedTotal = (days = selectedPackage?.days || []) => {
    return days.reduce((sum, day) => {
      const hotelExtrabeds = (day.hotels || []).reduce((hotelSum, hotel) => {
        if (hotel.useExtrabed) {
          return hotelSum + ((hotel.jumlahExtrabed || 0) * (hotel.hargaExtrabed || 0));
        }
        return hotelSum;
      }, 0);

      const villaExtrabeds = (day.villas || []).reduce((villaSum, villa) => {
        if (villa.useExtrabed) {
          return villaSum + ((villa.jumlahExtrabed || 0) * (villa.hargaExtrabed || 0));
        }
        return villaSum;
      }, 0);

      return sum + hotelExtrabeds + villaExtrabeds;
    }, 0);
  };


  const calculateAdditionalTotal = (additionals = []) => {
    return additionals.reduce((sum, item) => {
      return sum + (item.harga || 0) * (item.jumlah || 1);
    }, 0);
  };

  const calculateTransportTotal = (day) => {
    const mobilTotal = (day.mobils || []).reduce((sum, mobil) => {
      return sum + (mobil.harga || 0);
    }, 0);

    const additionalTransportTotal = (day.transport_additionals || []).reduce(
      (sum, item) => {
        return sum + (item.harga || 0) * (item.jumlah || 1);
      },
      0
    );

    return mobilTotal + additionalTransportTotal;
  };

  const calculateAditionalChild = (days = []) => {
    const multiplier = selectedPackage?.totalPaxChildren;
    return days.reduce((sum, day) => {
      const dayTotal = [
        ...(day.akomodasi_additionals || []),
        ...(day.transport_additionals || []),
      ].reduce((subSum, item) => subSum + (item.harga || 0) * multiplier, 0);

      return sum + dayTotal;
    }, 0);
  };

  const calculateTourTotal = (day) => {
    const tours = day.tours || day.tour || [];

    return tours.reduce((sum, item) => {
      if (item.jenis_wisatawan) {
        const adultPrice = item.hargaAdult || 0;
        const childPrice = item.hargaChild || 0;
        const adultCount = item.jumlahAdult || 0;
        const childCount = item.jumlahChild || 0;

        return sum + adultPrice * adultCount + childPrice * childCount;
      }
      if (item.harga && item.jumlah) {
        return sum + item.harga * item.jumlah;
      }

      return sum;
    }, 0);
  };

  const calculateChildTotal = (days = selectedPackage?.days || []) => {
    return days.reduce((sum, day) => {
      const tours = day.tours || day.tour || [];
      return (
        sum +
        tours.reduce((tourSum, item) => {
          if (item.jenis_wisatawan) {
            const childPrice = item.hargaChild || 0;
            const childCount = item.jumlahChild || 0;
            return tourSum + childPrice * childCount;
          }
          return tourSum;
        }, 0)
      );
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

  const updateUserMarkup = (type, value) => {
    const numericValue = parseFloat(value) || 0;
    setUserMarkup({ type, value: numericValue });
  };

  const calculateChildMarkup = (subtotalChild) => {
    if (!childMarkup.value || childMarkup.value <= 0) return 0;

    if (childMarkup.type === "percent") {
      return (subtotalChild * childMarkup.value) / 100;
    } else {
      return childMarkup.value;
    }
  };

  const updateChildMarkup = (type, value) => {
    const numericValue = parseFloat(value) || 0;
    setChildMarkup({ type, value: numericValue });
  };

  useEffect(() => {
    if (!selectedPackage?.days) {
      setBreakdown({
        hotels: 0,
        villas: 0,
        additionals: 0,
        transports: 0,
        tours: 0,
        markup: 0,
      });
      setDayTotals([]);
      setDetailedBreakdown([]);
      setChildTotal(0);
      setExtrabedTotal(0);
      setAdultPriceTotal(0);
      setChildPriceTotal(0);
      return;
    }

    let totalHotels = 0;
    let totalVillas = 0;
    let totalAdditionals = 0;
    let totalTransports = 0;
    let totalTours = 0;
    const calculatedDayTotals = [];
    const calculatedDetailedBreakdown = [];

    selectedPackage.days.forEach((day, index) => {
      const dayHotelTotal = calculateHotelTotal(day.hotels);
      const dayVillaTotal = calculateVillaTotal(day.villas);
      const dayAdditionalTotal = calculateAdditionalTotal(
        day.akomodasi_additionals
      );
      const dayTransportTotal = calculateTransportTotal(day);
      const dayTourTotal = calculateTourTotal(day);

      const daySubTotal =
        dayHotelTotal +
        dayVillaTotal +
        dayAdditionalTotal +
        dayTransportTotal +
        dayTourTotal;

      totalHotels += dayHotelTotal;
      totalVillas += dayVillaTotal;
      totalAdditionals += dayAdditionalTotal;
      totalTransports += dayTransportTotal;
      totalTours += dayTourTotal;

      calculatedDayTotals.push(daySubTotal);

      calculatedDetailedBreakdown.push({
        dayIndex: index,
        hotels: dayHotelTotal,
        villas: dayVillaTotal,
        additionals: dayAdditionalTotal,
        transports: dayTransportTotal,
        tours: dayTourTotal,
        subtotal: daySubTotal,
        total: daySubTotal,
      });
    });

    setBreakdown({
      hotels: totalHotels,
      villas: totalVillas,
      additionals: totalAdditionals,
      transports: totalTransports,
      tours: totalTours,
      markup: 0,
    });

    setDayTotals(calculatedDayTotals);
    setDetailedBreakdown(calculatedDetailedBreakdown);
    const totalChild = calculateChildTotal(selectedPackage.days);
    setChildTotal(totalChild);
    const totalExtrabed = calculateExtrabedTotal(selectedPackage.days);
    setExtrabedTotal(totalExtrabed);
  }, [selectedPackage, userMarkup]);

  const akomodasiTotal =
    breakdown.hotels + breakdown.villas + breakdown.additionals;
  const transportTotal = breakdown.transports;
  const tourTotal = breakdown.tours;

  const subtotalBeforeUserMarkup = akomodasiTotal + transportTotal + tourTotal;
  const totalAdult =
    selectedPackage?.totalPaxAdult && selectedPackage.totalPaxAdult > 0
      ? selectedPackage.totalPaxAdult
      : 1;
  const totalChildren =
    selectedPackage?.totalPaxChildren && selectedPackage.totalPaxChildren > 0
      ? selectedPackage.totalPaxChildren
      : 0;
  const additionalChild = calculateAditionalChild(selectedPackage?.days || []);
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
    transportTotal,
    tourTotal,
    childTotal,
    extrabedTotal,
    userMarkup,
    adultPriceTotal,
    childPriceTotal,
    additionalChild,
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
    calculateAdditionalTotal,
    calculateTransportTotal,
    calculateTourTotal,
    calculateChildTotal,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

export default CheckoutContextProvider;
