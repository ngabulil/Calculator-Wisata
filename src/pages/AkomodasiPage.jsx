import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Text,
  VStack,
  Tabs,
  TabPanels,
  TabPanel,
  useColorModeValue,
  Button,
  HStack,
  Select,
  Input,
} from "@chakra-ui/react";
import HotelCard from "../components/Calculator/akomodasi/HotelCard";
import VillaCard from "../components/Calculator/akomodasi/VillaCard";
import InfoCard from "../components/Calculator/akomodasi/InfoCard";
import { useAkomodasiContext } from "../context/AkomodasiContext";
import { useCheckoutContext } from "../context/CheckoutContext";
import { usePackageContext } from "../context/PackageContext";

const AkomodasiPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { getHotels, getVillas, getAdditional } = useAkomodasiContext();
  const { setAkomodasiTotal } = useCheckoutContext();
  const { selectedPackage, setSelectedPackage } = usePackageContext();
  const days = selectedPackage.days || [];

  useEffect(() => {
    getHotels();
    getVillas();
    getAdditional();
  }, []);

  useEffect(() => {
    let total = 0;

    days.forEach((day) => {
      const totalHotel = (day.hotels || []).reduce(
        (sum, h) =>
          sum +
          (h.jumlahKamar || 0) * (h.hargaPerKamar || 0) +
          (h.useExtrabed ? (h.jumlahExtrabed || 0) * (h.hargaExtrabed || 0) : 0),
        0
      );

      const totalVilla = (day.villas || []).reduce(
        (sum, v) =>
          sum +
          (v.jumlahKamar || 0) * (v.hargaPerKamar || 0) +
          (v.useExtrabed ? (v.jumlahExtrabed || 0) * (v.hargaExtrabed || 0) : 0),
        0
      );

      const totalAdditional = (day.akomodasi_additionals || []).reduce(
        (sum, a) => sum + (a.harga || 0) * (a.jumlah || 0),
        0
      );

      const subTotal = totalHotel + totalVilla + totalAdditional;
      const markup = day.markup || {};
      const markupValue =
        markup.type === "percent"
          ? ((markup.value || 0) * subTotal) / 100
          : markup.value || 0;

      total += subTotal + markupValue;
    });

    setAkomodasiTotal(total);
  }, [days]);

  const cardBg = useColorModeValue("gray.700", "gray.800");
  const textColor = useColorModeValue("white", "white");

  return (
    <Container maxW="7xl" py={6} px={0}>
      <Box bg={cardBg} rounded="lg" p={6} boxShadow="lg" color={textColor}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Akomodasi
        </Text>

        <Tabs index={activeIndex} onChange={setActiveIndex}>
          <TabPanels>
            {days.map((day, index) => {
              const markup = day.markup || { type: "percent", value: 0 };
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
              const subTotal = totalHotel + totalVilla + totalAdditional;
              const markupNominal =
                markup.type === "percent"
                  ? (markup.value || 0) * subTotal / 100
                  : markup.value || 0;
              const total = subTotal + markupNominal;

              return (
                <TabPanel key={index} px={0}>
                  <VStack spacing={6} align="stretch">
                    {/* HOTEL LIST */}
                    {(day.hotels || []).map((hotel, i) => (
                      <HotelCard
                        key={i}
                        index={i}
                        data={hotel}
                        onChange={(newHotel) => {
                          const updated = [...days];
                          updated[index].hotels[i] = newHotel;
                          setSelectedPackage((prev) => ({
                            ...prev,
                            days: updated,
                          }));
                        }}
                        onDelete={() => {
                          const updated = [...days];
                          updated[index].hotels.splice(i, 1);
                          setSelectedPackage((prev) => ({
                            ...prev,
                            days: updated,
                          }));
                        }}
                      />
                    ))}
                    <Button
                      colorScheme="teal"
                      size="sm"
                      onClick={() => {
                        const updated = [...days];
                        updated[index].hotels = [...(day.hotels || []), {}];
                        setSelectedPackage((prev) => ({ ...prev, days: updated }));
                      }}
                    >
                      Tambah Hotel
                    </Button>

                    {/* VILLA LIST */}
                    {(day.villas || []).map((villa, i) => (
                      <VillaCard
                        key={i}
                        index={i}
                        data={villa}
                        onChange={(newVilla) => {
                          const updated = [...days];
                          updated[index].villas[i] = newVilla;
                          setSelectedPackage((prev) => ({
                            ...prev,
                            days: updated,
                          }));
                        }}
                        onDelete={() => {
                          const updated = [...days];
                          updated[index].villas.splice(i, 1);
                          setSelectedPackage((prev) => ({
                            ...prev,
                            days: updated,
                          }));
                        }}
                      />
                    ))}
                    <Button
                      colorScheme="teal"
                      size="sm"
                      onClick={() => {
                        const updated = [...days];
                        updated[index].villas = [...(day.villas || []), {}];
                        setSelectedPackage((prev) => ({ ...prev, days: updated }));
                      }}
                    >
                      Tambah Villa
                    </Button>

                    {/* ADDITIONAL LIST */}
                    {(day.akomodasi_additionals || []).map((item, i) => (
                      <InfoCard
                        key={i}
                        index={i}
                        data={item}
                        onChange={(newInfo) => {
                          const updated = [...days];
                          updated[index].akomodasi_additionals[i] = newInfo;
                          setSelectedPackage((prev) => ({
                            ...prev,
                            days: updated,
                          }));
                        }}
                        onDelete={() => {
                          const updated = [...days];
                          updated[index].akomodasi_additionals.splice(i, 1);
                          setSelectedPackage((prev) => ({
                            ...prev,
                            days: updated,
                          }));
                        }}
                      />
                    ))}
                    <Button
                      colorScheme="teal"
                      size="sm"
                      onClick={() => {
                        const updated = [...days];
                        updated[index].akomodasi_additionals = [
                          ...(day.akomodasi_additionals || []),
                          {},
                        ];
                        setSelectedPackage((prev) => ({ ...prev, days: updated }));
                      }}
                    >
                      Tambah Tambahan
                    </Button>

                    {/* MARKUP */}
                    <Box>
                      <Text fontWeight="bold" mb={2}>
                        Markup
                      </Text>
                      <HStack>
                        <Select
                          w="150px"
                          value={markup.type}
                          onChange={(e) => {
                            const updated = [...days];
                            updated[index].markup = {
                              ...markup,
                              type: e.target.value,
                            };
                            setSelectedPackage((prev) => ({
                              ...prev,
                              days: updated,
                            }));
                          }}
                        >
                          <option value="percent">Persen (%)</option>
                          <option value="amount">Nominal (Rp)</option>
                        </Select>
                        <Input
                          w="150px"
                          value={markup.value}
                          onChange={(e) => {
                            const updated = [...days];
                            updated[index].markup = {
                              ...markup,
                              value: Number(e.target.value),
                            };
                            setSelectedPackage((prev) => ({
                              ...prev,
                              days: updated,
                            }));
                          }}
                        />
                      </HStack>
                    </Box>

                    {/* TOTAL */}
                    <Box fontWeight="bold" mt={4}>
                      Total Hari Ini: Rp {total.toLocaleString("id-ID")}
                    </Box>
                  </VStack>
                </TabPanel>
              );
            })}
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default AkomodasiPage;
