import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";
import { useExpensesContext } from "../../context/ExpensesContext";
import { parseAndMergeDays } from "../../utils/parseAndMergeDays";
// import { useGrandTotalContext } from "../../context/GrandTotalContext";
import { usePackageContext } from "../../context/PackageContext";
import { useCheckoutContext } from "../../context/CheckoutContext";

const orange = "#FB8C00";
const gray = "#F5F5F5";

const tableHeaderStyle = {
  backgroundColor: orange,
  color: "#222",
  fontWeight: "bold",
  fontSize: "15px",
  textAlign: "center",
  padding: "2px 20px 12px 20px",
};

const tableCellStyle = {
  padding: "2px 20px 16px 20px",
  verticalAlign: "top",
};


const HotelChoiceTable = ({ akomodasiDays, calculatedTotalPerPax }) => {
  const { hotelItems, villaItems, formatCurrency, calculateGrandTotal, expenseChild } = useExpensesContext();
  const { selectedPackage } = usePackageContext();
  const { transportTotal, tourTotal, userMarkupAmount, childTotal, childMarkupAmount, childPriceTotal } = useCheckoutContext();

  const [parsedExpensesData, setParsedExpensesData] = useState({
    hotels: [],
    villas: [],
    isLoading: true,
  });  

  useEffect(() => {
    let isMounted = true;
    
    const parseExpensesData = async () => {
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
                // Perhitungan harga kamar saja
                price: (hotel?.jumlahKamar || 1) * (hotel?.hargaPerKamar || 0),
                // Perhitungan harga extrabed terpisah
                extrabedPrice: (hotel?.useExtrabed ? (hotel?.jumlahExtrabed || 0) * (hotel?.hargaExtrabed || 0) : 0),
                type: "Hotel",
                originalData: hotel,
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
                // Perhitungan harga kamar saja
                price: (villa?.jumlahKamar || 1) * (villa?.hargaPerKamar || 0),
                // Perhitungan harga extrabed terpisah
                extrabedPrice: (villa?.useExtrabed ? (villa?.jumlahExtrabed || 0) * (villa?.hargaExtrabed || 0) : 0),
                type: "Villa",
                originalData: villa,
              })) || []
          );
        }

        if (isMounted) {
          setParsedExpensesData({
            hotels: parsedHotels,
            villas: parsedVillas,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Error parsing expenses accommodation data:", error);
        if (isMounted) {
          setParsedExpensesData({
            hotels: [],
            villas: [],
            isLoading: false,
          });
        }
      }
    };

    if (hotelItems.length > 0 || villaItems.length > 0) {
      parseExpensesData();
    } else {
      setParsedExpensesData({
        hotels: [],
        villas: [],
        isLoading: false,
      });
    }

    return () => {
      isMounted = false;
    };
  }, [hotelItems, villaItems]);

const getAccommodationNights = useMemo(() => {
  if (!selectedPackage?.days || !Array.isArray(selectedPackage.days)) {
    return 0;
  }

  let nightsCount = 0;

  selectedPackage.days.forEach(day => {
    const hasHotel = day.hotels && Array.isArray(day.hotels) && day.hotels.length > 0;
    const hasVilla = day.villas && Array.isArray(day.villas) && day.villas.length > 0;
    
    if (hasHotel || hasVilla) {
      nightsCount += 1;
    }
  });

  return nightsCount;
}, [selectedPackage?.days]);
  

const calculateAlternativePrices = (accommodationPrice, extrabedPrice) => {
  const totalAdult =
    selectedPackage?.totalPaxAdult &&
    parseInt(selectedPackage.totalPaxAdult) > 0
      ? parseInt(selectedPackage.totalPaxAdult)
      : 1;

  const totalChild =
    selectedPackage?.totalPaxChildren &&
    parseInt(selectedPackage.totalPaxChildren) > 0
      ? parseInt(selectedPackage.totalPaxChildren)
      : 0;
      
  const accommodationNights = selectedPackage?.days?.reduce((count, day) => {
    const hasHotel = Array.isArray(day.hotels) && day.hotels.length > 0;
    const hasVilla = Array.isArray(day.villas) && day.villas.length > 0;
    return hasHotel || hasVilla ? count + 1 : count;
  }, 0) || 1;

  // Logika pembagian harga extrabed
  let adultAkomodasiTotal = (accommodationPrice * accommodationNights);
  let childAkomodasiTotal = 0;

  if (selectedPackage?.addExtabedToChild) {
    childAkomodasiTotal = (extrabedPrice * accommodationNights);
  } else {
    adultAkomodasiTotal += (extrabedPrice * accommodationNights);
  }
  
  const totalExpensesFromContext = calculateGrandTotal();
  const adultExpenses = totalExpensesFromContext - expenseChild;
  const tourAdult = tourTotal - childTotal;

  const adultBase = ( adultAkomodasiTotal + tourAdult + transportTotal + adultExpenses ) / totalAdult;
  const childBase = ( childAkomodasiTotal + childTotal + expenseChild ) / totalChild;

  const alternativeAdultPrice = adultBase + userMarkupAmount;
  const alternativeChildPrice = childBase + childMarkupAmount;
  
  return {
    adultPrice: alternativeAdultPrice,
    childPrice: alternativeChildPrice
  };
};


  const allAccommodations = useMemo(() => {
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
              extrabedPrice: (hasExtrabed ? (extrabedCount * hotel?.hargaExtrabed || 0) : 0),
              roomType: String(roomType),
              hasExtrabed: hasExtrabed,
              extrabedCount: extrabedCount
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
              extrabedPrice: (hasExtrabed ? (extrabedCount * villa?.hargaExtrabed || 0) : 0),
              roomType: String(roomType),
              hasExtrabed: hasExtrabed,
              extrabedCount: extrabedCount
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
          extrabedCount: 0
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
        extrabedCount: hotel.originalData?.jumlahExtrabed || 0
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
        extrabedCount: villa.originalData?.jumlahExtrabed || 0
      })),
    ].slice(0, 5);

    return [
      ...(packageAccommodations.slice(0, 1) || []),
      ...expensesAccommodations,
    ];
  }, [akomodasiDays, parsedExpensesData, selectedPackage]);

  const hasItems = useMemo(() => {
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
      (hasPackageAccommodations || hasExpensesAccommodations || hasSelectedPackage)
    );
  }, [akomodasiDays, parsedExpensesData, allAccommodations, selectedPackage]);

  // Show loading state
  if (parsedExpensesData.isLoading) {
    return (
      <Box mb={8}>
        <Text textAlign="center" color="gray.500">
          Loading accommodation data...
        </Text>
      </Box>
    );
  }

  if (!hasItems) {
    return null;
  }

return (
  <Box mb={8}>
    <Table variant="simple" size="sm" border="1px solid #ddd">
      <Thead>
        <Tr>
          <Th style={tableHeaderStyle} border="1px solid #ddd" width="5%" rowSpan={2}>
            NO
          </Th>
          <Th style={tableHeaderStyle} border="1px solid #ddd" width="50%" rowSpan={2}>
            <VStack spacing={0}>
              <Text fontWeight="bold" fontSize="14px">HOTEL CHOICE</Text>
              <Text fontSize="xs" color="gray.700" fontWeight="normal">
                ({getAccommodationNights || 0} Night Hotel)
              </Text>
            </VStack>
          </Th>
          <Th style={tableHeaderStyle} border="1px solid #ddd" width="45%" colSpan={selectedPackage?.totalPaxChildren > 0 ? 2 : 1}>
            <Text fontWeight="bold" fontSize="14px">PRICE PER PAX</Text>
          </Th>
        </Tr>
        <Tr>
          <Th style={{...tableHeaderStyle,}} border="1px solid #ddd" width="22.5%">
            <VStack spacing={0}>
              <Text fontSize="2xs" fontWeight="bold">A{selectedPackage?.totalPaxAdult}+C{selectedPackage?.totalPaxChildren}</Text>
              <Text fontSize="2xs" fontWeight="bold">Transport 6 Seater</Text>
            </VStack>
          </Th>
        </Tr>
      </Thead>

      <Tbody color={"#222"}>
        {allAccommodations.map((item, index) => (
          <Tr key={`accommodation-${index}`} _hover={{ background: gray }}>
            <Td style={tableCellStyle} fontWeight="bold" textAlign="center">
              {item.no || index + 1}
            </Td>
            <Td style={tableCellStyle}>
              <VStack align="flex-start" spacing={1}>
                <Text fontWeight="bold">
                  {item.name.toUpperCase()}
                  {item.stars ? ` (${item.stars}*)` : ""}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  ({item.roomType ? `${item.roomType}` : ""}
                  {item.hasExtrabed && item.extrabedCount > 0 
                    ? ` + ${item.extrabedCount} Extrabed` 
                    : ""})
                </Text>
              </VStack>
            </Td>

            <Td style={tableCellStyle} fontWeight="bold" textAlign="center" fontSize="xs">
              <VStack spacing={1}>
                <Text>
                  Adult : {index === 0
                    ? formatCurrency(calculatedTotalPerPax)
                    : formatCurrency(calculateAlternativePrices(item.price, item.extrabedPrice).adultPrice)} / Pax
                </Text>
              {selectedPackage?.totalPaxChildren > 0 && (
                <Text>
                  Child : {index === 0
                    ? formatCurrency(childPriceTotal)
                    : formatCurrency(calculateAlternativePrices(item.price, item.extrabedPrice).childPrice)} / Pax
                </Text>
              )}
              </VStack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </Box>
);

};

export default HotelChoiceTable;