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

  // Helper function untuk menghitung total tour per hari
  const calculateTourTotal = (day) => {
    const restaurantTotal = (day.restaurants || []).reduce((sum, resto) => {
      // Menggunakan hargaAdult dan hargaChild untuk perhitungan
      return sum + (resto.hargaAdult || 0) * (resto.jumlahAdult || 0) + (resto.hargaChild || 0) * (resto.jumlahChild || 0);
    }, 0);
    
    const destinationTotal = (day.destinations || []).reduce((sum, dest) => {
      // Menggunakan hargaAdult dan hargaChild untuk perhitungan
      return sum + (dest.hargaAdult || 0) * (dest.jumlahAdult || 0) + (dest.hargaChild || 0) * (dest.jumlahChild || 0);
    }, 0);
    
    
    const activityTotal = (day.activities || []).reduce((sum, activity) => {
      // Menggunakan hargaAdult dan hargaChild untuk perhitungan
      return sum + (activity.hargaAdult || 0) * (activity.jumlahAdult || 0) + (activity.hargaChild || 0) * (activity.jumlahChild || 0);
    }, 0);
    
    return restaurantTotal + destinationTotal + activityTotal;
  };

  // Helper function untuk menghitung markup per hari
  const calculateDayMarkup = (day, daySubTotal) => {
    const markup = day.markup || {};
    return markup.type === "percent" 
      ? ((markup.value || 0) * daySubTotal) / 100
      : (markup.value || 0);
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
    let totalMarkup = 0;
    const calculatedDayTotals = [];
    const calculatedDetailedBreakdown = [];

    selectedPackage.days.forEach((day, index) => {
      // Calculate totals for this day
      const dayHotelTotal = calculateHotelTotal(day.hotels);
      const dayVillaTotal = calculateVillaTotal(day.villas);
      const dayAdditionalTotal = calculateAdditionalTotal(day.akomodasi_additionals);
      const dayTransportTotal = calculateTransportTotal(day);
      const dayTourTotal = calculateTourTotal(day);
      
      // Calculate subtotal for this day (before markup)
      const daySubTotal = dayHotelTotal + dayVillaTotal + dayAdditionalTotal + 
                         dayTransportTotal + dayTourTotal;
      
      // Calculate markup for this day
      const dayMarkupTotal = calculateDayMarkup(day, daySubTotal);
      
      // Calculate total for this day
      const dayTotal = daySubTotal + dayMarkupTotal;

      // Add to overall totals
      totalHotels += dayHotelTotal;
      totalVillas += dayVillaTotal;
      totalAdditionals += dayAdditionalTotal;
      totalTransports += dayTransportTotal;
      totalTours += dayTourTotal;
      totalMarkup += dayMarkupTotal;

      calculatedDayTotals.push(dayTotal);
      
      // Store detailed breakdown for this day
      calculatedDetailedBreakdown.push({
        dayIndex: index,
        hotels: dayHotelTotal,
        villas: dayVillaTotal,
        additionals: dayAdditionalTotal,
        transports: dayTransportTotal,
        tours: dayTourTotal,
        markup: dayMarkupTotal,
        subtotal: daySubTotal,
        total: dayTotal,
      });
    });

    setBreakdown({
      hotels: totalHotels,
      villas: totalVillas,
      additionals: totalAdditionals,
      transports: totalTransports,
      tours: totalTours,
      markup: totalMarkup,
    });

    setDayTotals(calculatedDayTotals);
    setDetailedBreakdown(calculatedDetailedBreakdown);
  }, [selectedPackage]);

  // Calculate grand totals
  const akomodasiTotal = breakdown.hotels + breakdown.villas + breakdown.additionals;
  const transportTotal = breakdown.transports;
  const tourTotal = breakdown.tours;
  const grandTotal = akomodasiTotal + transportTotal + tourTotal + breakdown.markup;

  const value = {
    breakdown,
    dayTotals,
    detailedBreakdown,
    grandTotal,
    akomodasiTotal,
    transportTotal,
    tourTotal,
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