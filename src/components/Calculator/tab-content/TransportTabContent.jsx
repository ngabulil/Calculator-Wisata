import {
  Box,
  Button,
  HStack,
  Input,
  Select,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import MobilCard from "../transport/MobilCard";
import InfoCard from "../transport/InfoCard";
import { useTransportContext } from "../../../context/TransportContext";
import { usePackageContext } from "../../../context/PackageContext";
import { useGrandTotalContext } from "../../../context/GrandTotalContext";

const TransportTabContent = ({ dayIndex }) => {
  const { getMobils, getAdditionalMobil } = useTransportContext();
  const { selectedPackage, setSelectedPackage } = usePackageContext();
  const { setTransportTotal } = useGrandTotalContext();

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
    getMobils();
    getAdditionalMobil();
  }, []);

  const total = useMemo(() => {
    const totalMobil = (currentDay.mobils || []).reduce(
      (sum, m) => sum + (m.harga || 0) * (m.jumlah || 1),
      0
    );
    const totalAdditional = (currentDay.transport_additionals || []).reduce(
      (sum, a) => sum + (a.harga || 0) * (a.jumlah || 1),
      0
    );
    const subtotal = totalMobil + totalAdditional;
    const markup =
      markupState.type === "percent"
        ? (markupState.value / 100) * subtotal
        : markupState.value;
    return subtotal + markup;
  }, [currentDay.mobils, currentDay.transport_additionals, markupState]);

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
      const newTotal = [...prev];
      newTotal[dayIndex] = total;
      return newTotal;
    });
  }, [total]);

  if (loading) return null;

  return (
    <VStack spacing={6} align="stretch">
      {/* Mobil */}
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
          updatePackageDay((d) => ({
            ...d,
            mobils: [...(d.mobils || []), {}],
          }));
        }}
      >
        Tambah Mobil
      </Button>

      {/* Additional Info */}
      {(currentDay.transport_additionals || []).map((info, i) => (
        <InfoCard
          dayIndex={dayIndex}
          key={i}
          index={i}
          data={info}
          onChange={(newInfo) => {
            updatePackageDay((d) => {
              const transport_additionals = [
                ...(d.transport_additionals || []),
              ];
              transport_additionals[i] = newInfo;
              return { ...d, transport_additionals };
            });
          }}
          onDelete={() => {
            updatePackageDay((d) => {
              const transport_additionals = [
                ...(d.transport_additionals || []),
              ];
              transport_additionals.splice(i, 1);
              return { ...d, transport_additionals };
            });
          }}
        />
      ))}
      <Button
        size="sm"
        colorScheme="teal"
        onClick={() => {
          updatePackageDay((d) => ({
            ...d,
            transport_additionals: [...(d.transport_additionals || []), {}],
          }));
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
              updatePackageDay((d) => ({ ...d, markup: newMarkup }));
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
              updatePackageDay((d) => ({ ...d, markup: newMarkup }));
            }}
          />
        </HStack>
      </Box> */}

      {/* Total Hari Ini */}
      <Box fontWeight="bold" mt={4}>
        Total Hari Ini: Rp {total.toLocaleString("id-ID")}
      </Box>
    </VStack>
  );
};

export default TransportTabContent;
