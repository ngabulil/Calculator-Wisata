import { parseAndMergeDays } from './parseAndMergeDays';
import { roundPrice } from './roundPrice';


export const parseExpensesAccommodation = async (hotelItems, villaItems) => {
  try {
    const mockDaysForHotels = hotelItems.map((hotel, index) => ({
      id: `hotel-day-${index}`,
      name: `Hotel Day ${index + 1}`,
      hotels: [{ ...hotel }],
      villas: [],
      destinations: [],
      restaurants: [],
      activities: [],
    }));

    const mockDaysForVillas = villaItems.map((villa, index) => ({
      id: `villa-day-${index}`,
      name: `Villa Day ${index + 1}`,
      hotels: [],
      villas: [{ ...villa }],
      destinations: [],
      restaurants: [],
      activities: [],
    }));

    let parsedHotels = [];
    let parsedVillas = [];

    if (mockDaysForHotels.length > 0) {
      const mergedHotelDays = await parseAndMergeDays(mockDaysForHotels);
      parsedHotels = mergedHotelDays.flatMap(
        (day) =>
          day.hotels?.map((hotel) => ({
            name:
              hotel?.displayName ||
              hotel?.name ||
              hotel?.hotelName ||
              "Unknown Hotel",
            stars: hotel?.bintang || hotel?.star || hotel?.stars || "",
            roomType: hotel?.namaTipeKamar || "",
            price: (hotel?.jumlahKamar || 1) * (hotel?.hargaPerKamar || 0),
            extrabedPrice: hotel?.useExtrabed
              ? (hotel?.jumlahExtrabed || 0) * (hotel?.hargaExtrabed || 0)
              : 0,
            type: "Hotel",
            originalData: hotel,
            jumlahKamar: hotel?.jumlahKamar || 0,
          })) || []
      );
    }

    if (mockDaysForVillas.length > 0) {
      const mergedVillaDays = await parseAndMergeDays(mockDaysForVillas);
      parsedVillas = mergedVillaDays.flatMap(
        (day) =>
          day.villas?.map((villa) => ({
            name:
              villa?.displayName ||
              villa?.name ||
              villa?.villaName ||
              "Unknown Villa",
            stars:
              villa?.bintang || villa?.star_rating || villa?.star || "",
            roomType: villa?.namaTipeKamar || "",
            price: (villa?.jumlahKamar || 1) * (villa?.hargaPerKamar || 0),
            extrabedPrice: villa?.useExtrabed
              ? (villa?.jumlahExtrabed || 0) * (villa?.hargaExtrabed || 0)
              : 0,
            type: "Villa",
            originalData: villa,
            jumlahKamar: villa?.jumlahKamar || 0,
          })) || []
      );
    }

    return {
      hotels: parsedHotels,
      villas: parsedVillas,
    };
  } catch (error) {
    console.error("Error parsing expenses accommodation data:", error);
    return {
      hotels: [],
      villas: [],
    };
  }
};

export const getAccommodationNights = (packageDays) => {
  if (!packageDays || !Array.isArray(packageDays)) {
    return 0;
  }

  let nightsCount = 0;

  packageDays.forEach((day) => {
    const hasHotel =
      day.hotels && Array.isArray(day.hotels) && day.hotels.length > 0;
    const hasVilla =
      day.villas && Array.isArray(day.villas) && day.villas.length > 0;

    if (hasHotel || hasVilla) {
      nightsCount += 1;
    }
  });

  return nightsCount;
};

export const calculateFirstRowPrices = (
  selectedPackage,
  adultSubtotal,
  childSubtotal,
  userMarkupAmount,
  childMarkupAmount
) => {
  const childGroups = selectedPackage?.childGroups || [];
  const totalChild = childGroups.reduce((total, group) => total + group.total, 0);
  const adultPriceTotal = roundPrice(adultSubtotal + userMarkupAmount);
  
  const childPriceTotals = {};
  childGroups.forEach(group => {
    const basePrice = childSubtotal[group.id] || 0;
    childPriceTotals[group.id] = roundPrice(basePrice + childMarkupAmount);
  });

  return {
    adultPrice: adultPriceTotal,
    childPriceTotals,
    childGroups,
    totalChild
  };
};

export const calculateAlternativePrices = (
  accommodationPrice,
  extrabedPrice,
  selectedPackage,
  calculateTourAdultTotal,
  calculateAdditionalAdultTotal,
  calculateTransport,
  calculateTourChildTotals,
  calculateAdditionalChildTotals,
  calculateExtrabedChildTotals
) => {
  const days = selectedPackage?.days || [];
  const totalAdult = selectedPackage?.totalPaxAdult || 0;
  const childGroups = selectedPackage?.childGroups || [];

  const tourAdult = calculateTourAdultTotal(days);
  const additionalAdult = calculateAdditionalAdultTotal(days);
  const transportTotal = calculateTransport(days);
  const accommodationNights = days.filter(day => 
    (day.hotels && day.hotels.length > 0) || (day.villas && day.villas.length > 0)
  ).length;
  const akomodasiTotal = accommodationPrice * accommodationNights;
  console.log("akomodasiTotal", akomodasiTotal);

  const adultBase = (tourAdult + additionalAdult + transportTotal + akomodasiTotal + extrabedPrice) / totalAdult;

  const tourChildTotals = calculateTourChildTotals(days, childGroups);
  const additionalChildTotals = calculateAdditionalChildTotals(days, childGroups);
  const extrabedChildTotals = calculateExtrabedChildTotals(days, childGroups);

  const childPriceTotals = {};
  childGroups.forEach(group => {
    const totalChildren = Number(group.total) || 1;
    const groupTotal =
      (tourChildTotals[group.id] || 0) +
      (additionalChildTotals[group.id] || 0) +
      (extrabedChildTotals[group.id] || 0) + extrabedPrice;

    childPriceTotals[group.id] = roundPrice(groupTotal / totalChildren);
  });

  return {
    adultBase,
    childGroups,
    childPriceTotals
  };
};

export const mergeAllAccommodations = (akomodasiDays, parsedExpensesData, selectedPackage) => {
  const packageAccommodations = [];

  if (Array.isArray(akomodasiDays)) {
    let hasAccommodation = false;

    akomodasiDays.forEach((day) => {
      if (day?.hotels && day.hotels.length > 0) {
        day.hotels.forEach((hotel) => {
          const hotelName =
            hotel?.displayName ||
            hotel?.name ||
            hotel?.hotel?.label ||
            "Unknown Hotel";
          const stars = hotel?.bintang || hotel?.star || "";
          const roomType = hotel?.namaTipeKamar || "";
          const hasExtrabed = hotel?.useExtrabed || false;
          const extrabedCount = hotel?.jumlahExtrabed || 0;

          packageAccommodations.push({
            no: 1,
            name: String(hotelName),
            stars: String(stars),
            type: "Hotel",
            price: hotel?.hargaPerKamar || 0,
            extrabedPrice: hasExtrabed
              ? extrabedCount * hotel?.hargaExtrabed || 0
              : 0,
            roomType: String(roomType),
            hasExtrabed: hasExtrabed,
            extrabedCount: extrabedCount,
            jumlahKamar: hotel?.jumlahKamar || 0,
          });
          hasAccommodation = true;
        });
      }

      if (day?.villas && day.villas.length > 0) {
        day.villas.forEach((villa) => {
          const villaName =
            villa?.displayName ||
            villa?.name ||
            villa?.villaName ||
            "Unknown Villa";
          const stars =
            villa?.bintang || villa?.star_rating || villa?.star || "";
          const roomType = villa?.namaTipeKamar || "";
          const hasExtrabed = villa?.useExtrabed || false;
          const extrabedCount = villa?.jumlahExtrabed || 0;

          packageAccommodations.push({
            no: 1,
            name: String(villaName),
            stars: String(stars),
            type: "Villa",
            price: villa?.hargaPerKamar || 0,
            extrabedPrice: hasExtrabed
              ? extrabedCount * villa?.hargaExtrabed || 0
              : 0,
            roomType: String(roomType),
            hasExtrabed: hasExtrabed,
            extrabedCount: extrabedCount,
            jumlahKamar: villa?.jumlahKamar || 0,
          });
          hasAccommodation = true;
        });
      }
    });

    if (!hasAccommodation && selectedPackage?.name) {
      packageAccommodations.push({
        no: 1,
        name: String(selectedPackage.name),
        stars: "",
        type: "Package",
        price: 0,
        extrabedPrice: 0,
        roomType: "",
        hasExtrabed: false,
        extrabedCount: 0,
      });
    }
  }

  const expensesAccommodations = [
    ...parsedExpensesData.hotels.map((hotel, index) => ({
      no: index + 2,
      name: String(hotel.name),
      stars: String(hotel.stars),
      type: hotel.type,
      price: hotel.price,
      extrabedPrice: hotel.extrabedPrice,
      roomType: String(hotel.roomType),
      hasExtrabed: hotel.originalData?.useExtrabed || false,
      extrabedCount: hotel.originalData?.jumlahExtrabed || 0,
      jumlahKamar: hotel.originalData?.jumlahKamar || 0
    })),
    ...parsedExpensesData.villas.map((villa, index) => ({
      no: parsedExpensesData.hotels.length + index + 2,
      name: String(villa.name),
      stars: String(villa.stars),
      type: villa.type,
      price: villa.price,
      extrabedPrice: villa.extrabedPrice,
      roomType: String(villa.roomType),
      hasExtrabed: villa.originalData?.useExtrabed || false,
      extrabedCount: villa.originalData?.jumlahExtrabed || 0,
      jumlahKamar: villa.originalData?.jumlahKamar || 0
    })),
  ].slice(0, 5);

  return [
    ...(packageAccommodations.slice(0, 1) || []),
    ...expensesAccommodations,
  ];
};

export const hasAccommodationItems = (akomodasiDays, parsedExpensesData, allAccommodations, selectedPackage) => {
  const hasRealAccommodations = allAccommodations.length > 0;
  const hasPackageAccommodations =
    Array.isArray(akomodasiDays) &&
    akomodasiDays.some(
      (day) =>
        (day?.hotels && day.hotels.length > 0) ||
        (day?.villas && day.villas.length > 0)
    );

  const hasExpensesAccommodations =
    parsedExpensesData.hotels.length > 0 ||
    parsedExpensesData.villas.length > 0;

  const hasSelectedPackage = selectedPackage?.name;

  return (
    hasRealAccommodations &&
    (hasPackageAccommodations ||
      hasExpensesAccommodations ||
      hasSelectedPackage)
  );
};