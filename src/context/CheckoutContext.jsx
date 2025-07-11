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
    restaurants: 0,
    transports: 0,
    markup: 0,
  });
  const [dayTotals, setDayTotals] = useState([]);
  const { selectedPackage } = usePackageContext();

  useEffect(() => {
    if (!selectedPackage?.days) return;

    let totalHotels = 0;
    let totalVillas = 0;
    let totalAdditionals = 0;
    let totalRestaurants = 0;
    let totalTransports = 0;
    let totalMarkup = 0;
    const calculatedDayTotals = [];

    selectedPackage.days.forEach((day) => {
      // Calculate hotel total for this day
      const dayHotelTotal = (day.hotels || []).reduce(
        (sum, h) => sum + (h.jumlahKamar || 0) * (h.hargaPerKamar || 0) + 
        (h.useExtrabed ? (h.jumlahExtrabed || 0) * (h.hargaExtrabed || 0) : 0),
        0
      );

      // Calculate villa total for this day
      const dayVillaTotal = (day.villas || []).reduce(
        (sum, v) => sum + (v.jumlahKamar || 0) * (v.hargaPerKamar || 0) + 
        (v.useExtrabed ? (v.jumlahExtrabed || 0) * (v.hargaExtrabed || 0) : 0),
        0
      );

      // Calculate additional accommodation total for this day
      const dayAdditionalTotal = (day.akomodasi_additionals || []).reduce(
        (sum, a) => sum + (a.harga || 0) * (a.jumlah || 1),
        0
      );

      // Calculate restaurant total for this day
      const dayRestaurantTotal = (day.restaurants || []).reduce(
        (sum, r) => sum + (r?.harga || 0),
        0
      );

      // Calculate transport total for this day
      const dayMobilTotal = (day.mobils || []).reduce(
        (sum, m) => sum + (m?.harga || 0),
        0
      );
      const dayTransportAdditionalTotal = (day.transport_additionals || []).reduce(
        (sum, t) => sum + (t?.harga || 0) * (t?.jumlah || 1),
        0
      );
      const dayTransportTotal = dayMobilTotal + dayTransportAdditionalTotal;

      // Calculate subtotal for this day
      const daySubTotal = dayHotelTotal + dayVillaTotal + dayAdditionalTotal + 
                         dayRestaurantTotal + dayTransportTotal;

      // Calculate markup for this day
      const markup = day.markup || {};
      const dayMarkupTotal = markup.type === "percent" 
        ? ((markup.value || 0) * daySubTotal) / 100
        : (markup.value || 0);


      const dayTotal = daySubTotal + dayMarkupTotal;

      totalHotels += dayHotelTotal;
      totalVillas += dayVillaTotal;
      totalAdditionals += dayAdditionalTotal;
      totalRestaurants += dayRestaurantTotal;
      totalTransports += dayTransportTotal;
      totalMarkup += dayMarkupTotal;

      calculatedDayTotals.push(dayTotal);
    });

    setBreakdown({
      hotels: totalHotels,
      villas: totalVillas,
      additionals: totalAdditionals,
      restaurants: totalRestaurants,
      transports: totalTransports,
      markup: totalMarkup,
    });

    setDayTotals(calculatedDayTotals);
  }, [selectedPackage]);

  const grandTotal = breakdown.hotels + breakdown.villas + breakdown.additionals + 
                    breakdown.restaurants + breakdown.transports + breakdown.markup;

  const value = {
    breakdown,
    dayTotals,
    grandTotal,
    akomodasiTotal: breakdown.hotels + breakdown.villas + breakdown.additionals,
    transportTotal: breakdown.transports,
    restaurantTotal: breakdown.restaurants,
    tourTotal: 0, 
    setAkomodasiTotal: () => {}, 
    setTransportTotal: () => {}, 
    setTourTotal: () => {}, 
    setRestaurantTotal: () => {},
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

export default CheckoutContextProvider;