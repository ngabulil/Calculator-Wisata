// HotelCard.jsx
import {
  Box,
  HStack,
  VStack,
  Text,
  IconButton,
  Input,
  Checkbox,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useMemo, useEffect, useState } from "react";
import MainSelect from "../../MainSelect";
import { useAkomodasiContext } from "../../../context/AkomodasiContext";
// ⬇️ NEW
import { useTravelerGroup } from "../../../context/TravelerGroupContext";

const seasonTypes = [
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "peak", label: "Peak" },
];

const HotelCard = ({ index, onDelete, data, onChange, dayIndex }) => {
  const { hotels } = useAkomodasiContext();
  const inputBg = useColorModeValue("gray.700", "gray.700");
  const borderColor = useColorModeValue("gray.600", "gray.600");
  const textColor = useColorModeValue("white", "white");

  // ⬇️ NEW
  const { isAdultActive, activeTravelerKey } = useTravelerGroup();
  const canEditBase = isAdultActive; // hanya Adult boleh edit field dasar

  const [jumlahKamar, setJumlahKamar] = useState(data.jumlahKamar ?? 1);
  // qty extrabed untuk traveler aktif (local state agar input responsif)
  const [jumlahExtrabed, setJumlahExtrabed] = useState(1);

  const selectedHotel = useMemo(
    () => hotels.find((h) => h.id === data.id_hotel),
    [hotels, data.id_hotel]
  );

  const roomOptions = useMemo(
    () =>
      selectedHotel?.roomType.map((r) => ({
        value: r.idRoom,
        label: r.label,
      })) || [],
    [selectedHotel]
  );

  const selectedRoom = useMemo(
    () => roomOptions.find((r) => r.value === data.id_tipe_kamar) || null,
    [roomOptions, data.id_tipe_kamar]
  );

  const seasonOptions = useMemo(() => {
    if (!selectedHotel || !data.id_tipe_kamar || !data.season_type) return [];
    const seasonList = selectedHotel.seasons[data.season_type] || [];
    return seasonList
      .filter((s) => s.idRoom === data.id_tipe_kamar)
      .map((s, i) => ({
        value: `${data.season_type}-${i}`,
        label:
          data.season_type === "normal"
            ? "Normal Season"
            : `${data.season_type} Season - ${s.label}`,
        id_musim: s.idMusim,
      }));
  }, [selectedHotel, data.id_tipe_kamar, data.season_type]);

  const selectedSeason = useMemo(() => {
    return (
      seasonOptions.find(
        (opt) => opt.value === data.season || opt.id_musim === data.id_musim
      ) || null
    );
  }, [seasonOptions, data.season, data.id_musim]);

  const hargaPerKamar = useMemo(() => {
    if (
      !selectedHotel ||
      !data.id_tipe_kamar ||
      !data.season_type ||
      !data.id_musim
    )
      return 0;
    const seasonList = selectedHotel.seasons[data.season_type] || [];
    const match = seasonList.find(
      (s) => s.idRoom === data.id_tipe_kamar && s.idMusim === data.id_musim
    );
    return match?.price || 0;
  }, [selectedHotel, data.id_tipe_kamar, data.season_type, data.id_musim]);

  const hargaExtrabed = useMemo(() => {
    return (
      selectedHotel?.extrabed.find((e) => e.idRoom === data.id_tipe_kamar)
        ?.price || 0
    );
  }, [selectedHotel, data.id_tipe_kamar]);

  // ⬇️ traveler-specific extrabed (fallback ke field lama)
  const currentTravelerEB =
    (data.extrabedByTraveler && data.extrabedByTraveler[activeTravelerKey]) ||
    (isAdultActive && (data.useExtrabed || data.jumlahExtrabed)
      ? { use: !!data.useExtrabed, qty: Number(data.jumlahExtrabed) || 1 }
      : { use: false, qty: 1 });

  const isEBChecked = !!currentTravelerEB.use;

  // sinkronkan qty UI saat traveler berganti
  useEffect(() => {
    setJumlahExtrabed(Number(currentTravelerEB.qty) || 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeTravelerKey,
    data.extrabedByTraveler,
    data.useExtrabed,
    data.jumlahExtrabed,
  ]);

  // onChange untuk field dasar (selalu di-push)
  useEffect(() => {
    onChange({
      ...data,
      jumlahKamar,
      hargaPerKamar,
      hargaExtrabed,
      namaTipeKamar: selectedRoom?.label || null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jumlahKamar, hargaPerKamar, hargaExtrabed, selectedRoom, dayIndex]);

  const handleSelectChange = (field, val) => {
    if (!canEditBase) return; // kunci saat Child
    const updates = { [field]: val?.value ?? null };
    if (field === "id_hotel")
      Object.assign(updates, {
        id_tipe_kamar: null,
        season_type: null,
        season: null,
        id_musim: null,
      });
    if (field === "id_tipe_kamar")
      Object.assign(updates, {
        season_type: null,
        season: null,
        id_musim: null,
      });
    if (field === "season_type")
      Object.assign(updates, { season: null, id_musim: null });
    if (field === "season") updates.id_musim = val?.id_musim ?? null;

    onChange({ ...data, ...updates });
    setJumlahKamar(1);
  };

  // ⬇️ handler extrabed per traveler (boleh untuk Adult & Child)
  const updateEBForTraveler = (fields) => {
    const prevMap = data.extrabedByTraveler || {};
    const prevEntry = prevMap[activeTravelerKey] || {};
    const nextEntry = { ...prevEntry, ...fields };
    const nextMap = { ...prevMap, [activeTravelerKey]: nextEntry };

    const patch = {
      ...data,
      extrabedByTraveler: nextMap,
    };

    // opsional: mirror ke field lama saat Adult (kompatibel dengan data lama)
    if (isAdultActive) {
      patch.useExtrabed = !!nextEntry.use;
      patch.jumlahExtrabed = Number(nextEntry.qty) || 0;
    }

    onChange(patch);
  };

  const totalExtrabedQtyDisplay = useMemo(() => {
    if (
      data.extrabedByTraveler &&
      typeof data.extrabedByTraveler === "object"
    ) {
      return Object.entries(data.extrabedByTraveler).reduce(
        (acc, [key, eb]) => {
          if (!eb) return acc;
          const isActive = key === activeTravelerKey;
          const use = isActive ? isEBChecked : !!eb.use;
          const qty = isActive
            ? Number(jumlahExtrabed) || 0
            : Number(eb.qty) || 0;
          return acc + (use ? qty : 0);
        },
        0
      );
    }
    // fallback legacy
    return isEBChecked ? Number(jumlahExtrabed) || 0 : 0;
  }, [data.extrabedByTraveler, activeTravelerKey, isEBChecked, jumlahExtrabed]);

  const totalHarga =
    (Number(jumlahKamar) || 0) * (Number(hargaPerKamar) || 0) +
    totalExtrabedQtyDisplay * (Number(hargaExtrabed) || 0);

  return (
    <Box bg="gray.600" p={4} rounded="md">
      <HStack justify="space-between" mb={3}>
        <Text fontWeight="bold" color={textColor}>
          Hotel {index + 1}
        </Text>
        <IconButton
          size="xs"
          icon={<DeleteIcon />}
          colorScheme="red"
          variant="ghost"
          onClick={onDelete}
          aria-label="hapus"
          isDisabled={!canEditBase} // Child tidak boleh hapus
        />
      </HStack>

      {/* Hotel & Room */}
      <HStack spacing={4} mb={3}>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Pilih Hotel
          </Text>
          <MainSelect
            options={hotels.map((h) => ({ value: h.id, label: h.hotelName }))}
            value={
              hotels.find((h) => h.id === data.id_hotel)
                ? {
                    value: data.id_hotel,
                    label: hotels.find((h) => h.id === data.id_hotel)
                      ?.hotelName,
                  }
                : null
            }
            onChange={(val) => handleSelectChange("id_hotel", val)}
            placeholder="Pilih Hotel"
            isDisabled={!canEditBase}
          />
        </Box>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Tipe Kamar
          </Text>
          <MainSelect
            options={roomOptions}
            value={selectedRoom}
            onChange={(val) => handleSelectChange("id_tipe_kamar", val)}
            isDisabled={!canEditBase || !data.id_hotel}
            placeholder="Pilih Tipe Kamar"
          />
        </Box>
      </HStack>

      {/* Musim */}
      <HStack spacing={4} mb={3}>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Tipe Musim
          </Text>
          <MainSelect
            options={seasonTypes}
            value={
              seasonTypes.find((st) => st.value === data.season_type) || null
            }
            onChange={(val) => handleSelectChange("season_type", val)}
            isDisabled={!canEditBase || !data.id_tipe_kamar}
            placeholder="Pilih Tipe Musim"
          />
        </Box>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Musim
          </Text>
          <MainSelect
            options={seasonOptions}
            value={selectedSeason}
            onChange={(val) => handleSelectChange("season", val)}
            isDisabled={!canEditBase || !data.season_type}
            placeholder="Pilih Musim"
          />
        </Box>
      </HStack>

      {/* Jumlah & Harga */}
      <HStack spacing={4} mb={3}>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Jumlah Kamar
          </Text>
          <Input
            value={jumlahKamar}
            onChange={(e) => setJumlahKamar(Number(e.target.value))}
            bg={inputBg}
            color={textColor}
            borderColor={borderColor}
            isDisabled={!canEditBase}
          />
        </Box>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Harga per Kamar
          </Text>
          <Input
            value={hargaPerKamar}
            isReadOnly
            bg={inputBg}
            color={textColor}
            borderColor={borderColor}
          />
        </Box>
      </HStack>

      {/* Extrabed */}
      <VStack align="start" spacing={2} mb={3}>
        <HStack spacing={3}>
          <Checkbox
            colorScheme="teal"
            isChecked={isEBChecked}
            onChange={(e) => {
              const checked = e.target.checked;
              updateEBForTraveler({
                use: checked,
                // kalau baru ON dan qty belum ada/0 → jadikan 1 biar langsung kena total
                qty: checked ? Number(currentTravelerEB.qty) || 1 : 0,
              });
              if (
                checked &&
                (!currentTravelerEB.qty || Number(currentTravelerEB.qty) === 0)
              ) {
                setJumlahExtrabed(1);
              }
            }}
            isDisabled={hargaExtrabed === 0}
          >
            Extrabed?
          </Checkbox>
          {hargaExtrabed === 0 && (
            <Text fontSize="sm" color="orange.300">
              Tidak tersedia, silahkan tambah di additional
            </Text>
          )}
        </HStack>

        {isEBChecked && (
          <HStack spacing={4} w="100%">
            <Box w="50%">
              <Text mb={1} fontSize="sm" color="gray.300">
                Jumlah Extrabed ({isAdultActive ? "Adult" : "Child"})
              </Text>
              <Input
                value={jumlahExtrabed}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setJumlahExtrabed(val);
                  updateEBForTraveler({ qty: val });
                }}
                bg={inputBg}
                color={textColor}
                borderColor={borderColor}
              />
            </Box>
            <Box w="50%">
              <Text mb={1} fontSize="sm" color="gray.300">
                Harga per Extrabed
              </Text>
              <Input
                value={hargaExtrabed}
                isReadOnly
                bg={inputBg}
                color={textColor}
                borderColor={borderColor}
              />
            </Box>
          </HStack>
        )}
      </VStack>

      <Box mt={4}>
        <Text fontWeight="semibold" color="green.300">
          Total Harga: Rp {totalHarga.toLocaleString("id-ID")}
        </Text>
      </Box>
    </Box>
  );
};

export default HotelCard;
