// ActivityCard.jsx
import {
  Box,
  HStack,
  Text,
  IconButton,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useMemo } from "react";
import MainSelect from "../../MainSelect";
import { formatWisatawan } from "../../../utils/formatCalculator";
import { usePackageContext } from "../../../context/PackageContext";

// Opsi wisatawan
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
  const { totalPaxAdult: jumlahAdult, totalPaxChildren: jumlahChild } =
    selectedPackage;

  const inputBg = useColorModeValue("gray.700", "gray.700");
  const borderColor = useColorModeValue("gray.600", "gray.600");
  const textColor = useColorModeValue("white", "white");

  // Normalize vendor data without deduplication by name
  const normalizedVendors = useMemo(() => {
    return vendors.map((v) => ({
      ...v,
      nama: v.name_vendor,
      aktivitas: v.activities.map((a) => ({
        id: a.activity_id,
        nama: a.name,
        harga: {
          foreign: {
            adult: a.price_foreign_adult,
            child: a.price_foreign_child,
          },
          domestic: {
            adult: a.price_domestic_adult,
            child: a.price_domestic_child,
          },
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

  const aktivitasOptions = useMemo(() => {
    return (
      selectedVendor?.aktivitas.map((a) => ({
        value: a.id,
        label: a.nama,
      })) || []
    );
  }, [selectedVendor]);

  const selectedAktivitas = useMemo(() => {
    return selectedVendor?.aktivitas.find((a) => a.id === data.id_activity);
  }, [selectedVendor, data.id_activity]);

  const hargaAdult = useMemo(() => {
    return selectedAktivitas?.harga?.[data.jenis_wisatawan]?.adult ?? 0;
  }, [selectedAktivitas, data.jenis_wisatawan]);

  const hargaChild = useMemo(() => {
    return selectedAktivitas?.harga?.[data.jenis_wisatawan]?.child ?? 0;
  }, [selectedAktivitas, data.jenis_wisatawan]);

  const totalHarga = jumlahAdult * hargaAdult + jumlahChild * hargaChild;

  useEffect(() => {
    onChange({
      ...data,
      jumlahAdult,
      jumlahChild,
      hargaAdult,
      hargaChild,
    });
  }, [jumlahAdult, jumlahChild, hargaAdult, hargaChild, dayIndex]);

  const handleSelectChange = (field, val) => {
    const updates = { [field]: val?.value ?? null };
    if (field === "id_vendor") {
      Object.assign(updates, {
        id_activity: null,
        jenis_wisatawan: null,
      });
    }
    if (field === "id_activity") {
      Object.assign(updates, {
        jenis_wisatawan: null,
        description: selectedVendor?.activities.find(
          (a) => a.activity_id === val.value
        )?.description,
      });
    }
    onChange({ ...data, ...updates });
  };

  return (
    <Box bg="gray.600" p={4} rounded="md">
      <HStack justify="space-between" mb={3}>
        <Text fontWeight="bold" color={textColor}>
          Aktivitas {index + 1}
        </Text>
        <IconButton
          size="xs"
          icon={<DeleteIcon />}
          colorScheme="red"
          variant="ghost"
          onClick={onDelete}
          aria-label="hapus aktivitas"
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
            isDisabled={!data.id_vendor}
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
          isDisabled={!data.id_activity}
          placeholder="Pilih Jenis Wisatawan"
        />
      </Box>

      {/* Harga Satuan */}
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

      {/* Jumlah Orang */}
      <HStack spacing={4} mb={3}>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Jumlah Adult
          </Text>
          <Input
            readOnly
            value={jumlahAdult || 0}
            bg={inputBg}
            color={textColor}
            borderColor={borderColor}
          />
        </Box>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Jumlah Child
          </Text>
          <Input
            value={jumlahChild || 0}
            readOnly
            bg={inputBg}
            color={textColor}
            borderColor={borderColor}
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

export default ActivityCard;
