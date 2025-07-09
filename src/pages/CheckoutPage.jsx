import React from "react";
import {
  Box,
  Text,
  VStack,
  Divider,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAkomodasiContext } from "../context/AkomodasiContext";
import { useTransportContext } from "../context/TransportContext";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { days } = useAkomodasiContext();
  const { days: transportDays } = useTransportContext();
  const navigate = useNavigate()

  const bg = useColorModeValue("gray.700", "gray.800");
  const sectionBg = useColorModeValue("gray.600", "gray.700");
  const textColor = useColorModeValue("white", "white");

  const hitungTotalHotel = (hotels) =>
    hotels.reduce((total, h) => {
      const extrabed = h.useExtrabed
        ? (h.jumlahExtrabed || 0) * (h.hargaExtrabed || 0)
        : 0;
      return total + (h.jumlahKamar || 0) * (h.hargaPerKamar || 0) + extrabed;
    }, 0);

  const hitungTotalVilla = (villas) =>
    villas.reduce((total, v) => {
      const extrabed = v.useExtrabed
        ? (v.jumlahExtrabed || 0) * (v.hargaExtrabed || 0)
        : 0;
      return total + (v.jumlahKamar || 0) * (v.hargaPerKamar || 0) + extrabed;
    }, 0);

  const hitungTotalAdditional = (additional) =>
    additional.reduce((total, a) => {
      return total + (a.jumlah || 0) * (a.harga || 0);
    }, 0);

  const hitungTotalTransportMobil = (mobils) =>
    mobils.reduce((total, m) => {
      return total + (m.harga || 0) * (m.jumlah || 1);
    }, 0);

  const kategoriLabelMap = {
    fullDay: "Full Day",
    halfDay: "Half Day",
    inOut: "In Out",
    menginap: "Menginap",
  };

  const grandTotalAkomodasi = days.reduce((sum, day) => {
    const totalHotel = hitungTotalHotel(day.hotels);
    const totalVilla = hitungTotalVilla(day.villas);
    const totalAdditional = hitungTotalAdditional(day.additionalInfo);
    const subtotal = totalHotel + totalVilla + totalAdditional;

    const markup = day.markup || { type: "percent", value: 0 };
    const markupAmount =
      markup.type === "amount"
        ? markup.value
        : (markup.value / 100) * subtotal;

    return sum + subtotal + markupAmount;
  }, 0);

  const grandTotalTransport = transportDays.reduce((sum, day) => {
    const totalMobil = hitungTotalTransportMobil(day.mobils);
    const totalAdditional = hitungTotalAdditional(day.additionalInfo);
    const subtotal = totalMobil + totalAdditional;

    const markup = day.markup || { type: "percent", value: 0 };
    const markupAmount =
      markup.type === "amount"
        ? markup.value
        : (markup.value / 100) * subtotal;

    return sum + subtotal + markupAmount;
  }, 0);

  const handleBuatPesanan = () => {
    navigate("/expenses");
  }

  const totalKeseluruhan = grandTotalAkomodasi + grandTotalTransport;

  return (
    <Box py={6}>
      <Box bg={bg} p={6} rounded="lg" shadow="lg" color={textColor}>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Rincian Akomodasi
        </Text>

        <VStack spacing={6} align="stretch">
          {days.length === 0 && (
            <Text color="gray.400" fontStyle="italic">
              Tidak ada data akomodasi.
            </Text>
          )}

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

            const totalDay = subtotal + markupAmount;

            return (
              <Box
                key={i}
                bg={sectionBg}
                p={4}
                rounded="md"
                border="1px solid"
                borderColor="gray.500"
              >
                <Text fontWeight="bold" color="teal.300" mb={2}>
                  Day {i + 1} - {day.description}
                </Text>

                {(day.hotels || []).map((h, hi) => (
                  <Box key={hi} mb={2}>
                    <Text fontWeight="semibold" color="gray.200">
                      Hotel {hi + 1}: {h.hotel?.label}
                    </Text>
                    <Text fontSize="sm">- {h.roomType?.label}</Text>
                    <Text fontSize="sm">- {h.seasonLabel}</Text>
                    <Text fontSize="sm">
                      - {h.jumlahKamar} kamar x Rp{" "}
                      {h.hargaPerKamar?.toLocaleString("id-ID")}
                    </Text>
                    {h.useExtrabed && (
                      <Text fontSize="sm">
                        - Extrabed: {h.jumlahExtrabed} x Rp{" "}
                        {h.hargaExtrabed?.toLocaleString("id-ID")}
                      </Text>
                    )}
                  </Box>
                ))}

                {(day.villas || []).map((v, vi) => (
                  <Box key={vi} mb={2}>
                    <Text fontWeight="semibold" color="gray.200">
                      Villa {vi + 1}: {v.villa?.label}
                    </Text>
                    <Text fontSize="sm">- {v.roomType?.label}</Text>
                    <Text fontSize="sm">- {v.seasonLabel}</Text>
                    <Text fontSize="sm">
                      - {v.jumlahKamar} kamar x Rp{" "}
                      {v.hargaPerKamar?.toLocaleString("id-ID")}
                    </Text>
                    {v.useExtrabed && (
                      <Text fontSize="sm">
                        - Extrabed: {v.jumlahExtrabed} x Rp{" "}
                        {v.hargaExtrabed?.toLocaleString("id-ID")}
                      </Text>
                    )}
                  </Box>
                ))}

                {(day.additionalInfo || []).map((a, ai) => (
                  <Box key={ai} mb={2}>
                    <Text fontWeight="semibold" color="gray.200">
                      Additional {ai + 1}: {a.nama}
                    </Text>
                    <Text fontSize="sm">
                      - {a.jumlah} x Rp {a.harga?.toLocaleString("id-ID")}
                    </Text>
                  </Box>
                ))}

                <Text fontSize="sm" color="gray.400" mt={2}>
                  Subtotal: Rp {subtotal.toLocaleString("id-ID")}
                </Text>
                <Text fontSize="sm" color="gray.400">
                  Markup: Rp {markupAmount.toLocaleString("id-ID")} (
                  {markup.type === "percent"
                    ? `${markup.value}%`
                    : "amount"})
                </Text>
                <Text fontWeight="bold" color="green.300" mt={1}>
                  Total Hari Ini: Rp {totalDay.toLocaleString("id-ID")}
                </Text>
              </Box>
            );
          })}
        </VStack>

        <Divider my={6} />

        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Rincian Transportasi
        </Text>

        <VStack spacing={6} align="stretch">
          {transportDays.length === 0 && (
            <Text color="gray.400" fontStyle="italic">
              Tidak ada data transportasi.
            </Text>
          )}

          {transportDays.map((day, i) => {
            const totalMobil = hitungTotalTransportMobil(day.mobils);
            const totalAdditional = hitungTotalAdditional(day.additionalInfo);
            const subtotal = totalMobil + totalAdditional;

            const markup = day.markup || { type: "percent", value: 0 };
            const markupAmount =
              markup.type === "amount"
                ? markup.value
                : (markup.value / 100) * subtotal;

            const totalDay = subtotal + markupAmount;

            return (
              <Box
                key={i}
                bg={sectionBg}
                p={4}
                rounded="md"
                border="1px solid"
                borderColor="gray.500"
              >
                <Text fontWeight="bold" color="blue.300" mb={2}>
                  Day {i + 1} - {day.description}
                </Text>

                {(day.mobils || []).map((m, mi) => (
                  <Box key={mi} mb={2}>
                    <Text fontWeight="semibold" color="gray.200">
                      Mobil {mi + 1}: {m.mobil?.label}
                    </Text>
                    <Text fontSize="sm">
                      - Kategori: {kategoriLabelMap[m.kategori] || m.kategori}
                    </Text>
                    <Text fontSize="sm">- Area: {m.area}</Text>
                    <Text fontSize="sm">
                      - {m.jumlah} x Rp {m.harga?.toLocaleString("id-ID")}
                    </Text>
                  </Box>
                ))}

                {(day.additionalInfo || []).map((a, ai) => (
                  <Box key={ai} mb={2}>
                    <Text fontWeight="semibold" color="gray.200">
                      Additional {ai + 1}: {a.nama}
                    </Text>
                    <Text fontSize="sm">
                      - {a.jumlah} x Rp {a.harga?.toLocaleString("id-ID")}
                    </Text>
                  </Box>
                ))}

                <Text fontSize="sm" color="gray.400" mt={2}>
                  Subtotal: Rp {subtotal.toLocaleString("id-ID")}
                </Text>
                <Text fontSize="sm" color="gray.400">
                  Markup: Rp {markupAmount.toLocaleString("id-ID")} (
                  {markup.type === "percent"
                    ? `${markup.value}%`
                    : "amount"})
                </Text>
                <Text fontWeight="bold" color="green.300" mt={1}>
                  Total Hari Ini: Rp {totalDay.toLocaleString("id-ID")}
                </Text>
              </Box>
            );
          })}
        </VStack>

        <Divider my={6} />

        <Box textAlign="right">
          <Text fontSize="xl" fontWeight="bold" color="green.400">
            Total Akomodasi: Rp {grandTotalAkomodasi.toLocaleString("id-ID")}
          </Text>
          <Text fontSize="xl" fontWeight="bold" color="green.400">
            Total Transportasi: Rp {grandTotalTransport.toLocaleString("id-ID")}
          </Text>
          <Text fontSize="2xl" fontWeight="extrabold" color="yellow.300" mt={2}>
            Total Keseluruhan: Rp {totalKeseluruhan.toLocaleString("id-ID")}
          </Text>
        </Box>
      </Box>

      <Box textAlign="right" mt={6}>
        <Button colorScheme="teal" size="lg" onClick={handleBuatPesanan}>
          Buat Pesanan
        </Button>
      </Box>
    </Box>
  );
};

export default CheckoutPage;
