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
import MobilCard from "../components/Transport/MobilCard";
import InfoCard from "../components/Transport/InfoCard";
import { useTransportContext } from "../context/TransportContext";
import { useCheckoutContext } from "../context/CheckoutContext";

const TransportPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { getMobils, getAdditionalMobil, days, setDays } =
    useTransportContext();
  const { setTransportTotal } = useCheckoutContext();

  const hitungTotalMobil = (mobils) =>
    mobils.reduce((total, m) => {
      const harga = m.harga || 0;
      const jumlah = m.jumlah || 1;
      return total + harga * jumlah;
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
        mobils: [],
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
      await getMobils();
      await getAdditionalMobil();
    };
    fetchData();
  }, []);

  useEffect(() => {
    const total = days.reduce((sum, day) => {
      const subtotal =
        hitungTotalMobil(day.mobils) +
        hitungTotalAdditional(day.additionalInfo);

      const markup = day.markup || { type: "percent", value: 0 };
      const markupAmount =
        markup.type === "amount"
          ? markup.value
          : (markup.value / 100) * subtotal;

      return sum + subtotal + markupAmount;
    }, 0);

    setTransportTotal(total);
  }, [days]);

  return (
    <Container maxW="7xl" py={6}>
      <Box bg={cardBg} rounded="lg" p={6} boxShadow="lg" color={textColor}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Transportasi
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

                  {/* Mobil Section */}
                  <Box
                    border="1px solid"
                    borderColor="gray.600"
                    p={4}
                    rounded="md"
                  >
                    <Text fontSize="xl" fontWeight="bold" mb={2}>
                      Mobil
                    </Text>

                    <VStack spacing={2} align="stretch">
                      {day.mobils.map((mobil, i) => (
                        <MobilCard
                          key={i}
                          index={i}
                          data={mobil}
                          onChange={(newMobil) => {
                            const updated = [...days];
                            updated[index].mobils[i] = newMobil;
                            setDays(updated);
                          }}
                          onDelete={() => {
                            const updated = [...days];
                            updated[index].mobils.splice(i, 1);
                            setDays(updated);
                          }}
                        />
                      ))}
                      <Button
                        variant="outline"
                        colorScheme="teal"
                        onClick={() => {
                          const updated = [...days];
                          updated[index].mobils.push({});
                          setDays(updated);
                        }}
                      >
                        Tambah Mobil
                      </Button>
                    </VStack>
                  </Box>

                  {/* Additional Info */}
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

                  {/* Markup Section */}
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
                          const subtotal =
                            hitungTotalMobil(day.mobils) +
                            hitungTotalAdditional(day.additionalInfo);
                          const markup = day.markup || {
                            type: "percent",
                            value: 0,
                          };
                          const markupAmount =
                            markup.type === "amount"
                              ? markup.value
                              : (markup.value / 100) * subtotal;
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

      {/* TOTAL SECTION */}
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
          Total Harga Transportasi
        </Text>

        {days.map((day, i) => {
          const subtotal =
            hitungTotalMobil(day.mobils) +
            hitungTotalAdditional(day.additionalInfo);
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

              {day.mobils.map((m, mi) => (
                <Box key={mi} mb={2} p={2} bg="gray.800" rounded="md">
                  <Text fontSize="sm" color="teal.200" fontWeight="semibold">
                    Mobil {mi + 1}: {m.mobil?.jenisKendaraan}
                  </Text>
                  <Text fontSize="sm" color="gray.300">
                    - Kategori:{" "}
                    {(() => {
                      const kategoriLabelMap = {
                        fullDay: "Full Day",
                        halfDay: "Half Day",
                        inOut: "In Out",
                        menginap: "Menginap",
                      };
                      return kategoriLabelMap[m.kategori] || m.kategori;
                    })()}
                  </Text>

                  <Text fontSize="sm" color="gray.300">
                    - Area: {m.area}
                  </Text>
                  <Text fontSize="sm" color="gray.300">
                    - {m.jumlah} unit x Rp {m.harga?.toLocaleString("id-ID")}
                  </Text>
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
                Markup: Rp {markupAmount.toLocaleString("id-ID")} (
                {markup.type === "percent" ? `${markup.value}%` : "amount"})
              </Text>
              <Text mt={2} fontWeight="semibold" color="green.300">
                Total Hari Ini: Rp {finalTotal.toLocaleString("id-ID")}
              </Text>
            </Box>
          );
        })}

        <Divider my={4} />
        <Text fontSize="xl" fontWeight="bold" color="green.400">
          Total Transportasi: Rp{" "}
          {days
            .reduce((sum, day) => {
              const subtotal =
                hitungTotalMobil(day.mobils) +
                hitungTotalAdditional(day.additionalInfo);
              const markup = day.markup || { type: "percent", value: 0 };
              const markupAmount =
                markup.type === "amount"
                  ? markup.value
                  : (markup.value / 100) * subtotal;
              return sum + subtotal + markupAmount;
            }, 0)
            .toLocaleString("id-ID")}
        </Text>
      </Box>
    </Container>
  );
};

export default TransportPage;
