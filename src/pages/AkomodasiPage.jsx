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
import HotelCard from "../components/Akomodasi/HotelCard";
import VillaCard from "../components/Akomodasi/VillaCard";
import InfoCard from "../components/Akomodasi/InfoCard";
import { useAkomodasiContext } from "../context/AkomodasiContext";
import { useCheckoutContext } from "../context/CheckoutContext";

const AkomodasiPage = () => {
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

  return (
    <Container maxW="7xl" py={6}>
      <Box bg={cardBg} rounded="lg" p={6} boxShadow="lg" color={textColor}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Akomodasi
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
                  <Box
                    border="1px solid"
                    borderColor="gray.600"
                    p={4}
                    rounded="md"
                  >
                    <Text fontWeight="bold" mb={2}>
                      Markup
                    </Text>
                    <HStack spacing={4}>
                      <Box w="30%">
                        <select
                          value={day.markup?.type || "percent"}
                          onChange={(e) => {
                            const updated = [...days];
                            if (!updated[index].markup) {
                              updated[index].markup = {
                                type: "percent",
                                value: 0,
                              };
                            }
                            updated[index].markup.type = e.target.value;
                            setDays(updated);
                          }}
                          style={{
                            width: "100%",
                            padding: "8px",
                            backgroundColor: "#2D3748",
                            color: "white",
                            border: "1px solid #4A5568",
                            borderRadius: "6px",
                          }}
                        >
                          <option value="percent">Percent</option>
                          <option value="amount">Amount</option>
                        </select>
                      </Box>
                      <Box w="70%">
                        <input
                          value={day.markup?.value ?? ""}
                          onChange={(e) => {
                            const updated = [...days];
                            if (!updated[index].markup) {
                              updated[index].markup = {
                                type: "percent",
                                value: 0,
                              };
                            }
                            updated[index].markup.value = Number(
                              e.target.value
                            );
                            setDays(updated);
                          }}
                          placeholder="Masukkan nilai markup"
                          style={{
                            width: "100%",
                            padding: "8px",
                            backgroundColor: "#2D3748",
                            color: "white",
                            border: "1px solid #4A5568",
                            borderRadius: "6px",
                          }}
                        />
                      </Box>
                    </HStack>
                    <Box mt={3}>
                      <Text fontSize="sm" color="green.300">
                        Jumlah markup: Rp{" "}
                        {(() => {
                          const totalHotel = hitungTotalHotel(day.hotels);
                          const totalVilla = hitungTotalVilla(day.villas);
                          const totalAdditional = hitungTotalAdditional(
                            day.additionalInfo
                          );
                          const subtotal =
                            totalHotel + totalVilla + totalAdditional;

                          const markup = day.markup || {
                            type: "percent",
                            value: 0,
                          };

                          let markupAmount = 0;
                          if (markup.type === "percent") {
                            markupAmount = (markup.value / 100) * subtotal;
                          } else {
                            markupAmount = markup.value;
                          }

                          return Math.round(markupAmount).toLocaleString(
                            "id-ID"
                          );
                        })()}
                      </Text>
                    </Box>
                  </Box>
                </VStack>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>

      {/* TOTAL */}
      <Box
        mt={8}
        bg={cardBg}
        p={6}
        rounded="lg"
        boxShadow="lg"
        border="1px solid"
        borderColor="gray.600"
      >
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Total Harga Akomodasi
        </Text>

        {days.map((day, i) => {
          const totalHotel = hitungTotalHotel(day.hotels);
          const totalVilla = hitungTotalVilla(day.villas);
          const totalAdditional = hitungTotalAdditional(day.additionalInfo);
          const subtotal = totalHotel + totalVilla + totalAdditional;

          const markup = day.markup || { type: "percent", value: 0 };
          const markupAmount =
            markup.type === "amount"
              ? markup.value
              : (markup.value / 100) * subtotal;

          const finalTotal = subtotal + markupAmount;

          return (
            <Box
              key={i}
              mb={4}
              p={4}
              bg="gray.700"
              rounded="md"
              border="1px solid"
              borderColor="gray.500"
            >
              <Text fontWeight="bold" color="teal.300" mb={2}>
                Day {i + 1} - {day.description}
              </Text>

              {day.hotels.map((h, hi) => (
                <Box key={hi} mb={2} p={2} bg="gray.800" rounded="md">
                  <Text fontSize="sm" color="teal.200" fontWeight="semibold">
                    Hotel {hi + 1}: {h.hotel?.label}
                  </Text>
                  <Text fontSize="sm" color="gray.300">
                    - Tipe Kamar: {h.roomType?.label}
                  </Text>
                  <Text fontSize="sm" color="gray.300">
                    - Musim: {h.seasonLabel}
                  </Text>
                  <Text fontSize="sm" color="gray.300">
                    - {h.jumlahKamar} kamar x Rp{" "}
                    {h.hargaPerKamar?.toLocaleString("id-ID")}
                  </Text>
                  {h.useExtrabed && (
                    <Text fontSize="sm" color="gray.300">
                      - Extrabed: {h.jumlahExtrabed} x Rp{" "}
                      {h.hargaExtrabed?.toLocaleString("id-ID")}
                    </Text>
                  )}
                </Box>
              ))}

              {day.villas.map((v, vi) => (
                <Box key={vi} mb={2} p={2} bg="gray.800" rounded="md">
                  <Text fontSize="sm" color="purple.200" fontWeight="semibold">
                    Villa {vi + 1}: {v.villa?.label}
                  </Text>
                  <Text fontSize="sm" color="gray.300">
                    - Tipe Kamar: {v.roomType?.label}
                  </Text>
                  <Text fontSize="sm" color="gray.300">
                    - Musim: {v.seasonLabel}
                  </Text>
                  <Text fontSize="sm" color="gray.300">
                    - {v.jumlahKamar} kamar x Rp{" "}
                    {v.hargaPerKamar?.toLocaleString("id-ID")}
                  </Text>
                  {v.useExtrabed && (
                    <Text fontSize="sm" color="gray.300">
                      - Extrabed: {v.jumlahExtrabed} x Rp{" "}
                      {v.hargaExtrabed?.toLocaleString("id-ID")}
                    </Text>
                  )}
                </Box>
              ))}

              {day.additionalInfo.map((a, ai) => (
                <Box key={ai} mb={2} p={2} bg="gray.800" rounded="md">
                  <Text fontSize="sm" color="orange.200" fontWeight="semibold">
                    Additional {ai + 1}: {a.nama}
                  </Text>
                  <Text fontSize="sm" color="gray.300">
                    - {a.jumlah} x Rp {a.harga?.toLocaleString("id-ID")}
                  </Text>
                </Box>
              ))}

              <Text fontSize="sm" color="gray.400">
                Subtotal: Rp {subtotal.toLocaleString("id-ID")}
              </Text>
              <Text fontSize="sm" color="gray.400">
                Markup: Rp {Number(markupAmount).toLocaleString("id-ID")} (
                {markup.type === "percent" ? `${markup.value}%` : "amount"})
              </Text>
              <Text mt={2} fontWeight="semibold" color="green.300">
                Total Hari Ini: Rp {Number(finalTotal).toLocaleString("id-ID")}
              </Text>
            </Box>
          );
        })}

        <Divider my={4} />
        <Text fontSize="xl" fontWeight="bold" color="green.400">
          Total Akomodasi: Rp{" "}
          {Number(
            days.reduce((sum, day) => {
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
            }, 0)
          ).toLocaleString("id-ID")}
        </Text>
      </Box>
    </Container>
  );
};

export default AkomodasiPage;
