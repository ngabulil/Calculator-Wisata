import {
  Box,
  Button,
  HStack,
  Input,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import HotelCard from "../akomodasi/HotelCard";
import VillaCard from "../akomodasi/VillaCard";
import InfoCard from "../akomodasi/InfoCard";
import { useEffect, useMemo, useState } from "react";
import { useAkomodasiContext } from "../../../context/AkomodasiContext";
import { usePackageContext } from "../../../context/PackageContext";
import { useGrandTotalContext } from "../../../context/GrandTotalContext";

const AkomodasiTabContent = ({ dayIndex }) => {
  const { getHotels, getVillas, getAdditional } = useAkomodasiContext();
  const { selectedPackage, setSelectedPackage } = usePackageContext();
  const { setAkomodasiTotal } = useGrandTotalContext();
  const currentDay = selectedPackage.days?.[dayIndex] || {};
  const [markupState, setMarkupState] = useState(
    currentDay.markup || { type: "percent", value: 0 }
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timeout;
    timeout = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => {
      setLoading(true);
      clearTimeout(timeout);
    };
  }, [selectedPackage?.id]);

  useEffect(() => {
    getHotels();
    getVillas();
    getAdditional();
  }, []);

  const total = useMemo(() => {
    const totalHotel = (currentDay.hotels || []).reduce(
      (sum, h) =>
        sum +
        (h.jumlahKamar || 0) * (h.hargaPerKamar || 0) +
        (h.useExtrabed ? (h.jumlahExtrabed || 0) * (h.hargaExtrabed || 0) : 0),
      0
    );
    const totalVilla = (currentDay.villas || []).reduce(
      (sum, v) =>
        sum +
        (v.jumlahKamar || 0) * (v.hargaPerKamar || 0) +
        (v.useExtrabed ? (v.jumlahExtrabed || 0) * (v.hargaExtrabed || 0) : 0),
      0
    );
    const totalAdditional = (currentDay.akomodasi_additionals || []).reduce(
      (sum, a) => sum + (a.harga || 0) * (a.jumlah || 1),
      0
    );
    const sub = totalHotel + totalVilla + totalAdditional;
    const mark =
      markupState.type === "percent"
        ? ((markupState.value || 0) * sub) / 100
        : markupState.value || 0;
    return sub + mark;
  }, [
    currentDay.hotels,
    currentDay.villas,
    currentDay.akomodasi_additionals,
    markupState,
  ]);

  const updatePackageDay = (updater) => {
    setSelectedPackage((prev) => {
      const days = [...(prev.days || [])];
      const day = { ...(days[dayIndex] || {}) };
      const newDay = updater(day);
      days[dayIndex] = newDay;
      return { ...prev, days };
    });
  };

  useEffect(() => {
    setAkomodasiTotal((prev) => {
      const akomodasiTotal = [...(prev || [])];
      akomodasiTotal[dayIndex] = total;
      return akomodasiTotal;
    });
  }, [total]);

  if (loading) return null;

  return (
    <VStack spacing={6} align="stretch">
      {(currentDay.hotels || []).map((hotel, i) => (
        <HotelCard
          key={i}
          dayIndex={dayIndex}
          index={i}
          data={hotel}
          onChange={(newHotel) => {
            updatePackageDay((day) => {
              const hotels = [...(day.hotels || [])];
              hotels[i] = newHotel;
              return { ...day, hotels };
            });
          }}
          onDelete={() => {
            updatePackageDay((day) => {
              const hotels = [...(day.hotels || [])];
              hotels.splice(i, 1);
              return { ...day, hotels };
            });
          }}
        />
      ))}
      <Button
        size="sm"
        colorScheme="teal"
        onClick={() => {
          updatePackageDay((day) => {
            const hotels = [...(day.hotels || []), {}];
            return { ...day, hotels };
          });
        }}
      >
        Tambah Hotel
      </Button>

      {(currentDay.villas || []).map((villa, i) => (
        <VillaCard
          key={i}
          index={i}
          data={villa}
          dayIndex={dayIndex}
          onChange={(newVilla) => {
            updatePackageDay((day) => {
              const villas = [...(day.villas || [])];
              villas[i] = newVilla;
              return { ...day, villas };
            });
          }}
          onDelete={() => {
            updatePackageDay((day) => {
              const villas = [...(day.villas || [])];
              villas.splice(i, 1);
              return { ...day, villas };
            });
          }}
        />
      ))}
      <Button
        size="sm"
        colorScheme="teal"
        onClick={() => {
          updatePackageDay((day) => {
            const villas = [...(day.villas || []), {}];
            return { ...day, villas };
          });
        }}
      >
        Tambah Villa
      </Button>

      {(currentDay.akomodasi_additionals || []).map((item, i) => (
        <InfoCard
          key={i}
          index={i}
          data={item}
          dayIndex={dayIndex}
          onChange={(newInfo) => {
            updatePackageDay((day) => {
              const akomodasi_additionals = [
                ...(day.akomodasi_additionals || []),
              ];
              akomodasi_additionals[i] = newInfo;
              return { ...day, akomodasi_additionals };
            });
          }}
          onDelete={() => {
            updatePackageDay((day) => {
              const akomodasi_additionals = [
                ...(day.akomodasi_additionals || []),
              ];
              akomodasi_additionals.splice(i, 1);
              return { ...day, akomodasi_additionals };
            });
          }}
        />
      ))}
      <Button
        size="sm"
        colorScheme="teal"
        onClick={() => {
          updatePackageDay((day) => {
            const akomodasi_additionals = [
              ...(day.akomodasi_additionals || []),
              {},
            ];
            return { ...day, akomodasi_additionals };
          });
        }}
      >
        Tambah Tambahan
      </Button>

      {/* MARKUP */}
      {/* <Box>
        <Text fontWeight="bold" mb={2}>
          Markup
        </Text>
        <HStack>
          <Select
            w="150px"
            value={markupState.type}
            onChange={(e) => {
              const newMarkup = { ...markupState, type: e.target.value };
              setMarkupState(newMarkup);
              updatePackageDay((day) => ({ ...day, markup: newMarkup }));
            }}
          >
            <option value="percent">Persen (%)</option>
            <option value="amount">Nominal (Rp)</option>
          </Select>
          <Input
            w="150px"
            value={markupState.value}
            onChange={(e) => {
              const newMarkup = {
                ...markupState,
                value: Number(e.target.value),
              };
              setMarkupState(newMarkup);
              updatePackageDay((day) => ({ ...day, markup: newMarkup }));
            }}
          />
        </HStack>
      </Box> */}

      <Box fontWeight="bold" mt={4}>
        Total Hari Ini: Rp {total.toLocaleString("id-ID")}
      </Box>
    </VStack>
  );
};

export default AkomodasiTabContent;
