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
import MainSelect, { MainSelectCreatable } from "../MainSelect";
import { useAkomodasiContext } from "../../context/AkomodasiContext";
import VillaFormModal from "../Admin/Villa/VillaModal/VillaModal";

const VillaCard = ({ index, onDelete, data, onChange }) => {
  const { villas } = useAkomodasiContext();
  const [openModal, setOpenModal] = useState();

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

    seasons.normal
      .filter((s) => s.idRoom === idRoom)
      .forEach((s, i) => {
        options.push({
          value: `normal-${i}`,
          label: `Normal Season - ${s.label}`,
          idMusim: s.idMusim,
        });
      });

    seasons.high
      .filter((s) => s.idRoom === idRoom)
      .forEach((s, i) =>
        options.push({
          value: `high-${i}`,
          label: `High Season - ${s.label}`,
          idMusim: s.idMusim,
        })
      );

    seasons.peak
      .filter((s) => s.idRoom === idRoom)
      .forEach((s, i) =>
        options.push({
          value: `peak-${i}`,
          label: `Peak Season - ${s.label}`,
          idMusim: s.idMusim,
        })
      );

    seasons.honeymoon
      .filter((s) => s.idRoom === idRoom)
      .forEach((s, i) =>
        options.push({
          value: `honeymoon-${i}`,
          label: `Honeymoon Season - ${s.label}`,
          idMusim: s.idMusim,
        })
      );

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
          <MainSelectCreatable
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
                idMusim: val.idMusim,
              });
              setJumlahKamar(1);
              setJumlahExtrabed(1);

              if (val.__isNew__) {
                setOpenModal(true);
              }
            }}
            placeholder="Pilih Villa"
          />
        </Box>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Tipe Kamar
          </Text>
          <MainSelectCreatable
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
                idMusim: val.idMusim,
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
          <MainSelectCreatable
            options={seasonOptions}
            value={seasonOptions.find((s) => s.idMusim == data.idMusim)}
            onChange={(val) => {
              onChange({
                ...data,
                season: val?.value,
                seasonLabel: val?.label,
                idMusim: val.idMusim,
              });
              setJumlahKamar(1);
              setJumlahExtrabed(1);
            }}
            isDisabled={!data.roomType}
            placeholder="Pilih Musim"
          />
        </Box>
      </HStack>

      <VStack align="start" spacing={2} mb={3}>
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
      <VillaFormModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </Box>
  );
};

export default VillaCard;
