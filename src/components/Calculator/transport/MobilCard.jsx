import {
  Box,
  HStack,
  Text,
  IconButton,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useMemo, useEffect, useState } from "react";
import MainSelect from "../../MainSelect";
import { useTransportContext } from "../../../context/TransportContext";
// NEW
import { useTravelerGroup } from "../../../context/TravelerGroupContext";

const MobilCard = ({ index, onDelete, data = {}, onChange, dayIndex }) => {
  const { mobils } = useTransportContext();
  const inputBg = useColorModeValue("gray.700", "gray.700");
  const borderColor = useColorModeValue("gray.600", "gray.600");
  const textColor = useColorModeValue("white", "white");

  // NEW: traveler context
  const { isAdultActive } = useTravelerGroup();

  const [jumlah, setJumlah] = useState(data.jumlah || 1);

  const convertKeteranganToCamel = (k) => {
    const map = { fullday: "fullDay", halfday: "halfDay", inout: "inOut", menginap: "menginap" };
    return map[k?.toLowerCase()] || k;
  };

  const formattedData = {
    ...data,
    mobil: {
      value: data.id_mobil || data.mobil || null,
      label:
        mobils.find((m) => m.id === (data.id_mobil || data.mobil))
          ?.jenisKendaraan || null,
    },
    keterangan: convertKeteranganToCamel(data.keterangan),
    area: data.id_area || data.area || null,
  };

  const selectedMobil = useMemo(
    () => mobils.find((m) => m.id === formattedData.mobil?.value),
    [mobils, formattedData.mobil]
  );

  const keteranganOptions = useMemo(() => {
    if (!selectedMobil) return [];
    const map = { fullDay: "Full Day", halfDay: "Half Day", inOut: "In Out", menginap: "Menginap" };
    return Object.keys(selectedMobil.keterangan).map((key) => ({
      value: key,
      label: map[key] || key,
    }));
  }, [selectedMobil]);

  const areaOptions = useMemo(() => {
    if (!selectedMobil || !formattedData.keterangan) return [];
    return (
      selectedMobil.keterangan[formattedData.keterangan]?.map((a) => ({
        value: a.id_area,
        label: a.area,
      })) || []
    );
  }, [selectedMobil, formattedData.keterangan]);

  const harga = useMemo(() => {
    if (!selectedMobil || !formattedData.keterangan || !formattedData.area) return 0;
    const found = selectedMobil.keterangan[formattedData.keterangan]?.find(
      (a) => a.id_area === formattedData.area
    );
    return found?.price || 0;
  }, [selectedMobil, formattedData.keterangan, formattedData.area]);

  const totalHarga = (Number(jumlah) || 0) * (Number(harga) || 0);

  useEffect(() => {
    onChange({
      ...formattedData,
      jumlah,
      harga,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jumlah, harga, dayIndex]);

  return (
    <Box bg="gray.600" p={4} rounded="md">
      <HStack justify="space-between" mb={3}>
        <Text fontWeight="bold" color={textColor}>
          Mobil {index + 1}
        </Text>
        <IconButton
          size="xs"
          icon={<DeleteIcon />}
          colorScheme="red"
          variant="ghost"
          onClick={onDelete}
          aria-label="hapus"
          isDisabled={!isAdultActive}
        />
      </HStack>

      {/* Mobil & Keterangan */}
      <HStack spacing={4} mb={3}>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Pilih Mobil
          </Text>
          <MainSelect
            options={mobils.map((m) => ({
              value: m.id,
              label: m.jenisKendaraan,
            }))}
            value={formattedData.mobil}
            onChange={(val) =>
              onChange({
                ...formattedData,
                mobil: val,
                id_mobil: val?.value || null,
                keterangan: null,
                id_area: null,
                area: null,
                harga: 0,
                jumlah: 1,
              })
            }
            placeholder="Pilih Mobil"
            isDisabled={!isAdultActive}
          />
        </Box>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Keterangan
          </Text>
          <MainSelect
            options={keteranganOptions}
            value={
              keteranganOptions.find((k) => k.value === formattedData.keterangan) ||
              null
            }
            onChange={(val) =>
              onChange({
                ...formattedData,
                keterangan: val?.value || null,
                area: null,
                id_area: null,
                harga: 0,
              })
            }
            isDisabled={!isAdultActive || !formattedData.mobil}
            placeholder="Pilih Keterangan"
          />
        </Box>
      </HStack>

      {/* Area & Harga per Unit */}
      <HStack spacing={4} mb={3}>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Area Tujuan
          </Text>
          <MainSelect
            options={areaOptions}
            value={areaOptions.find((a) => a.value === formattedData.area) || null}
            onChange={(val) =>
              onChange({
                ...formattedData,
                area: val?.value || null,
                id_area: val?.value || null,
              })
            }
            isDisabled={!isAdultActive || !formattedData.keterangan}
            placeholder="Pilih Area"
          />
        </Box>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Harga per Unit
          </Text>
          <Input
            value={harga}
            isReadOnly
            bg={inputBg}
            color={textColor}
            borderColor={borderColor}
          />
        </Box>
      </HStack>

      {/* Jumlah & Total Harga */}
      <HStack spacing={4} mb={3}>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Jumlah Unit
          </Text>
          <Input
            value={jumlah}
            onChange={(e) => setJumlah(Number(e.target.value))}
            bg={inputBg}
            color={textColor}
            borderColor={borderColor}
            isReadOnly={!isAdultActive}
          />
        </Box>
      </HStack>

      <Box mt={4}>
        <Text fontWeight="semibold" color="green.300">
          Total Harga: Rp {totalHarga.toLocaleString("id-ID")}
        </Text>
      </Box>
    </Box>
  );
};

export default MobilCard;
