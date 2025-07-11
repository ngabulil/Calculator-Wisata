// RestoCard.jsx
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

const wisatawanOptions = [
  { value: "foreign", label: "Asing" },
  { value: "domestic", label: "Domestik" },
];

const RestoCard = ({
  index,
  onDelete,
  data: rawData,
  onChange,
  restaurants,
  dayIndex,
}) => {
  const data = {
    ...rawData,
    jenis_wisatawan: formatWisatawan(rawData.type_wisata),
  };
  const inputBg = useColorModeValue("gray.700", "gray.700");
  const borderColor = useColorModeValue("gray.600", "gray.600");
  const textColor = useColorModeValue("white", "white");

  const [jumlahAdult, setJumlahAdult] = useState(data.jumlahAdult ?? 1);
  const [jumlahChild, setJumlahChild] = useState(data.jumlahChild ?? 0);

  // Normalize restaurants and menus
  const normalizedRestaurants = useMemo(() => {
    return restaurants.map((r) => ({
      ...r,
      nama: r.resto_name,
      menus: r.packages.map((p) => ({
        id: p.id_package,
        nama: `${p.package_name} ${p.pax ? `(${p.pax})` : ""}`,
        harga: {
          foreign: {
            adult: p.price_foreign_adult,
            child: p.price_foreign_child,
          },
          domestic: {
            adult: p.price_domestic_adult,
            child: p.price_domestic_child,
          },
        },
        note: p.note,
        link_contract: p.link_contract,
      })),
    }));
  }, [restaurants]);

  const selectedResto = useMemo(
    () => normalizedRestaurants.find((r) => r.id === data.id_resto),
    [normalizedRestaurants, data.id_resto]
  );

  const menuOptions = useMemo(() => {
    return (
      selectedResto?.menus.map((m) => ({
        value: m.id,
        label: m.nama,
      })) || []
    );
  }, [selectedResto]);

  const selectedMenu = useMemo(() => {
    return selectedResto?.menus.find((m) => m.id === data.id_menu);
  }, [selectedResto, data.id_menu]);

  const hargaAdult = useMemo(() => {
    return selectedMenu?.harga?.[data.jenis_wisatawan]?.adult ?? 0;
  }, [selectedMenu, data.jenis_wisatawan]);

  const hargaChild = useMemo(() => {
    return selectedMenu?.harga?.[data.jenis_wisatawan]?.child ?? 0;
  }, [selectedMenu, data.jenis_wisatawan]);

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
    if (field === "id_resto") {
      Object.assign(updates, {
        id_menu: null,
        jenis_wisatawan: null,
      });
    }
    if (field === "id_menu") {
      Object.assign(updates, {
        jenis_wisatawan: null,
      });
    }

    onChange({ ...data, ...updates });
    setJumlahAdult(1);
    setJumlahChild(0);
  };

  return (
    <Box bg="gray.600" p={4} rounded="md">
      <HStack justify="space-between" mb={3}>
        <Text fontWeight="bold" color={textColor}>
          Restoran {index + 1}
        </Text>
        <IconButton
          size="xs"
          icon={<DeleteIcon />}
          colorScheme="red"
          variant="ghost"
          onClick={onDelete}
          aria-label="hapus restoran"
        />
      </HStack>

      {/* Pilih Restoran & Menu */}
      <HStack spacing={4} mb={3}>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Pilih Nama Restoran
          </Text>
          <MainSelect
            options={normalizedRestaurants.map((r) => ({
              value: r.id,
              label: `${r.nama}`,
            }))}
            value={
              selectedResto
                ? { value: selectedResto.id, label: `${selectedResto.nama}` }
                : null
            }
            onChange={(val) => handleSelectChange("id_resto", val)}
            placeholder="Pilih Restoran"
          />
        </Box>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Pilih Menu / Paket
          </Text>
          <MainSelect
            options={menuOptions}
            value={
              selectedMenu
                ? { value: selectedMenu.id, label: selectedMenu.nama }
                : null
            }
            onChange={(val) => handleSelectChange("id_menu", val)}
            isDisabled={!data.id_resto}
            placeholder="Pilih Menu / Paket"
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
          isDisabled={!data.id_menu}
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
            min={0}
            value={jumlahAdult}
            onChange={(e) => setJumlahAdult(Number(e.target.value))}
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
            min={0}
            value={jumlahChild}
            onChange={(e) => setJumlahChild(Number(e.target.value))}
            bg={inputBg}
            color={textColor}
            borderColor={borderColor}
          />
        </Box>
      </HStack>

      {/* Total Harga */}
      <Box mt={4}>
        <Text fontWeight="semibold" color="green.300">
          Total Harga: Rp {totalHarga.toLocaleString("id-ID")}
        </Text>
      </Box>
    </Box>
  );
};

export default RestoCard;
