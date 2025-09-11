import {
  Box,
  Button,
  HStack,
  Input,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import MobilCard from "../transport/MobilCard";
import InfoCard from "../transport/InfoCard";
import { useTransportContext } from "../../../context/TransportContext";
import { usePackageContext } from "../../../context/PackageContext";
import { useGrandTotalContext } from "../../../context/GrandTotalContext";
// NEW
import { useTravelerGroup } from "../../../context/TravelerGroupContext";

const TransportTabContent = ({ dayIndex }) => {
  const { getMobils, getAdditionalMobil } = useTransportContext();
  const { selectedPackage, setSelectedPackage } = usePackageContext();
  const { setTransportTotal } = useGrandTotalContext();

  const currentDay = selectedPackage.days?.[dayIndex] || {};
  const [markupState, setMarkupState] = useState(
    currentDay.markup || { type: "percent", value: 0 }
  );
  const [loading, setLoading] = useState(true);

  // NEW: traveler context
  const { isAdultActive, activeTravelerKey } = useTravelerGroup();

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
    getMobils();
    getAdditionalMobil();
  }, []);

  // Helper read/write additional per traveler
  const additionalByGroup = currentDay.transport_additionals_by_group || {};
  const legacyAdditional = currentDay.transport_additionals || [];
  const activeAdditionalList =
    additionalByGroup[activeTravelerKey] ??
    // fallback: kalau belum ada struktur per-group, pakai legacy utk Adult
    (activeTravelerKey === "adult" ? legacyAdditional : []);

  const total = useMemo(() => {
    const totalMobil = (currentDay.mobils || []).reduce(
      (sum, m) => sum + (Number(m.harga) || 0) * (Number(m.jumlah) || 1),
      0
    );

    let totalAdditional = 0;
    if (Object.keys(additionalByGroup).length > 0) {
      totalAdditional = Object.values(additionalByGroup)
        .flat()
        .reduce(
          (sum, a) => sum + (Number(a.harga) || 0) * (Number(a.jumlah) || 1),
          0
        );
    } else {
      // legacy mode (sebelum per-group)
      totalAdditional = legacyAdditional.reduce(
        (sum, a) => sum + (Number(a.harga) || 0) * (Number(a.jumlah) || 1),
        0
      );
    }

    const subtotal = totalMobil + totalAdditional;
    const markup =
      markupState.type === "percent"
        ? ((Number(markupState.value) || 0) / 100) * subtotal
        : Number(markupState.value) || 0;
    return subtotal + markup;
  }, [
    currentDay.mobils,
    additionalByGroup,
    legacyAdditional,
    markupState.type,
    markupState.value,
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
    setTransportTotal((prev) => {
      const newTotal = [...(prev || [])];
      newTotal[dayIndex] = total;
      return newTotal;
    });
  }, [total]);

  if (loading) return null;

  return (
    <VStack spacing={6} align="stretch">
      {/* Mobil (HANYA Adult yang bisa edit/tambah/hapus) */}
      {(currentDay.mobils || []).map((mobil, i) => (
        <MobilCard
          dayIndex={dayIndex}
          key={i}
          index={i}
          data={mobil}
          onChange={(newMobil) => {
            updatePackageDay((d) => {
              const mobils = [...(d.mobils || [])];
              mobils[i] = newMobil;
              return { ...d, mobils };
            });
          }}
          onDelete={() => {
            if (!isAdultActive) return;
            updatePackageDay((d) => {
              const mobils = [...(d.mobils || [])];
              mobils.splice(i, 1);
              return { ...d, mobils };
            });
          }}
        />
      ))}

      <Button
        size="sm"
        colorScheme="teal"
        onClick={() => {
          if (!isAdultActive) return;
          updatePackageDay((d) => ({
            ...d,
            mobils: [...(d.mobils || []), {}],
          }));
        }}
        isDisabled={!isAdultActive}
      >
        Tambah Mobil
      </Button>

      {/* Additional Info (per traveler) */}
      {activeAdditionalList.map((info, i) => (
        <InfoCard
          dayIndex={dayIndex}
          key={i}
          index={i}
          data={info}
          onChange={(newInfo) => {
            updatePackageDay((d) => {
              const map = { ...(d.transport_additionals_by_group || {}) };
              const baseList =
                map[activeTravelerKey] ??
                (activeTravelerKey === "adult"
                  ? d.transport_additionals || []
                  : []);
              const list = [...baseList];
              list[i] = newInfo;
              map[activeTravelerKey] = list;
              return {
                ...d,
                transport_additionals_by_group: map,
              };
            });
          }}
          onDelete={() => {
            updatePackageDay((d) => {
              const map = { ...(d.transport_additionals_by_group || {}) };
              const baseList =
                map[activeTravelerKey] ??
                (activeTravelerKey === "adult"
                  ? d.transport_additionals || []
                  : []);
              const list = [...baseList];
              list.splice(i, 1);
              map[activeTravelerKey] = list;
              return {
                ...d,
                transport_additionals_by_group: map,
              };
            });
          }}
        />
      ))}

      <Button
        size="sm"
        colorScheme="teal"
        onClick={() => {
          updatePackageDay((d) => {
            const map = { ...(d.transport_additionals_by_group || {}) };
            const baseList =
              map[activeTravelerKey] ??
              (activeTravelerKey === "adult" ? d.transport_additionals || [] : []);
            map[activeTravelerKey] = [...baseList, {}];
            return {
              ...d,
              transport_additionals_by_group: map,
            };
          });
        }}
      >
        Tambah Tambahan
      </Button>

      {/* Total Hari Ini */}
      <Box fontWeight="bold" mt={4}>
        Total Hari Ini: Rp {total.toLocaleString("id-ID")}
      </Box>
    </VStack>
  );
};

export default TransportTabContent;
