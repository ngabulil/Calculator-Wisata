// AkomodasiTabContent.jsx
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
// NEW
import { useTravelerGroup } from "../../../context/TravelerGroupContext";

const AkomodasiTabContent = ({ dayIndex }) => {
  const { getHotels, getVillas, getAdditional } = useAkomodasiContext();
  const { selectedPackage, setSelectedPackage } = usePackageContext();
  const { setAkomodasiTotal } = useGrandTotalContext();
  const currentDay = selectedPackage.days?.[dayIndex] || {};
  const [markupState, setMarkupState] = useState(
    currentDay.markup || { type: "percent", value: 0 }
  );
  const [loading, setLoading] = useState(true);

  // NEW
  const { isAdultActive, activeTravelerKey } = useTravelerGroup();
  const activeKey = isAdultActive ? "adult" : activeTravelerKey;

  useEffect(() => {
    let timeout = setTimeout(() => setLoading(false), 100);
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

  // NEW: migrasi struktur lama → baru (sekali saja per day)
  useEffect(() => {
    if (!currentDay) return;
    if (currentDay.akomodasi_additionalsByTraveler) return;

    setSelectedPackage((prev) => {
      const days = [...(prev.days || [])];
      const day = { ...(days[dayIndex] || {}) };
      const legacy = Array.isArray(day.akomodasi_additionals)
        ? day.akomodasi_additionals
        : [];
      day.akomodasi_additionalsByTraveler = { adult: legacy };
      // opsional: tetap simpan field lama agar kompatibel, atau hapus jika mau bersih:
      // delete day.akomodasi_additionals;
      days[dayIndex] = day;
      return { ...prev, days };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayIndex, currentDay?.akomodasi_additionalsByTraveler]);

  // helper aman ambil/add array traveler
  const getTravelerAdditionals = (day, key) => {
    const map = day.akomodasi_additionalsByTraveler || {};
    return Array.isArray(map[key]) ? map[key] : [];
  };

  // NEW: total akomodasi + extrabed + SEMUA additional (semua traveler)
  const total = useMemo(() => {
    const sumExtrabedQty = (item) => {
      if (
        item?.extrabedByTraveler &&
        typeof item.extrabedByTraveler === "object"
      ) {
        return Object.values(item.extrabedByTraveler).reduce((acc, eb) => {
          if (!eb) return acc;
          const use = !!eb.use;
          const qty = Number(eb.qty) || 0;
          return acc + (use ? qty : 0);
        }, 0);
      }
      return item?.useExtrabed ? Number(item.jumlahExtrabed) || 0 : 0;
    };

    const totalHotel = (currentDay.hotels || []).reduce((sum, h) => {
      const base =
        (Number(h.jumlahKamar) || 0) * (Number(h.hargaPerKamar) || 0);
      const eb = sumExtrabedQty(h) * (Number(h.hargaExtrabed) || 0);
      return sum + base + eb;
    }, 0);

    const totalVilla = (currentDay.villas || []).reduce((sum, v) => {
      const base =
        (Number(v.jumlahKamar) || 0) * (Number(v.hargaPerKamar) || 0);
      const eb = sumExtrabedQty(v) * (Number(v.hargaExtrabed) || 0);
      return sum + base + eb;
    }, 0);

    // NEW: sum additional semua traveler
    const map = currentDay.akomodasi_additionalsByTraveler || {};
    const allAdditionals = Object.values(map).flat();
    // fallback legacy kalau map belum ada
    const legacy = Array.isArray(currentDay.akomodasi_additionals)
      ? currentDay.akomodasi_additionals
      : [];
    const additionalsToSum =
      map && Object.keys(map).length > 0 ? allAdditionals : legacy;

    const totalAdditional = additionalsToSum.reduce(
      (sum, a) => sum + (Number(a.harga) || 0) * (Number(a.jumlah) || 1),
      0
    );

    const sub = totalHotel + totalVilla + totalAdditional;
    const mark =
      markupState.type === "percent"
        ? ((Number(markupState.value) || 0) * sub) / 100
        : Number(markupState.value) || 0;

    return sub + mark;
  }, [
    currentDay.hotels,
    currentDay.villas,
    currentDay.akomodasi_additionalsByTraveler,
    currentDay.akomodasi_additionals, // legacy fallback
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

  // NEW: array additional traveler aktif
  const activeAdditionals = getTravelerAdditionals(currentDay, activeKey);

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
        isDisabled={!isAdultActive}
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

      {/* Tambah Villa: hanya saat Adult */}
      <Button
        size="sm"
        colorScheme="teal"
        onClick={() => {
          updatePackageDay((day) => {
            const villas = [...(day.villas || []), {}];
            return { ...day, villas };
          });
        }}
        isDisabled={!isAdultActive}
      >
        Tambah Villa
      </Button>

      {/* NEW: render hanya additional milik traveler aktif */}
      {activeAdditionals.map((item, i) => (
        <InfoCard
          key={`${activeKey}-${i}`}
          index={i}
          data={item}
          dayIndex={dayIndex}
          onChange={(newInfo) => {
            updatePackageDay((day) => {
              const map = { ...(day.akomodasi_additionalsByTraveler || {}) };
              const arr = Array.isArray(map[activeKey])
                ? [...map[activeKey]]
                : [];
              arr[i] = newInfo;
              map[activeKey] = arr;
              return { ...day, akomodasi_additionalsByTraveler: map };
            });
          }}
          onDelete={() => {
            updatePackageDay((day) => {
              const map = { ...(day.akomodasi_additionalsByTraveler || {}) };
              const arr = Array.isArray(map[activeKey])
                ? [...map[activeKey]]
                : [];
              arr.splice(i, 1);
              map[activeKey] = arr;
              return { ...day, akomodasi_additionalsByTraveler: map };
            });
          }}
        />
      ))}

      <Button
        size="sm"
        colorScheme="teal"
        onClick={() => {
          updatePackageDay((day) => {
            const map = { ...(day.akomodasi_additionalsByTraveler || {}) };
            const arr = Array.isArray(map[activeKey])
              ? [...map[activeKey]]
              : [];
            arr.push({});
            map[activeKey] = arr;
            return { ...day, akomodasi_additionalsByTraveler: map };
          });
        }}
      >
        Tambah Tambahan
      </Button>

      <Box fontWeight="bold" mt={4}>
        Total Hari Ini: Rp {total.toLocaleString("id-ID")}
      </Box>
    </VStack>
  );
};

export default AkomodasiTabContent;
