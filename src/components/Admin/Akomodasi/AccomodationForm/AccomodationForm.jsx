import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Button,
  Textarea,
  Text,
  VStack,
  HStack,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import HotelCard from "../../../Akomodasi/HotelCard";
import VillaCard from "../../../Akomodasi/VillaCard";
import InfoCard from "../../../Akomodasi/InfoCard";
import { useAkomodasiContext } from "../../../../context/AkomodasiContext";
import { useCheckoutContext } from "../../../../context/CheckoutContext";

const AccomodationForm = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { getHotels, getVillas, getAdditional, days, setDays } =
    useAkomodasiContext();
  const { setAkomodasiTotal } = useCheckoutContext();

  const hitungTotalHotel = (hotels) =>
    hotels.reduce((total, h) => {
      const kamar = h.jumlahKamar || 0;
      const harga = h.hargaPerKamar || 0;
      const extrabed = h.useExtrabed
        ? (h.jumlahExtrabed || 0) * (h.hargaExtrabed || 0)
        : 0;
      return total + kamar * harga + extrabed;
    }, 0);

  const hitungTotalVilla = (villas) =>
    villas.reduce((total, v) => {
      const kamar = v.jumlahKamar || 0;
      const harga = v.hargaPerKamar || 0;
      const extrabed = v.useExtrabed
        ? (v.jumlahExtrabed || 0) * (v.hargaExtrabed || 0)
        : 0;
      return total + kamar * harga + extrabed;
    }, 0);

  const hitungTotalAdditional = (additional) =>
    additional.reduce(
      (total, a) => total + (a.harga || 0) * (a.jumlah || 0),
      0
    );

  const handleAddDay = () => {
    setDays((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        description: "",
        hotels: [],
        villas: [],
        additionalInfo: [],
        markup: { type: "percent", value: 0 },
      },
    ]);
    setActiveIndex(days.length);
  };

  const handleRemoveDay = (index) => {
    const updated = [...days];
    updated.splice(index, 1);
    setDays(updated);
    setActiveIndex((prev) =>
      index >= updated.length ? updated.length - 1 : prev
    );
  };

  const cardBg = useColorModeValue("gray.700", "gray.800");
  const textColor = useColorModeValue("white", "white");

  useEffect(() => {
    const fetchData = async () => {
      await getHotels();
      await getVillas();
      await getAdditional();
    };
    fetchData();
  }, []);

  useEffect(() => {
    const total = days.reduce((sum, day) => {
      const subtotal =
        hitungTotalHotel(day.hotels) +
        hitungTotalVilla(day.villas) +
        hitungTotalAdditional(day.additionalInfo);

      const markup = day.markup || { type: "percent", value: 0 };
      const markupAmount =
        markup.type === "amount"
          ? markup.value
          : (markup.value / 100) * subtotal;

      return sum + subtotal + markupAmount;
    }, 0);

    setAkomodasiTotal(total);
  }, [days]);

  const handleCreateAccomodation = () => {
    console.log(days);
  };

  return (
    <Container maxW="7xl" py={6}>
      <Box bg={cardBg} rounded="lg" p={6} boxShadow="lg" color={textColor}>
        <Text fontSize="24px" fontWeight="bold" mb={4}>
          Buat Akomodasi
        </Text>

        <Tabs
          index={activeIndex}
          onChange={setActiveIndex}
          variant="soft-rounded"
          colorScheme="blue"
        >
          <HStack justify="space-between" mb={2}>
            <TabList overflowX="auto">
              {days.map((_, i) => (
                <Tab key={i}>Day {i + 1}</Tab>
              ))}
            </TabList>
            <Button size="sm" leftIcon={<AddIcon />} onClick={handleAddDay}>
              Tambah Day
            </Button>
          </HStack>

          <TabPanels>
            {days.map((day, index) => (
              <TabPanel key={index} px={0}>
                <VStack spacing={6} align="stretch">
                  <HStack justify="space-between">
                    <Text fontWeight="semibold">
                      Deskripsi untuk Day {index + 1}
                    </Text>
                    {days.length > 1 && (
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleRemoveDay(index)}
                      />
                    )}
                  </HStack>

                  <Textarea
                    value={day.description}
                    onChange={(e) => {
                      const updated = [...days];
                      updated[index].description = e.target.value;
                      setDays(updated);
                    }}
                    placeholder="Deskripsi hari..."
                    bg="gray.700"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                  />

                  {/* Hotel dan Villa */}
                  <Box
                    border="1px solid"
                    borderColor="gray.600"
                    p={4}
                    rounded="md"
                  >
                    <Text fontSize="xl" fontWeight="bold" mb={2}>
                      Hotel / Villa
                    </Text>

                    <VStack spacing={2} align="stretch">
                      {day.hotels.map((hotel, i) => (
                        <HotelCard
                          key={i}
                          index={i}
                          data={hotel}
                          onChange={(newHotel) => {
                            const updated = [...days];
                            updated[index].hotels[i] = newHotel;
                            setDays(updated);
                          }}
                          onDelete={() => {
                            const updated = [...days];
                            updated[index].hotels.splice(i, 1);
                            setDays(updated);
                          }}
                        />
                      ))}
                      <Button
                        variant="outline"
                        colorScheme="teal"
                        onClick={() => {
                          const updated = [...days];
                          updated[index].hotels.push({});
                          setDays(updated);
                        }}
                      >
                        Tambah Hotel
                      </Button>

                      {day.villas.map((villa, i) => (
                        <VillaCard
                          key={i}
                          index={i}
                          data={villa}
                          onChange={(newVilla) => {
                            const updated = [...days];
                            updated[index].villas[i] = newVilla;
                            setDays(updated);
                          }}
                          onDelete={() => {
                            const updated = [...days];
                            updated[index].villas.splice(i, 1);
                            setDays(updated);
                          }}
                        />
                      ))}
                      <Button
                        variant="outline"
                        colorScheme="purple"
                        onClick={() => {
                          const updated = [...days];
                          updated[index].villas.push({});
                          setDays(updated);
                        }}
                      >
                        Tambah Villa
                      </Button>
                    </VStack>
                  </Box>

                  {/* Additional */}
                  <Box
                    border="1px solid"
                    borderColor="gray.600"
                    p={4}
                    rounded="md"
                  >
                    <Text fontSize="xl" fontWeight="bold" mb={2}>
                      Additional Info
                    </Text>

                    <VStack spacing={2} align="stretch">
                      {day.additionalInfo.map((info, i) => (
                        <InfoCard
                          key={i}
                          index={i}
                          data={info}
                          onChange={(newInfo) => {
                            const updated = [...days];
                            updated[index].additionalInfo[i] = newInfo;
                            setDays(updated);
                          }}
                          onDelete={() => {
                            const updated = [...days];
                            updated[index].additionalInfo.splice(i, 1);
                            setDays(updated);
                          }}
                        />
                      ))}
                      <Button
                        variant="outline"
                        colorScheme="orange"
                        onClick={() => {
                          const updated = [...days];
                          updated[index].additionalInfo.push({});
                          setDays(updated);
                        }}
                      >
                        Tambah Info
                      </Button>
                    </VStack>
                  </Box>

                  {/* Markup */}
                </VStack>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>

      <Button w={"full"} bg={"blue.500"} onClick={handleCreateAccomodation}>
        Buat Akomodasi
      </Button>
    </Container>
  );
};

export default AccomodationForm;
