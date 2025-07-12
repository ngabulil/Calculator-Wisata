import { useEffect, useState } from "react";
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
import { parsePaketDays } from "../../utils/parseOnePaket";
import { useCheckoutContext } from "../../context/CheckoutContext";

const DayBreakdown = ({ days, formatCurrency }) => {
  const accentColor = useColorModeValue("teal.300", "teal.400");
  const summaryCardBg = useColorModeValue("gray.600", "gray.700");

  const { 
    breakdown, 
    dayTotals, 
    detailedBreakdown,
    akomodasiTotal, 
    transportTotal, 
    tourTotal
  } = useCheckoutContext();

  const [parsedDays, setParsedDays] = useState([]);
  const [mergedDays, setMergedDays] = useState([]);

  useEffect(() => {
    const parseData = async () => {
      try {
        const data = await parsePaketDays(days);
        setParsedDays(data);
      } catch (error) {
        console.error("Error parsing days:", error);
        setParsedDays([]);
      }
    };

    if (days && days.length > 0) {
      parseData();
    }
  }, [days]);

  // Merge raw days dengan parsed days
  useEffect(() => {
    if (days && parsedDays.length > 0) {
      const merged = days.map((rawDay, index) => {
        const parsedDay = parsedDays[index] || {};
        
        return {
          ...rawDay, // Ambil semua data raw untuk perhitungan
          // Merge hotel names dari parsed data
          hotels: (rawDay.hotels || []).map((hotel, hotelIndex) => ({
            ...hotel,
            displayName: parsedDay.hotels?.[hotelIndex]?.name || 
                        hotel.name || 
                        hotel.hotel?.name || 
                        `Hotel ${hotelIndex + 1}`
          })),
          // Merge villa names dari parsed data
          villas: (rawDay.villas || []).map((villa, villaIndex) => ({
            ...villa,
            displayName: parsedDay.villas?.[villaIndex]?.name || 
                        villa.name || 
                        villa.villa?.name || 
                        `Villa ${villaIndex + 1}`
          })),
          // Merge mobil names dari parsed data
          mobils: (rawDay.mobils || []).map((mobil, mobilIndex) => ({
            ...mobil,
            displayName: parsedDay.mobils?.[mobilIndex]?.name || 
                        mobil.name || 
                        mobil.mobil?.nama || 
                        `Mobil ${mobilIndex + 1}`
          })),
          // Merge restaurant names dari parsed data
          restaurants: (rawDay.restaurants || []).map((resto, restoIndex) => ({
            ...resto,
            displayName: parsedDay.restaurants?.[restoIndex]?.name || 
                        resto.name || 
                        resto.resto?.name || 
                        `Restoran ${restoIndex + 1}`
          })),
          // Merge destination names dari parsed data
          destinations: (rawDay.destinations || []).map((dest, destIndex) => ({
            ...dest,
            displayName: parsedDay.destinations?.[destIndex]?.name || 
                        dest.name || 
                        dest.destinasi?.name || 
                        `Destinasi ${destIndex + 1}`
          })),
          // Merge activity names dari parsed data
          activities: (rawDay.activities || []).map((activity, actIndex) => ({
            ...activity,
            displayName: parsedDay.activities?.[actIndex]?.name || 
                        activity.name || 
                        activity.aktivitas?.name || 
                        `Aktivitas ${actIndex + 1}`
          }))
        };
      });
      
      setMergedDays(merged);
    } else {
      setMergedDays(days || []);
    }
  }, [days, parsedDays]);

  return (
    <VStack spacing={6} align="stretch">
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <Box bg={summaryCardBg} p={4} rounded="lg">
          <Text fontSize="sm" color="gray.300">
            Total Akomodasi
          </Text>
          <Text fontSize="lg" fontWeight="bold" color={accentColor}>
            {formatCurrency(akomodasiTotal)}
          </Text>
        </Box>
        <Box bg={summaryCardBg} p={4} rounded="lg">
          <Text fontSize="sm" color="gray.300">
            Total Transportasi
          </Text>
          <Text fontSize="lg" fontWeight="bold" color={accentColor}>
            {formatCurrency(transportTotal)}
          </Text>
        </Box>
        <Box bg={summaryCardBg} p={4} rounded="lg">
          <Text fontSize="sm" color="gray.300">
            Total Tour
          </Text>
          <Text fontSize="lg" fontWeight="bold" color={accentColor}>
            {formatCurrency(tourTotal)}
          </Text>
        </Box>
        <Box bg={summaryCardBg} p={4} rounded="lg">
          <Text fontSize="sm" color="gray.300">
            Total Markup
          </Text>
          <Text fontSize="lg" fontWeight="bold" color={accentColor}>
            {formatCurrency(breakdown.markup)}
          </Text>
        </Box>
        {/* <Box bg={summaryCardBg} p={4} rounded="lg">
          <Text fontSize="sm" color="gray.300">
            Grand Total
          </Text>
          <Text fontSize="lg" fontWeight="bold" color={accentColor}>
            {formatCurrency(
              akomodasiTotal + 
              transportTotal + 
              tourTotal + 
              breakdown.markup
            )}
          </Text>
        </Box> */}
      </Grid>

      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Rincian Per Hari
        </Text>
        <Accordion allowMultiple>
          {mergedDays.map((day, index) => {
            const dayTotal = dayTotals[index] || 0;
            const dayBreakdown = detailedBreakdown[index] || {};

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
                    {(day.hotels || []).length > 0 && (
                      <Box>
                        <Text fontWeight="bold" fontSize="sm" mb={2} color={accentColor}>
                          Hotel ({day.hotels.length} item)
                        </Text>
                        {day.hotels.map((hotel, i) => (
                          <HStack key={i} justify="space-between" fontSize="sm" pl={4}>
                            <Text>
                              {hotel.displayName} - {hotel.jumlahKamar || 0} kamar
                              {hotel.useExtrabed && ` + ${hotel.jumlahExtrabed || 0} extrabed`}
                            </Text>
                            <Text fontWeight="bold">
                              {formatCurrency(
                                (hotel.jumlahKamar || 0) * (hotel.hargaPerKamar || 0) +
                                (hotel.useExtrabed ? (hotel.jumlahExtrabed || 0) * (hotel.hargaExtrabed || 0) : 0)
                              )}
                            </Text>
                          </HStack>
                        ))}
                        <Divider my={2} />
                      </Box>
                    )}

                    {(day.villas || []).length > 0 && (
                      <Box>
                        <Text fontWeight="bold" fontSize="sm" mb={2} color={accentColor}>
                          Villa ({day.villas.length} item)
                        </Text>
                        {day.villas.map((villa, i) => (
                          <HStack key={i} justify="space-between" fontSize="sm" pl={4}>
                            <Text>
                              {villa.displayName} - {villa.jumlahKamar || 0} kamar
                              {villa.useExtrabed && ` + ${villa.jumlahExtrabed || 0} extrabed`}
                            </Text>
                            <Text fontWeight="bold">
                              {formatCurrency(
                                (villa.jumlahKamar || 0) * (villa.hargaPerKamar || 0) +
                                (villa.useExtrabed ? (villa.jumlahExtrabed || 0) * (villa.hargaExtrabed || 0) : 0)
                              )}
                            </Text>
                          </HStack>
                        ))}
                        <Divider my={2} />
                      </Box>
                    )}

                    {(day.akomodasi_additionals || []).length > 0 && (
                      <Box>
                        <Text fontWeight="bold" fontSize="sm" mb={2} color={accentColor}>
                          Tambahan Akomodasi ({day.akomodasi_additionals.length} item)
                        </Text>
                        {day.akomodasi_additionals.map((item, i) => (
                          <VStack key={i} align="stretch" fontSize="sm" pl={4} spacing={1}>
                            <HStack justify="space-between">
                              <Text fontWeight="bold">
                                {item.name || item.nama || `Item ${i + 1}`}
                              </Text>
                              <Text>
                                {formatCurrency((item.harga || 0) * (item.jumlah || 1))}
                              </Text>
                            </HStack>
                          </VStack>
                        ))}
                        <Divider my={2} />
                      </Box>
                    )}

                    {(day.mobils || []).length > 0 && (
                      <Box>
                        <Text fontWeight="bold" fontSize="sm" mb={2} color={accentColor}>
                          Transportasi ({day.mobils.length} item)
                        </Text>
                        {day.mobils.map((item, i) => (
                          <VStack key={`mobil-${i}`} align="stretch" fontSize="sm" pl={4} spacing={1}>
                            <HStack justify="space-between">
                              <Text fontWeight="bold">
                                {item.displayName}
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

                    {(day.transport_additionals || []).length > 0 && (
                      <Box>
                        <Text fontWeight="bold" fontSize="sm" mb={2} color={accentColor}>
                          Tambahan Transportasi ({day.transport_additionals.length} item)
                        </Text>
                        {day.transport_additionals.map((item, i) => (
                          <VStack key={`transport-add-${i}`} align="stretch" fontSize="sm" pl={4} spacing={1}>
                            <HStack justify="space-between">
                              <Text fontWeight="bold">
                                {item.name || item.nama || `Tambahan Transportasi ${i + 1}`}
                              </Text>
                              <Text>
                                {formatCurrency((item.harga || 0) * (item.jumlah || 1))}
                              </Text>
                            </HStack>
                          </VStack>
                        ))}
                        <Divider my={2} />
                      </Box>
                    )}

                    {(day.restaurants?.length > 0 || 
                      day.destinations?.length > 0 || 
                      day.activities?.length > 0) && (
                      <Box>
                        <Text fontWeight="bold" fontSize="sm" mb={2} color={accentColor}>
                          Tour
                        </Text>
                        
                        {/* Restoran */}
                        {(day.restaurants || []).length > 0 && (
                          <>
                            <Text fontSize="xs" mb={1} pl={2} color="gray.400">
                              Restoran:
                            </Text>
                            {day.restaurants.map((item, i) => (
                              <HStack key={`resto-${i}`} justify="space-between" fontSize="sm" pl={4}>
                                <Text>
                                  {item.displayName}
                                </Text>
                                <Text fontWeight="bold">
                                  {formatCurrency(
                                    (item.hargaAdult || 0) * (item.jumlahAdult || 0) + 
                                    (item.hargaChild || 0) * (item.jumlahChild || 0)
                                  )}
                                </Text>
                              </HStack>
                            ))}
                          </>
                        )}
                        
                        {/* Destinasi */}
                        {(day.destinations || []).length > 0 && (
                          <>
                            <Text fontSize="xs" mb={1} pl={2} color="gray.400" mt={day.restaurants?.length > 0 ? 2 : 0}>
                              Destinasi:
                            </Text>
                            {day.destinations.map((item, i) => (
                              <HStack key={`dest-${i}`} justify="space-between" fontSize="sm" pl={4}>
                                <Text>
                                  {item.displayName}
                                </Text>
                                <Text fontWeight="bold">
                                  {formatCurrency(
                                    (item.hargaAdult || 0) * (item.jumlahAdult || 0) + 
                                    (item.hargaChild || 0) * (item.jumlahChild || 0)
                                  )}
                                </Text>
                              </HStack>
                            ))}
                          </>
                        )}
                        
                        {/* Aktivitas */}
                        {(day.activities || []).length > 0 && (
                          <>
                            <Text fontSize="xs" mb={1} pl={2} color="gray.400" mt={(day.restaurants?.length > 0 || day.destinations?.length > 0) ? 2 : 0}>
                              Aktivitas:
                            </Text>
                            {day.activities.map((item, i) => (
                              <HStack key={`act-${i}`} justify="space-between" fontSize="sm" pl={4}>
                                <Text>
                                  {item.displayName}
                                  {item.jumlah > 1 && ` (x${item.jumlah})`}
                                </Text>
                                <Text fontWeight="bold">
                                  {formatCurrency(
                                    (item.hargaAdult || 0) * (item.jumlahAdult || 0) + 
                                    (item.hargaChild || 0) * (item.jumlahChild || 0)
                                  )}
                                </Text>
                              </HStack>
                            ))}
                          </>
                        )}
                        
                        <Divider my={2} />
                      </Box>
                    )}

                    {/* Tampilkan markup jika ada */}
                    {dayBreakdown.markup > 0 && (
                      <Box>
                        <HStack justify="space-between" fontSize="sm" color="orange.300">
                          <Text>Markup</Text>
                          <Text fontWeight="bold">
                            {formatCurrency(dayBreakdown.markup)}
                          </Text>
                        </HStack>
                        <Divider my={2} />
                      </Box>
                    )}

                    <HStack justify="space-between" fontWeight="bold">
                      <Text>Total Hari {index + 1}</Text>
                      <Text color={accentColor}>{formatCurrency(dayTotal)}</Text>
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