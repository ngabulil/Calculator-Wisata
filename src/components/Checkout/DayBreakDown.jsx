import { useState, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Flex,
  Spacer,
  Grid, 
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react"; 

const DayBreakdown = ({ days, formatCurrency }) => {
  const accentColor = useColorModeValue("teal.300", "teal.400");

  const summaryCardBg = useColorModeValue("gray.600", "gray.700"); 


  const calculateDayTotal = (day) => {
    const totalHotel = (day.hotels || []).reduce(
      (sum, h) =>
        sum +
        (h.jumlahKamar || 0) * (h.hargaPerKamar || 0) +
        (h.useExtrabed
          ? (h.jumlahExtrabed || 0) * (h.hargaExtrabed || 0)
          : 0),
      0
    );
    const totalVilla = (day.villas || []).reduce(
      (sum, v) =>
        sum +
        (v.jumlahKamar || 0) * (v.hargaPerKamar || 0) +
        (v.useExtrabed
          ? (v.jumlahExtrabed || 0) * (v.hargaExtrabed || 0)
          : 0),
      0
    );
    const totalAdditional = (day.akomodasi_additionals || []).reduce(
      (sum, a) => sum + (a.harga || 0) * (a.jumlah || 0),
      0
    );

    const totalRestaurant = (day.restaurants || []).reduce(
      (sum, restaurant) => {
        return sum + (restaurant?.harga || 0);
      },
      0
    );

    const totalMobil = (day.mobils || []).reduce((sum, mobil) => {
      return sum + (mobil?.harga || 0);
    }, 0);
    const totalTransportAdditional = (day.transport_additionals || []).reduce(
      (sum, transport) => {
        return sum + (transport?.harga || 0);
      },
      0
    );
    const totalTransport = totalMobil + totalTransportAdditional;

    const subTotal =
      totalHotel +
      totalVilla +
      totalAdditional +
      totalRestaurant +
      totalTransport;
    const markup = day.markup || {};
    const markupNominal =
      markup.type === "percent"
        ? ((markup.value || 0) * subTotal) / 100
        : markup.value || 0;
    return subTotal + markupNominal;
  };

  // State for overall breakdown summary cards (moved from CheckoutPage)
  const [breakdownSummary, setBreakdownSummary] = useState({
    hotels: 0,
    villas: 0,
    additionals: 0,
    restaurants: 0,
    transports: 0,
    markup: 0,
  });

  useEffect(() => {
    let totalHotels = 0;
    let totalVillas = 0;
    let totalAdditionals = 0;
    let totalRestaurants = 0;
    let totalTransports = 0;
    let totalMarkup = 0;

    days.forEach((day) => {
      const dayHotelTotal = (day.hotels || []).reduce(
        (sum, h) =>
          sum +
          (h.jumlahKamar || 0) * (h.hargaPerKamar || 0) +
          (h.useExtrabed
            ? (h.jumlahExtrabed || 0) * (h.hargaExtrabed || 0)
            : 0),
        0
      );

      const dayVillaTotal = (day.villas || []).reduce(
        (sum, v) =>
          sum +
          (v.jumlahKamar || 0) * (v.hargaPerKamar || 0) +
          (v.useExtrabed
            ? (v.jumlahExtrabed || 0) * (v.hargaExtrabed || 0)
            : 0),
        0
      );

      const dayAdditionalTotal = (day.akomodasi_additionals || []).reduce(
        (sum, a) => sum + (a.harga || 0) * (a.jumlah || 1),
        0
      );

      const dayRestaurantTotal = (day.restaurants || []).reduce(
        (sum, restaurant) => {
          return sum + (restaurant?.harga || 0);
        },
        0
      );

      const dayMobilTotal = (day.mobils || []).reduce((sum, mobil) => {
        return sum + (mobil?.harga || 0);
      }, 0);

      const dayTransportAdditionalTotal = (
        day.transport_additionals || []
      ).reduce((sum, transport) => {
        return sum + (transport?.harga || 0);
      }, 0);

      const totalDayTransport = dayMobilTotal + dayTransportAdditionalTotal;

      const subTotal =
        dayHotelTotal +
        dayVillaTotal +
        dayAdditionalTotal +
        dayRestaurantTotal +
        totalDayTransport;
      const markup = day.markup || {};
      const markupValue =
        markup.type === "percent"
          ? ((markup.value || 0) * subTotal) / 100
          : markup.value || 0;

      totalHotels += dayHotelTotal;
      totalVillas += dayVillaTotal;
      totalAdditionals += dayAdditionalTotal;
      totalRestaurants += dayRestaurantTotal;
      totalTransports += totalDayTransport;
      totalMarkup += markupValue;
    });

    setBreakdownSummary({
      hotels: totalHotels,
      villas: totalVillas,
      additionals: totalAdditionals,
      restaurants: totalRestaurants,
      transports: totalTransports,
      markup: totalMarkup,
    });
  }, [days]);


  return (
    <VStack spacing={6} align="stretch">
      {/* Summary Cards */}
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <Box bg={summaryCardBg} p={4} rounded="lg">
          <Text fontSize="sm" color="gray.300">
            Total Hotel
          </Text>
          <Text fontSize="lg" fontWeight="bold" color={accentColor}>
            {formatCurrency(breakdownSummary.hotels)}
          </Text>
        </Box>
        <Box bg={summaryCardBg} p={4} rounded="lg">
          <Text fontSize="sm" color="gray.300">
            Total Villa
          </Text>
          <Text fontSize="lg" fontWeight="bold" color={accentColor}>
            {formatCurrency(breakdownSummary.villas)}
          </Text>
        </Box>
        <Box bg={summaryCardBg} p={4} rounded="lg">
          <Text fontSize="sm" color="gray.300">
            Total Tambahan Akomodasi
          </Text>
          <Text fontSize="lg" fontWeight="bold" color={accentColor}>
            {formatCurrency(breakdownSummary.additionals)}
          </Text>
        </Box>
        <Box bg={summaryCardBg} p={4} rounded="lg">
          <Text fontSize="sm" color="gray.300">
            Total Restoran
          </Text>
          <Text fontSize="lg" fontWeight="bold" color={accentColor}>
            {formatCurrency(breakdownSummary.restaurants)}
          </Text>
        </Box>
        <Box bg={summaryCardBg} p={4} rounded="lg">
          <Text fontSize="sm" color="gray.300">
            Total Transportasi
          </Text>
          <Text fontSize="lg" fontWeight="bold" color={accentColor}>
            {formatCurrency(breakdownSummary.transports)}
          </Text>
        </Box>
        <Box bg={summaryCardBg} p={4} rounded="lg">
          <Text fontSize="sm" color="gray.300">
            Total Markup
          </Text>
          <Text fontSize="lg" fontWeight="bold" color={accentColor}>
            {formatCurrency(breakdownSummary.markup)}
          </Text>
        </Box>
      </Grid>

      {/* Detailed Breakdown by Day */}
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Rincian Per Hari
        </Text>
        <Accordion allowMultiple>
          {days.map((day, index) => {
            const dayTotal = calculateDayTotal(day);

            return (
              <AccordionItem
                key={index}
                border="1px"
                borderColor="gray.600"
                rounded="lg"
                mb={2}
              >
                <AccordionButton
                  bg="gray.600"
                  rounded="lg"
                  _expanded={{ bg: "gray.500" }}
                >
                  <Box flex="1" textAlign="left">
                    <Flex align="center">
                      <Text fontWeight="bold">Hari {index + 1}</Text>
                      <Spacer />
                      <Badge colorScheme="teal" mr={2}>
                        {formatCurrency(dayTotal)}
                      </Badge>
                    </Flex>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4} bg="gray.650">
                  <VStack spacing={3} align="stretch">
                    {/* Hotels */}
                    {(day.hotels || []).length > 0 && (
                      <Box>
                        <Text
                          fontWeight="bold"
                          fontSize="sm"
                          mb={2}
                          color={accentColor}
                        >
                          Hotel ({day.hotels.length} item)
                        </Text>
                        {day.hotels.map((hotel, i) => (
                          <HStack
                            key={i}
                            justify="space-between"
                            fontSize="sm"
                            pl={4}
                          >
                            <Text>
                              {hotel.hotel?.nama ||
                                hotel.hotel?.label ||
                                hotel.hotel ||
                                `Hotel `}{" "}
                              - {hotel.jumlahKamar || 0} kamar
                              {hotel.useExtrabed &&
                                ` + ${hotel.jumlahExtrabed || 0} extrabed`}
                            </Text>
                            <Text fontWeight="bold">
                              {formatCurrency(
                                (hotel.jumlahKamar || 0) *
                                  (hotel.hargaPerKamar || 0) +
                                  (hotel.useExtrabed
                                    ? (hotel.jumlahExtrabed || 0) *
                                      (hotel.hargaExtrabed || 0)
                                    : 0)
                              )}
                            </Text>
                          </HStack>
                        ))}
                        <Divider my={2} />
                      </Box>
                    )}

                    {/* Villas */}
                    {(day.villas || []).length > 0 && (
                      <Box>
                        <Text
                          fontWeight="bold"
                          fontSize="sm"
                          mb={2}
                          color={accentColor}
                        >
                          Villa ({day.villas.length} item)
                        </Text>
                        {day.villas.map((villa, i) => (
                          <HStack
                            key={i}
                            justify="space-between"
                            fontSize="sm"
                            pl={4}
                          >
                            <Text>
                              {villa.villa?.name ||
                                villa.villa?.label ||
                                villa.nama ||
                                `Villa`}{" "}
                              - {villa.jumlahKamar || 0} kamar
                              {villa.useExtrabed &&
                                ` + ${villa.jumlahExtrabed || 0} extrabed`}
                            </Text>
                            <Text fontWeight="bold">
                              {formatCurrency(
                                (villa.jumlahKamar || 0) *
                                  (villa.hargaPerKamar || 0) +
                                  (villa.useExtrabed
                                    ? (villa.jumlahExtrabed || 0) *
                                      (villa.hargaExtrabed || 0)
                                    : 0)
                              )}
                            </Text>
                          </HStack>
                        ))}
                        <Divider my={2} />
                      </Box>
                    )}

                    {/* Additionals */}
                    {(day.akomodasi_additionals || []).length > 0 && (
                      <Box>
                        <Text
                          fontWeight="bold"
                          fontSize="sm"
                          mb={2}
                          color={accentColor}
                        >
                          Tambahan Akomodasi (
                          {day.akomodasi_additionals.length} item)
                        </Text>
                        {day.akomodasi_additionals.map((item, i) => (
                          <VStack
                            key={i}
                            align="stretch"
                            fontSize="sm"
                            pl={4}
                            spacing={1}
                          >
                            <HStack justify="space-between">
                              <Text fontWeight="bold">
                                {item.nama || item.name || `Item ${i + 1}`}
                              </Text>
                              <Text>
                                {formatCurrency(
                                  (item.harga || 0) * (item.jumlah || 1)
                                )}
                              </Text>
                            </HStack>
                          </VStack>
                        ))}
                        <Divider my={2} />
                      </Box>
                    )}

                    {/* Restaurants */}
                    {(day.restaurants || []).length > 0 && (
                      <Box>
                        <Text
                          fontWeight="bold"
                          fontSize="sm"
                          mb={2}
                          color={accentColor}
                        >
                          Restoran ({day.restaurants.length} item)
                        </Text>
                        {day.restaurants.map((item, i) => (
                          <HStack
                            key={i}
                            justify="space-between"
                            fontSize="sm"
                            pl={4}
                          >
                            <Text>
                              {item.nama ||
                                `Restoran ${item.id_resto || i + 1}`}{" "}
                            </Text>
                            <Text fontWeight="bold">
                              {formatCurrency(item?.harga || 0)}{" "}
                            </Text>
                          </HStack>
                        ))}
                        <Divider my={2} />
                      </Box>
                    )}

                    {/* Transport - Mobil */}
                    {(day.mobils || []).length > 0 && (
                      <Box>
                        <Text
                          fontWeight="bold"
                          fontSize="sm"
                          mb={2}
                          color={accentColor}
                        >
                          Transportasi ({day.mobils.length} item)
                        </Text>
                        {day.mobils.map((item, i) => (
                          <VStack
                            key={`mobil-${i}`}
                            align="stretch"
                            fontSize="sm"
                            pl={4}
                            spacing={1}
                          >
                            <HStack justify="space-between">
                              <Text fontWeight="bold">
                                {item.mobil?.nama ||
                                  item.mobil?.label ||
                                  item.keterangan ||
                                  `Mobil ${i + 1}`}
                              </Text>
                              <Text>
                                {formatCurrency(item?.harga || 0)}
                              </Text>
                            </HStack>
                          </VStack>
                        ))}
                        <Divider my={2} />
                      </Box>
                    )}

                    {/* Transport - Additional */}
                    {(day.transport_additionals || []).length > 0 && (
                      <Box>
                        <Text
                          fontWeight="bold"
                          fontSize="sm"
                          mb={2}
                          color={accentColor}
                        >
                          Tambahan Transportasi (
                          {day.transport_additionals.length} item)
                        </Text>
                        {day.transport_additionals.map((item, i) => (
                          <VStack
                            key={`transport-add-${i}`}
                            align="stretch"
                            fontSize="sm"
                            pl={4}
                            spacing={1}
                          >
                            <HStack justify="space-between">
                              <Text fontWeight="bold">
                                {item.nama ||
                                  item.name ||
                                  `Tambahan Transportasi ${i + 1}`}
                              </Text>
                              <Text>
                                {formatCurrency(
                                  (item.harga || 0) * (item.jumlah || 1)
                                )}
                              </Text>
                            </HStack>
                          </VStack>
                        ))}
                        <Divider my={2} />
                      </Box>
                    )}

                    <HStack justify="space-between" fontWeight="bold">
                      <Text>Total Hari {index + 1}</Text>
                      <Text color={accentColor}>
                        {formatCurrency(dayTotal)}
                      </Text>
                    </HStack>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            );
          })}
        </Accordion>
      </Box>
    </VStack>
  );
};

export default DayBreakdown;