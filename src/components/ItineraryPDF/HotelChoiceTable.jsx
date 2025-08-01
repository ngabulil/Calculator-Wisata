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

const formatPrice = (price) => {
  if (!price || price === 0) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

const HotelChoiceTable = ({ akomodasiDays }) => {
  const { hotelItems, villaItems, calculateGrandTotal } = useExpensesContext();
  const { selectedPackage } = usePackageContext();
  const { transportTotal, tourTotal, grandTotal } = useCheckoutContext();

  const [parsedExpensesData, setParsedExpensesData] = useState({
    hotels: [],
    villas: [],
    isLoading: true,
  });

  // Parse expenses context data using parseAndMergeDays
  useEffect(() => {
    let isMounted = true;

    const parseExpensesData = async () => {
      try {
        // Create mock days structure for parsing
        const mockDaysForHotels = hotelItems.map((hotel, index) => ({
          id: `hotel-day-${index}`,
          name: `Hotel Day ${index + 1}`,
          hotels: [hotel], // Each hotel item as a day
          villas: [],
          destinations: [],
          restaurants: [],
          activities: [],
        }));

        const mockDaysForVillas = villaItems.map((villa, index) => ({
          id: `villa-day-${index}`,
          name: `Villa Day ${index + 1}`,
          hotels: [],
          villas: [villa], // Each villa item as a day
          destinations: [],
          restaurants: [],
          activities: [],
        }));

        // Parse hotels and villas separately
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
                price: hotel?.hargaPerKamar || hotel?.price || 0,
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
                price: villa?.hargaPerKamar || villa?.price || 0,
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

  // Calculate total price per pax similar to InvoicePDF
  const calculatedTotalPerPax = useMemo(() => {
    const totalAdult =
      selectedPackage?.totalPaxAdult &&
      parseInt(selectedPackage.totalPaxAdult) > 0
        ? parseInt(selectedPackage.totalPaxAdult)
        : 1; // Default to 1 to avoid division by zero

    const totalExpensesFromContext = calculateGrandTotal();
    const adjustedGrandTotal = grandTotal + totalExpensesFromContext;

    return adjustedGrandTotal / totalAdult;
  }, [selectedPackage?.totalPaxAdult, grandTotal, calculateGrandTotal]);

  const calculateAlternativePrice = (hotelPrice) => {
    const totalAdult =
      selectedPackage?.totalPaxAdult &&
      parseInt(selectedPackage.totalPaxAdult) > 0
        ? parseInt(selectedPackage.totalPaxAdult)
        : 1;

  const accommodationDays = selectedPackage?.days?.reduce((count, day) => {
    const hasHotel = Array.isArray(day.hotels) && day.hotels.length > 0;
    const hasVilla = Array.isArray(day.villa) && day.villa.length > 0;
    return hasHotel || hasVilla ? count + 1 : count;
  }, 0) || 1;
    const totalHotelPrice = hotelPrice * accommodationDays;
    const totalExpensesFromContext = calculateGrandTotal();
    const alternativeTotal =
      totalHotelPrice + tourTotal + transportTotal + totalExpensesFromContext;

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

  // Don't render table if no items
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
                  ? formatPrice(calculatedTotalPerPax)
                  : formatPrice(calculateAlternativePrice(item.price))}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default HotelChoiceTable;
