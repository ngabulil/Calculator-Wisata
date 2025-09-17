import {
  Box,
  HStack,
  Text,
  IconButton,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import MainSelect from "../../MainSelect";
import { formatWisatawan } from "../../../utils/formatCalculator";
import { usePackageContext } from "../../../context/PackageContext";
// NEW
import { useTravelerGroup } from "../../../context/TravelerGroupContext";

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
  const { selectedPackage } = usePackageContext();
  const { totalPaxAdult, childGroups = [] } = selectedPackage;

  // NEW
  const { isAdultActive, activeTravelerKey } = useTravelerGroup();
  const activeChildTotal =
    childGroups.find((c) => c.id === activeTravelerKey)?.total || 0;

  const inputBg = useColorModeValue("gray.700", "gray.700");
  const borderColor = useColorModeValue("gray.600", "gray.600");
  const textColor = useColorModeValue("white", "white");

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

  const menuOptions = useMemo(
    () =>
      selectedResto?.menus.map((m) => ({ value: m.id, label: m.nama })) || [],
    [selectedResto]
  );

  const selectedMenu = useMemo(
    () => selectedResto?.menus.find((m) => m.id === data.id_menu),
    [selectedResto, data.id_menu]
  );

  const hargaAdult = useMemo(
    () => selectedMenu?.harga?.[data.jenis_wisatawan]?.adult ?? 0,
    [selectedMenu, data.jenis_wisatawan]
  );
  const hargaChild = useMemo(
    () => selectedMenu?.harga?.[data.jenis_wisatawan]?.child ?? 0,
    [selectedMenu, data.jenis_wisatawan]
  );

  // NEW: track apakah qty sudah diedit manual
  const [touched, setTouched] = useState({});

  useEffect(() => {
    onChange({ ...data, hargaAdult, hargaChild });
    // dayIndex ikut supaya aman saat pindah hari
  }, [hargaAdult, hargaChild, dayIndex]);

  useEffect(() => {
    const q = data.quantities || {};
    let changed = false;
    const next = { ...q };
    const baseAdult = Number(totalPaxAdult) || 0;
    if (!touched.adult && (next.adult ?? undefined) !== baseAdult) {
      next.adult = baseAdult;
      changed = true;
    }
    childGroups.forEach((cg) => {
      const base = Number(cg.total) || 0;
      if (!touched[cg.id] && (next[cg.id] ?? undefined) !== base) {
        next[cg.id] = base;
        changed = true;
      }
    });
    if (changed) onChange({ ...data, quantities: next });
  }, [totalPaxAdult, childGroups, dayIndex]);

  // Default/auto-sync jumlah sesuai traveler aktif (hanya jika belum diedit manual)
  useEffect(() => {
    if (isAdultActive) {
      const base = Number(totalPaxAdult) || 0;
      if ((data.quantities || {}).adult === undefined) {
        onChange({
          ...data,
          quantities: { ...(data.quantities || {}), adult: base },
        });
      }
    } else {
      const base = Number(activeChildTotal) || 0;
      const key = activeTravelerKey;
      if ((data.quantities || {})[key] === undefined) {
        onChange({
          ...data,
          quantities: { ...(data.quantities || {}), [key]: base },
        });
      }
    }
  }, [
    isAdultActive,
    totalPaxAdult,
    activeChildTotal,
    activeTravelerKey,
    dayIndex,
  ]);

  const quantities = data.quantities || {};
  const adultQty = Number(quantities.adult ?? 0);
  const childQtySum = Object.entries(quantities)
    .filter(([k]) => k !== "adult")
    .reduce((s, [, v]) => s + (Number(v) || 0), 0);
  const totalHarga =
    adultQty * (Number(hargaAdult) || 0) +
    childQtySum * (Number(hargaChild) || 0);

  const handleSelectChange = (field, val) => {
    if (!isAdultActive) return; // child tidak boleh ubah field selain qty child
    const updates = { [field]: val?.value ?? null };
    if (field === "id_resto") {
      Object.assign(updates, {
        id_menu: null,
        jenis_wisatawan: null,
        description: restaurants.find((r) => r.id === val?.value)?.description,
      });
    }
    if (field === "id_menu") {
      Object.assign(updates, { jenis_wisatawan: null });
    }
    onChange({ ...data, ...updates });
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
          isDisabled={!isAdultActive}
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
            isDisabled={!isAdultActive}
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
            isDisabled={!isAdultActive || !data.id_resto}
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
          isDisabled={!isAdultActive || !data.id_menu}
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

      {/* Jumlah Orang — conditional per traveler */}
      {isAdultActive ? (
        // ADULT: hanya tampil input Jumlah Adult (editable), sembunyikan child
        <HStack spacing={4} mb={3}>
          <Box w="50%">
            <Text mb={1} fontSize="sm" color="gray.300">
              Jumlah Adult
            </Text>
            <Input
              value={Number((data.quantities || {}).adult ?? 0)}
              onChange={(e) => {
                setTouched((t) => ({ ...t, adult: true }));
                onChange({
                  ...data,
                  quantities: {
                    ...(data.quantities || {}),
                    adult: Number(e.target.value) || 0,
                  },
                });
              }}
              bg={inputBg}
              color={textColor}
              borderColor={borderColor}
            />
          </Box>
        </HStack>
      ) : (
        // CHILD: hanya tampil input Jumlah Child (editable), sembunyikan adult
        <HStack spacing={4} mb={3}>
          <Box w="50%">
            <Text mb={1} fontSize="sm" color="gray.300">
              Jumlah Child
            </Text>
            <Input
              value={Number((data.quantities || {})[activeTravelerKey] ?? 0)}
              onChange={(e) => {
                setTouched((t) => ({ ...t, [activeTravelerKey]: true }));
                onChange({
                  ...data,
                  quantities: {
                    ...(data.quantities || {}),
                    [activeTravelerKey]: Number(e.target.value) || 0,
                  },
                });
              }}
              bg={inputBg}
              color={textColor}
              borderColor={borderColor}
            />
          </Box>
        </HStack>
      )}

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
