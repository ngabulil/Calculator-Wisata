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

const seasonTypes = [
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "peak", label: "Peak" },
  { value: "honeymoon", label: "Honeymoon" },
];

const VillaCard = ({ index, onDelete, data, onChange, dayIndex }) => {
  const { villas } = useAkomodasiContext();
  const inputBg = useColorModeValue("gray.700", "gray.700");
  const borderColor = useColorModeValue("gray.600", "gray.600");
  const textColor = useColorModeValue("white", "white");

  const [jumlahKamar, setJumlahKamar] = useState(data.jumlahKamar ?? 1);
  const [jumlahExtrabed, setJumlahExtrabed] = useState(
    data.jumlahExtrabed ?? 1
  );

  const selectedVilla = useMemo(
    () => villas.find((v) => v.id === data.id_villa),
    [villas, data.id_villa]
  );

  const roomOptions = useMemo(
    () =>
      selectedVilla?.roomType.map((r) => ({
        value: r.idRoom,
        label: r.label,
      })) || [],
    [selectedVilla]
  );

  const selectedRoom = useMemo(
    () => roomOptions.find((r) => r.value === data.id_tipe_kamar) || null,
    [roomOptions, data.id_tipe_kamar]
  );

  const seasonOptions = useMemo(() => {
    if (!selectedVilla || !data.id_tipe_kamar || !data.season_type) return [];

    const seasonList = selectedVilla.seasons[data.season_type] || [];
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
  }, [selectedVilla, data.id_tipe_kamar, data.season_type]);

  const selectedSeason = useMemo(() => {
    return (
      seasonOptions.find(
        (opt) => opt.value === data.season || opt.id_musim === data.id_musim
      ) || null
    );
  }, [seasonOptions, data.season, data.id_musim]);

  const hargaPerKamar = useMemo(() => {
    if (
      !selectedVilla ||
      !data.id_tipe_kamar ||
      !data.season_type ||
      !data.id_musim
    )
      return 0;

    const seasonList = selectedVilla.seasons[data.season_type] || [];
    const match = seasonList.find(
      (s) => s.idRoom === data.id_tipe_kamar && s.idMusim === data.id_musim
    );
    return match?.price || 0;
  }, [selectedVilla, data]);

  const hargaExtrabed = useMemo(() => {
    return (
      selectedVilla?.extrabed.find((e) => e.idRoom === data.id_tipe_kamar)
        ?.price || 0
    );
  }, [selectedVilla, data.id_tipe_kamar]);

  const totalHarga =
    jumlahKamar * hargaPerKamar +
    (data.useExtrabed ? jumlahExtrabed * hargaExtrabed : 0);

  useEffect(() => {
    // const timeout = setTimeout(() => {
    onChange({
      ...data,
      jumlahKamar,
      jumlahExtrabed,
      hargaPerKamar,
      hargaExtrabed,
      namaTipeKamar: selectedRoom?.label || null,
    });
    // }, 300);
    // return () => clearTimeout(timeout);
  }, [jumlahKamar, jumlahExtrabed, hargaPerKamar, hargaExtrabed,selectedRoom, dayIndex]);

  const handleSelectChange = (field, val) => {
    const updates = { [field]: val?.value ?? null };
    if (field === "id_villa")
      Object.assign(updates, {
        id_tipe_kamar: null,
        season_type: null,
        season: null,
        useExtrabed: false,
        jumlahExtrabed: 1,
      });
    if (field === "id_tipe_kamar")
      Object.assign(updates, {
        season_type: null,
        season: null,
      });
    if (field === "season_type")
      Object.assign(updates, {
        season: null,
      });
    if (field === "season") updates.id_musim = val?.id_musim ?? null;

    onChange({ ...data, ...updates });
    setJumlahKamar(1);
    setJumlahExtrabed(1);
  };

  return (
    <Box bg="gray.600" p={4} rounded="md">
      <HStack justify="space-between" mb={3}>
        <Text fontWeight="bold" color={textColor}>
          Villa {index + 1}
        </Text>
        <IconButton
          size="xs"
          icon={<DeleteIcon />}
          colorScheme="red"
          variant="ghost"
          onClick={onDelete}
          aria-label="hapus"
        />
      </HStack>

      {/* Villa & Room */}
      <HStack spacing={4} mb={3}>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Pilih Villa
          </Text>
          <MainSelect
            options={villas.map((v) => ({ value: v.id, label: v.villaName }))}
            value={
              villas.find((v) => v.id === data.id_villa)
                ? {
                    value: data.id_villa,
                    label: villas.find((v) => v.id === data.id_villa)
                      ?.villaName,
                  }
                : null
            }
            onChange={(val) => handleSelectChange("id_villa", val)}
            placeholder="Pilih Villa"
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
            isDisabled={!data.id_villa}
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
            isDisabled={!data.id_tipe_kamar}
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
            isDisabled={!data.season_type}
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
            isChecked={data.useExtrabed || false}
            onChange={(e) =>
              onChange({ ...data, useExtrabed: e.target.checked })
            }
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
        {data.useExtrabed && (
          <HStack spacing={4} w="100%">
            <Box w="50%">
              <Text mb={1} fontSize="sm" color="gray.300">
                Jumlah Extrabed
              </Text>
              <Input
                value={jumlahExtrabed}
                onChange={(e) => setJumlahExtrabed(Number(e.target.value))}
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

export default VillaCard;
