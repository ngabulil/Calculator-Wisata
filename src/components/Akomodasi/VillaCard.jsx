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
import MainSelect from "../MainSelect";
import { useAkomodasiContext } from "../../context/AkomodasiContext";

const VillaCard = ({ index, onDelete, data, onChange, isAdmin }) => {
  const { villas } = useAkomodasiContext();

  const [jumlahKamar, setJumlahKamar] = useState(1);
  const [jumlahExtrabed, setJumlahExtrabed] = useState(1);

  const inputBg = useColorModeValue("gray.700", "gray.700");
  const borderColor = useColorModeValue("gray.600", "gray.600");
  const textColor = useColorModeValue("white", "white");

  const selectedVillaData = useMemo(() => {
    return villas.find((v) => v.id === data.villa?.value);
  }, [data.villa, villas]);

  const roomOptions = useMemo(() => {
    return (
      selectedVillaData?.roomType.map((r) => ({
        value: r.idRoom,
        label: r.label,
      })) || []
    );
  }, [selectedVillaData]);

  const seasonOptions = useMemo(() => {
    if (!selectedVillaData || !data.roomType) return [];

    const { seasons } = selectedVillaData;
    const idRoom = data.roomType.value;
    const options = [];

    if (seasons.normal.find((s) => s.idRoom === idRoom)) {
      options.push({ value: "normal", label: "Normal Season" });
    }

    seasons.high
      .filter((s) => s.idRoom === idRoom)
      .forEach((s, i) =>
        options.push({ value: `high-${i}`, label: `High Season - ${s.label}` })
      );

    seasons.peak
      .filter((s) => s.idRoom === idRoom)
      .forEach((s, i) =>
        options.push({ value: `peak-${i}`, label: `Peak Season - ${s.label}` })
      );

    const honeymoon = seasons.honeymoon.find((s) => s.idRoom === idRoom);
    if (honeymoon) {
      options.push({ value: "honeymoon", label: "Honeymoon" });
    }

    return options;
  }, [selectedVillaData, data.roomType]);

  const hargaPerKamar = useMemo(() => {
    if (!selectedVillaData || !data.roomType || !data.season) return 0;
    const idRoom = data.roomType.value;

    if (data.season === "normal") {
      return (
        selectedVillaData.seasons.normal.find((s) => s.idRoom === idRoom)
          ?.price || 0
      );
    }

    if (data.season.startsWith("high")) {
      const idx = parseInt(data.season.split("-")[1]);
      return (
        selectedVillaData.seasons.high.filter((s) => s.idRoom === idRoom)[idx]
          ?.price || 0
      );
    }

    if (data.season.startsWith("peak")) {
      const idx = parseInt(data.season.split("-")[1]);
      return (
        selectedVillaData.seasons.peak.filter((s) => s.idRoom === idRoom)[idx]
          ?.price || 0
      );
    }

    if (data.season === "honeymoon") {
      return (
        selectedVillaData.seasons.honeymoon.find((s) => s.idRoom === idRoom)
          ?.price || 0
      );
    }

    return 0;
  }, [selectedVillaData, data.roomType, data.season]);

  const hargaExtrabed = useMemo(() => {
    if (!selectedVillaData || !data.roomType) return 0;
    return (
      selectedVillaData.extrabed.find((e) => e.idRoom === data.roomType.value)
        ?.price || 0
    );
  }, [selectedVillaData, data.roomType]);

  const totalHarga =
    jumlahKamar * hargaPerKamar +
    (data.useExtrabed ? jumlahExtrabed * hargaExtrabed : 0);

  useEffect(() => {
    onChange({
      ...data,
      jumlahKamar,
      jumlahExtrabed,
      hargaPerKamar,
      hargaExtrabed,
    });
  }, [jumlahKamar, jumlahExtrabed, hargaPerKamar, hargaExtrabed]);

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
          aria-label="Hapus Villa"
          onClick={onDelete}
        />
      </HStack>

      <HStack spacing={4} mb={3}>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Pilih Villa
          </Text>
          <MainSelect
            options={villas.map((v) => ({ value: v.id, label: v.villaName }))}
            value={data.villa}
            onChange={(val) => {
              onChange({
                ...data,
                villa: val,
                roomType: null,
                season: null,
                seasonLabel: null,
                useExtrabed: false,
                jumlahExtrabed: 1,
              });
              setJumlahKamar(1);
              setJumlahExtrabed(1);
            }}
            placeholder="Pilih Villa"
          />
        </Box>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Tipe Kamar
          </Text>
          <MainSelect
            options={roomOptions}
            value={data.roomType}
            onChange={(val) => {
              onChange({
                ...data,
                roomType: val,
                season: null,
                seasonLabel: null,
                useExtrabed: false,
                jumlahExtrabed: 1,
              });
              setJumlahKamar(1);
              setJumlahExtrabed(1);
            }}
            isDisabled={!data.villa}
            placeholder="Pilih Tipe Kamar"
          />
        </Box>
      </HStack>

      <HStack spacing={4} mb={3}>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Musim
          </Text>
          <MainSelect
            options={seasonOptions}
            value={seasonOptions.find((s) => s.value === data.season)}
            onChange={(val) => {
              onChange({
                ...data,
                season: val?.value,
                seasonLabel: val?.label,
              });
              setJumlahKamar(1);
              setJumlahExtrabed(1);
            }}
            isDisabled={!data.roomType}
            placeholder="Pilih Musim"
          />
        </Box>

        {isAdmin && (
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
        )}

        {!isAdmin && (
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
        )}
      </HStack>

      {!isAdmin && (
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
        </HStack>
      )}

      <VStack align="start" spacing={2} mb={3}>
        <HStack spacing={3}>
          <Checkbox
            isChecked={data.useExtrabed || false}
            onChange={(e) =>
              onChange({ ...data, useExtrabed: e.target.checked })
            }
            isDisabled={hargaExtrabed === 0}
            colorScheme="teal"
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

      {!isAdmin && (
        <Box mt={4}>
          <Text fontWeight="semibold" color="green.300">
            Total Harga: Rp {totalHarga.toLocaleString("id-ID")}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default VillaCard;
