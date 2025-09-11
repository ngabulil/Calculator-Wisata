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

const ActivityCard = ({
  index,
  onDelete,
  data: rawData,
  onChange,
  vendors,
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

  // Normalized vendors
  const normalizedVendors = useMemo(() => {
    return vendors.map((v) => ({
      ...v,
      nama: v.name_vendor,
      aktivitas: v.activities.map((a) => ({
        id: a.activity_id,
        nama: a.name,
        harga: {
          foreign: { adult: a.price_foreign_adult, child: a.price_foreign_child },
          domestic: { adult: a.price_domestic_adult, child: a.price_domestic_child },
        },
        note: a.note,
        keterangan: a.keterangan,
      })),
    }));
  }, [vendors]);

  const selectedVendor = useMemo(
    () => normalizedVendors.find((v) => v.id === data.id_vendor),
    [normalizedVendors, data.id_vendor]
  );

  const aktivitasOptions = useMemo(
    () => selectedVendor?.aktivitas.map((a) => ({ value: a.id, label: a.nama })) || [],
    [selectedVendor]
  );

  const selectedAktivitas = useMemo(
    () => selectedVendor?.aktivitas.find((a) => a.id === data.id_activity),
    [selectedVendor, data.id_activity]
  );

  const hargaAdult = useMemo(
    () => selectedAktivitas?.harga?.[data.jenis_wisatawan]?.adult ?? 0,
    [selectedAktivitas, data.jenis_wisatawan]
  );
  const hargaChild = useMemo(
    () => selectedAktivitas?.harga?.[data.jenis_wisatawan]?.child ?? 0,
    [selectedAktivitas, data.jenis_wisatawan]
  );

  // touched flags
  const [adultTouched, setAdultTouched] = useState(false);
  const [childTouched, setChildTouched] = useState(false);

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
    const updates = { [field]: val?.value ?? null };
    if (field === "id_vendor") {
      Object.assign(updates, { id_activity: null, jenis_wisatawan: null });
    }
    if (field === "id_activity") {
      Object.assign(updates, { jenis_wisatawan: null });
    }
    onChange({ ...data, ...updates });
  };

  return (
    <Box bg="gray.600" p={4} rounded="md">
      <HStack justify="space-between" mb={3}>
        <Text fontWeight="bold" color={textColor}>
          [{index + 1}] Aktivitas
        </Text>
        <IconButton
          size="xs"
          icon={<DeleteIcon />}
          colorScheme="red"
          variant="ghost"
          onClick={onDelete}
          aria-label="hapus aktivitas"
          isDisabled={!isAdultActive}
        />
      </HStack>

      {/* Vendor & Aktivitas */}
      <HStack spacing={4} mb={3}>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Pilih Vendor
          </Text>
          <MainSelect
            options={normalizedVendors.map((v) => ({
              value: v.id,
              label: `${v.nama}`,
            }))}
            value={
              selectedVendor
                ? { value: selectedVendor.id, label: `${selectedVendor.nama}` }
                : null
            }
            onChange={(val) => handleSelectChange("id_vendor", val)}
            placeholder="Pilih Vendor"
            isDisabled={!isAdultActive}
          />
        </Box>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Pilih Aktivitas
          </Text>
          <MainSelect
            options={aktivitasOptions}
            value={
              selectedAktivitas
                ? { value: selectedAktivitas.id, label: selectedAktivitas.nama }
                : null
            }
            onChange={(val) => handleSelectChange("id_activity", val)}
            isDisabled={!isAdultActive || !data.id_vendor}
            placeholder="Pilih Aktivitas"
          />
        </Box>
      </HStack>

      {/* Wisatawan */}
      <Box mb={3}>
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
          isDisabled={!isAdultActive || !data.id_activity}
          placeholder="Pilih Jenis Wisatawan"
        />
      </Box>

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

export default ActivityCard;
