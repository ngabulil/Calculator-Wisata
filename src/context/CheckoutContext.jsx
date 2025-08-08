import { createContext, useContext, useState, useEffect } from 'react';
import { usePackageContext } from './PackageContext';

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
  const [dayTotals, setDayTotals] = useState([]);
  const [detailedBreakdown, setDetailedBreakdown] = useState([]);
  
  // State untuk user markup input
  const [userMarkup, setUserMarkup] = useState({
    type: 'percent', // 'percent' atau 'fixed'
    value: 0
  });
  
  const { selectedPackage } = usePackageContext();

  // Helper function untuk menghitung total hotel per hari
  const calculateHotelTotal = (hotels = []) => {
    return hotels.reduce((sum, hotel) => {
      const roomCost = (hotel.jumlahKamar || 0) * (hotel.hargaPerKamar || 0);
      const extrabedCost = hotel.useExtrabed ? 
        (hotel.jumlahExtrabed || 0) * (hotel.hargaExtrabed || 0) : 0;
      return sum + roomCost + extrabedCost;
    }, 0);
  };

  // Helper function untuk menghitung total villa per hari
  const calculateVillaTotal = (villas = []) => {
    return villas.reduce((sum, villa) => {
      const roomCost = (villa.jumlahKamar || 0) * (villa.hargaPerKamar || 0);
      const extrabedCost = villa.useExtrabed ? 
        (villa.jumlahExtrabed || 0) * (villa.hargaExtrabed || 0) : 0;
      return sum + roomCost + extrabedCost;
    }, 0);
  };

  // Helper function untuk menghitung total additional accommodation
  const calculateAdditionalTotal = (additionals = []) => {
    return additionals.reduce((sum, item) => {
      return sum + (item.harga || 0) * (item.jumlah || 1);
    }, 0);
  };

  // Helper function untuk menghitung total transport per hari
  const calculateTransportTotal = (day) => {
    const mobilTotal = (day.mobils || []).reduce((sum, mobil) => {
      return sum + (mobil.harga || 0);
    }, 0);
    
    const additionalTransportTotal = (day.transport_additionals || []).reduce((sum, item) => {
      return sum + (item.harga || 0) * (item.jumlah || 1);
    }, 0);
    
    return mobilTotal + additionalTransportTotal;
  };

  const calculateTourTotal = (day) => {
    const tours = day.tours || day.tour || [];

    return tours.reduce((sum, item) => {
      if (item.jenis_wisatawan) {
        const adultPrice = item.hargaAdult || 0;
        const childPrice = item.hargaChild || 0;
        const adultCount = item.jumlahAdult || 0;
        const childCount = item.jumlahChild || 0;
        
        return sum + (adultPrice * adultCount) + (childPrice * childCount);
      }
      if (item.harga && item.jumlah) {
        return sum + (item.harga * item.jumlah);
      }
      
      return sum;
    }, 0);
  };

  const calculateUserMarkup = (subtotal) => {
    if (!userMarkup.value || userMarkup.value <= 0) return 0;
    
    if (userMarkup.type === 'percent') {
      return (subtotal * userMarkup.value) / 100;
    } else {
      return userMarkup.value;
    }
  };

  // Function untuk update user markup
  const updateUserMarkup = (type, value) => {
    const numericValue = parseFloat(value) || 0;
    setUserMarkup({ type, value: numericValue });
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
      const dayAdditionalTotal = calculateAdditionalTotal(day.akomodasi_additionals);
      const dayTransportTotal = calculateTransportTotal(day);
      const dayTourTotal = calculateTourTotal(day);

      const daySubTotal = dayHotelTotal + dayVillaTotal + dayAdditionalTotal + 
                         dayTransportTotal + dayTourTotal;
      
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
  }, [selectedPackage, userMarkup]); 

  const akomodasiTotal = breakdown.hotels + breakdown.villas + breakdown.additionals;
  const transportTotal = breakdown.transports;
  const tourTotal = breakdown.tours;

  const subtotalBeforeUserMarkup = akomodasiTotal + transportTotal + tourTotal;
  const userMarkupAmount = calculateUserMarkup(subtotalBeforeUserMarkup);
  const totalMarkup = userMarkupAmount * selectedPackage.totalPaxAdult;
  const grandTotal = subtotalBeforeUserMarkup + (userMarkupAmount * selectedPackage.totalPaxAdult || 1);

  const value = {
    breakdown,
    dayTotals,
    detailedBreakdown,
    grandTotal,
    akomodasiTotal,
    transportTotal,
    tourTotal,
    userMarkup,
    userMarkupAmount,
    totalMarkup,
    subtotalBeforeUserMarkup,
    updateUserMarkup,
    calculateHotelTotal,
    calculateVillaTotal,
    calculateAdditionalTotal,
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