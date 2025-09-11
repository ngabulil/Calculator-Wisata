import {
  Box,
  HStack,
  Text,
  IconButton,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useMemo, useState } from "react";
import MainSelect from "../../MainSelect";
import { formatWisatawan } from "../../../utils/formatCalculator";
import { usePackageContext } from "../../../context/PackageContext";
// NEW
import { useTravelerGroup } from "../../../context/TravelerGroupContext";

const wisatawanOptions = [
  { value: "foreign", label: "Asing" },
  { value: "domestic", label: "Domestik" },
];

const DestinasiCard = ({
  index,
  onDelete,
  data: rawData,
  onChange,
  destinasiList,
  dayIndex,
}) => {
  const data = {
    ...rawData,
    jenis_wisatawan: formatWisatawan(rawData.type_wisata),
  };
  const { selectedPackage } = usePackageContext();
  const { totalPaxAdult, childGroups = [] } = selectedPackage;
  const { isAdultActive, activeTravelerKey } = useTravelerGroup();
  const activeChildTotal =
    childGroups.find((c) => c.id === activeTravelerKey)?.total || 0;

  const inputBg = useColorModeValue("gray.700", "gray.700");
  const borderColor = useColorModeValue("gray.600", "gray.600");
  const textColor = useColorModeValue("white", "white");

  const uniqueDestinasiList = useMemo(() => {
    const seen = new Set();
    return destinasiList
      .filter((d) => {
        if (seen.has(d.name)) return false;
        seen.add(d.name);
        return true;
      })
      .map((d) => ({
        ...d,
        nama: d.name,
        harga: {
          foreign: { adult: d.price_foreign_adult, child: d.price_foreign_child },
          domestic: { adult: d.price_domestic_adult, child: d.price_domestic_child },
        },
      }));
  }, [destinasiList]);

  const selectedDestinasi = useMemo(
    () => uniqueDestinasiList.find((d) => d.id === data.id_destinasi),
    [uniqueDestinasiList, data.id_destinasi]
  );

  const hargaAdult = useMemo(() => {
    if (!selectedDestinasi || !data.jenis_wisatawan) return 0;
    return selectedDestinasi.harga?.[data.jenis_wisatawan]?.adult ?? 0;
  }, [selectedDestinasi, data.jenis_wisatawan]);

  const hargaChild = useMemo(() => {
    if (!selectedDestinasi || !data.jenis_wisatawan) return 0;
    return selectedDestinasi.harga?.[data.jenis_wisatawan]?.child ?? 0;
  }, [selectedDestinasi, data.jenis_wisatawan]);

  // touched flags
  const [adultTouched, setAdultTouched] = useState(false);
  const [childTouched, setChildTouched] = useState(false);

  // default qty per traveler
  useEffect(() => {
    if (isAdultActive) {
      const base = Number(totalPaxAdult) || 0;
      if (!adultTouched && data.jumlahAdult !== base) {
        onChange({ ...data, jumlahAdult: base, hargaAdult, hargaChild });
      }
    } else {
      const base = Number(activeChildTotal) || 0;
      if (!childTouched && data.jumlahChild !== base) {
        onChange({ ...data, jumlahChild: base, hargaAdult, hargaChild });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdultActive, totalPaxAdult, activeChildTotal, hargaAdult, hargaChild, dayIndex]);

  const totalHarga =
    (Number(data.jumlahAdult) || 0) * (Number(hargaAdult) || 0) +
    (Number(data.jumlahChild) || 0) * (Number(hargaChild) || 0);

  const handleSelectChange = (field, val) => {
    if (!isAdultActive) return;
    const updates = {
      [field]: val?.value ?? null,
      description: destinasiList.find((d) => d.id === val?.value)?.description,
    };
    onChange({ ...data, ...updates });
  };

  return (
    <Box bg="gray.600" p={4} rounded="md">
      <HStack justify="space-between" mb={3}>
        <Text fontWeight="bold" color={textColor}>
          Destinasi {index + 1}
        </Text>
        <IconButton
          size="xs"
          icon={<DeleteIcon />}
          colorScheme="red"
          variant="ghost"
          onClick={onDelete}
          aria-label="hapus destinasi"
          isDisabled={!isAdultActive}
        />
      </HStack>

      {/* Pilih Destinasi & Wisatawan */}
      <HStack spacing={4} mb={3}>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Pilih Destinasi
          </Text>
          <MainSelect
            options={uniqueDestinasiList.map((d) => ({
              value: d.id,
              label: d.nama,
            }))}
            value={
              selectedDestinasi
                ? { value: selectedDestinasi.id, label: selectedDestinasi.nama }
                : null
            }
            onChange={(val) => handleSelectChange("id_destinasi", val)}
            placeholder="Pilih Destinasi"
            isDisabled={!isAdultActive}
          />
        </Box>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Pilih Wisatawan
          </Text>
          <MainSelect
            options={wisatawanOptions}
            value={
              wisatawanOptions.find((w) => w.value === data.jenis_wisatawan) ||
              null
            }
            onChange={(val) => handleSelectChange("type_wisata", val)}
            isDisabled={!isAdultActive || !data.id_destinasi}
            placeholder="Pilih Jenis Wisatawan"
          />
        </Box>
      </HStack>

      {/* Harga Satuan (read-only) */}
      <HStack spacing={4} mb={3}>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Harga per Satuan (Adult)
          </Text>
          <Input
            value={hargaAdult}
            isReadOnly
            bg={inputBg}
            color={textColor}
            borderColor={borderColor}
          />
        </Box>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Harga per Satuan (Child)
          </Text>
          <Input
            value={hargaChild}
            isReadOnly
            bg={inputBg}
            color={textColor}
            borderColor={borderColor}
          />
        </Box>
      </HStack>

      {/* Jumlah Orang — conditional */}
      {isAdultActive ? (
        <HStack spacing={4} mb={3}>
          <Box w="50%">
            <Text mb={1} fontSize="sm" color="gray.300">
              Jumlah Adult
            </Text>
            <Input
              value={Number(data.jumlahAdult) || 0}
              onChange={(e) => {
                setAdultTouched(true);
                onChange({ ...data, jumlahAdult: Number(e.target.value) || 0 });
              }}
              bg={inputBg}
              color={textColor}
              borderColor={borderColor}
            />
          </Box>
        </HStack>
      ) : (
        <HStack spacing={4} mb={3}>
          <Box w="50%">
            <Text mb={1} fontSize="sm" color="gray.300">
              Jumlah Child
            </Text>
            <Input
              value={Number(data.jumlahChild) || 0}
              onChange={(e) => {
                setChildTouched(true);
                onChange({ ...data, jumlahChild: Number(e.target.value) || 0 });
              }}
              bg={inputBg}
              color={textColor}
              borderColor={borderColor}
            />
          </Box>
        </HStack>
      )}

      <Box mt={4}>
        <Text fontWeight="semibold" color="green.300">
          Total Harga: Rp {totalHarga.toLocaleString("id-ID")}
        </Text>
      </Box>
    </Box>
  );
};

export default DestinasiCard;
