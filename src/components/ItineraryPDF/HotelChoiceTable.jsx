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
  fontSize: "1rem",
  textAlign: "center",
  padding: "2px 40px 12px 40px",
};

const tableCellStyle = {
  padding: "2px 40px 12px 40px",
  verticalAlign: "top",
};


const HotelChoiceTable = ({ akomodasiDays }) => {
  const { hotelItems, villaItems, calculateGrandTotal, formatCurrency } = useExpensesContext();
  const { selectedPackage } = usePackageContext();
  const { transportTotal, tourTotal, grandTotal, userMarkup } = useCheckoutContext();

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
                roomType: hotel?.roomType || "",
                price:
                  (hotel?.jumlahKamar || 1) * (hotel?.hargaPerKamar || 0) +
                  (hotel?.useExtrabed
                    ? (hotel?.jumlahExtrabed || 0) * (hotel?.hargaExtrabed || 0)
                    : 0),
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
                roomType: villa?.roomType || "",
                price:
                  (villa?.jumlahKamar || 1) * (villa?.hargaPerKamar || 0) +
                  (villa?.useExtrabed ? (villa?.jumlahExtrabed || 0) * (villa?.hargaExtrabed || 0) : 0),
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

 const calculateUserMarkupAmount = (subtotal) => {
    if (!userMarkup.value || userMarkup.value <= 0) return 0;
    
    if (userMarkup.type === 'percent') {
      return (subtotal * userMarkup.value) / 100;
    } else {
      return userMarkup.value;
    }
  };

  // Calculate total price per pax - menggunakan grandTotal dari CheckoutContext
  const calculatedTotalPerPax = useMemo(() => {
    const totalAdult =
      selectedPackage?.totalPaxAdult &&
      parseInt(selectedPackage.totalPaxAdult) > 0
        ? parseInt(selectedPackage.totalPaxAdult)
        : 1; // Default to 1 to avoid division by zero

    const totalExpensesFromContext = calculateGrandTotal();
    
    // Grand total sudah termasuk markup dari CheckoutContext
    const adjustedGrandTotal = grandTotal + totalExpensesFromContext;

    return adjustedGrandTotal / totalAdult;
  }, [selectedPackage?.totalPaxAdult, grandTotal, calculateGrandTotal]);

  const calculateAlternativePrice = (hotelPrice) => {
    const totalAdult =
      selectedPackage?.totalPaxAdult &&
      parseInt(selectedPackage.totalPaxAdult) > 0
        ? parseInt(selectedPackage.totalPaxAdult)
        : 1;

    // Hitung jumlah hari akomodasi
    const accommodationDays = selectedPackage?.days?.reduce((count, day) => {
      const hasHotel = Array.isArray(day.hotels) && day.hotels.length > 0;
      const hasVilla = Array.isArray(day.villa) && day.villa.length > 0;
      return hasHotel || hasVilla ? count + 1 : count;
    }, 0) || 1;

    // Total harga hotel untuk semua hari
    const totalHotelPrice = hotelPrice * accommodationDays;
    
    // Subtotal sebelum markup (hotel + tour + transport + expenses)
    const totalExpensesFromContext = calculateGrandTotal();
    const subtotalBeforeMarkup = totalHotelPrice + tourTotal + transportTotal + totalExpensesFromContext;
    
    // Hitung user markup berdasarkan subtotal
    const markupAmount = calculateUserMarkupAmount(subtotalBeforeMarkup);
    
    // Total dengan markup
    const alternativeTotal = subtotalBeforeMarkup + (markupAmount * selectedPackage?.totalPaxAdult || 1);

    return alternativeTotal / totalAdult;
  };

  // Memoize processed accommodations data
  const allAccommodations = useMemo(() => {
    const packageAccommodations = [];

    if (Array.isArray(akomodasiDays)) {
      akomodasiDays.forEach((day) => {
        if (day?.hotels) {
          day.hotels.forEach((hotel) => {
            const hotelName =
              hotel?.displayName ||
              hotel?.name ||
              hotel?.hotel?.label ||
              "Unknown Hotel";
            const stars = hotel?.bintang || hotel?.star || "";
            const roomType = hotel?.roomType || "";

            packageAccommodations.push({
              no: 1,
              name: String(hotelName),
              stars: String(stars),
              type: "Hotel",
              price: hotel?.hargaPerKamar || 0,
              roomType: String(roomType),
            });
          });
        }

        if (day?.villas) {
          day.villas.forEach((villa) => {
            const villaName =
              villa?.displayName ||
              villa?.name ||
              villa?.villaName ||
              "Unknown Villa";
            const stars =
              villa?.bintang || villa?.star_rating || villa?.star || "";
            const roomType = villa?.roomType || "";

            packageAccommodations.push({
              no: 1,
              name: String(villaName),
              stars: String(stars),
              type: "Villa",
              price: villa?.hargaPerKamar || 0,
              roomType: String(roomType),
            });
          });
        }
      });
    }

    // Process expenses accommodations (parsed data)
    const expensesAccommodations = [
      ...parsedExpensesData.hotels.map((hotel, index) => ({
        no: index + 2,
        name: String(hotel.name),
        stars: String(hotel.stars),
        type: hotel.type,
        price: hotel.price,
        roomType: String(hotel.roomType),
      })),
      ...parsedExpensesData.villas.map((villa, index) => ({
        no: parsedExpensesData.hotels.length + index + 2,
        name: String(villa.name),
        stars: String(villa.stars),
        type: villa.type,
        price: villa.price,
        roomType: String(villa.roomType),
      })),
    ].slice(0, 5); // max 5

    return [
      ...(packageAccommodations.slice(0, 1) || []),
      ...expensesAccommodations,
    ];
  }, [akomodasiDays, parsedExpensesData]);

  // Check if there are any real items to display (not just empty rows)
  const hasItems = useMemo(() => {
    // Check if allAccommodations has any real data (not just empty placeholders)
    const hasRealAccommodations = allAccommodations.length > 0;

    // Check if there are any non-empty package accommodations
    const hasPackageAccommodations =
      Array.isArray(akomodasiDays) &&
      akomodasiDays.some(
        (day) =>
          (day?.hotels && day.hotels.length > 0) ||
          (day?.villas && day.villas.length > 0)
      );

    // Check if there are expenses accommodations
    const hasExpensesAccommodations =
      parsedExpensesData.hotels.length > 0 ||
      parsedExpensesData.villas.length > 0;

    return (
      hasRealAccommodations &&
      (hasPackageAccommodations || hasExpensesAccommodations)
    );
  }, [akomodasiDays, parsedExpensesData, allAccommodations]);

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
            <Th style={tableHeaderStyle} border="1px solid #ddd" width="60px">
              NO
            </Th>
            <Th style={tableHeaderStyle} border="1px solid #ddd">
              HOTEL CHOICE
            </Th>
            <Th style={tableHeaderStyle} border="1px solid #ddd" width="200px">
              PRICE PER PAX
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
                    {item.type}
                    {item.roomType ? ` - ${item.roomType}` : ""}
                  </Text>
                </VStack>
              </Td>
              <Td style={tableCellStyle} fontWeight="bold" textAlign="center">
                {/* Baris pertama: total dari checkout context, baris lainnya: perhitungan alternatif */}
                {index === 0
                  ? formatCurrency(calculatedTotalPerPax)
                  : formatCurrency(calculateAlternativePrice(item.price))}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default HotelChoiceTable;