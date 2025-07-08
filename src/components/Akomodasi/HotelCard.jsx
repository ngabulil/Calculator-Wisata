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

const HotelCard = ({ index, onDelete, data, onChange, isAdmin }) => {
  const { hotels } = useAkomodasiContext();
  const [jumlahKamar, setJumlahKamar] = useState(1);
  const [jumlahExtrabed, setJumlahExtrabed] = useState(1);

  const inputBg = useColorModeValue("gray.700", "gray.700");
  const borderColor = useColorModeValue("gray.600", "gray.600");
  const textColor = useColorModeValue("white", "white");

  const selectedHotelData = useMemo(() => {
    return hotels.find((h) => h.id === data.hotel?.value);
  }, [data.hotel, hotels]);

  const roomOptions = useMemo(() => {
    return (
      selectedHotelData?.roomType.map((r) => ({
        value: r.idRoom,
        label: r.label,
      })) || []
    );
  }, [selectedHotelData]);

  const seasonOptions = useMemo(() => {
    if (!selectedHotelData || !data.roomType) return [];

    const seasonLabels = [];
    const { seasons } = selectedHotelData;
    const idRoom = data.roomType.value;

    seasons.normal
      .filter((s) => s.idRoom === idRoom)
      .forEach((s, i) => {
        seasonLabels.push({
          value: `normal-${i}`,
          label: `Normal Season - ${s.label}`,
          idMusim: s.idMusim,
        });
      });

    seasons.high
      .filter((s) => s.idRoom === idRoom)
      .forEach((s, i) =>
        seasonLabels.push({
          value: `high-${i}`,
          label: `High Season - ${s.label}`,
          idMusim: s.idMusim,
        })
      );

    seasons.peak
      .filter((s) => s.idRoom === idRoom)
      .forEach((s, i) =>
        seasonLabels.push({
          value: `peak-${i}`,
          label: `Peak Season - ${s.label}`,
          idMusim: s.idMusim,
        })
      );

    return seasonLabels;
  }, [selectedHotelData, data.roomType]);

  const hargaPerKamar = useMemo(() => {
    if (!selectedHotelData || !data.roomType || !data.season) return 0;

    const idRoom = data.roomType.value;
    if (data.season === "normal") {
      return (
        selectedHotelData.seasons.normal.find((s) => s.idRoom === idRoom)
          ?.price || 0
      );
    }
    if (data.season.startsWith("high")) {
      const index = parseInt(data.season.split("-")[1]);
      return (
        selectedHotelData.seasons.high.filter((s) => s.idRoom === idRoom)[index]
          ?.price || 0
      );
    }
    if (data.season.startsWith("peak")) {
      const index = parseInt(data.season.split("-")[1]);
      return (
        selectedHotelData.seasons.peak.filter((s) => s.idRoom === idRoom)[index]
          ?.price || 0
      );
    }
    return 0;
  }, [selectedHotelData, data.roomType, data.season]);

  const hargaExtrabed = useMemo(() => {
    if (!selectedHotelData || !data.roomType) return 0;
    return (
      selectedHotelData.extrabed.find((e) => e.idRoom === data.roomType.value)
        ?.price || 0
    );
  }, [selectedHotelData, data.roomType]);

  const totalHarga =
    jumlahKamar * hargaPerKamar +
    (data.useExtrabed ? jumlahExtrabed * hargaExtrabed : 0);

  useEffect(() => {
    let delayTimer = null;
    delayTimer = setTimeout(() => {
      onChange({
        ...data,
        jumlahKamar,
        jumlahExtrabed,
        hargaPerKamar,
        hargaExtrabed,
      });
    }, 1000);

    return () => clearTimeout(delayTimer);
  }, [jumlahKamar, jumlahExtrabed, hargaPerKamar, hargaExtrabed]);

  useEffect(() => {
    console.log(hotels);
  }, []);

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
          aria-label="Hapus Hotel"
          onClick={onDelete}
        />
      </HStack>

      <HStack spacing={4} mb={3}>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Pilih Hotel
          </Text>
          <MainSelect
            options={hotels.map((hotel) => ({
              value: hotel.id,
              label: hotel.hotelName,
            }))}
            value={data.hotel}
            onChange={(val) => {
              onChange({
                ...data,
                hotel: val,
                roomType: null,
                season: null,
                seasonLabel: null,
                idMusim: null,
                useExtrabed: false,
                jumlahExtrabed: 1,
              });
              setJumlahKamar(1);
              setJumlahExtrabed(1);
            }}
            placeholder="Pilih Hotel"
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
                idMusim: null,
                useExtrabed: false,
                jumlahExtrabed: 1,
              });
              setJumlahKamar(1);
              setJumlahExtrabed(1);
            }}
            isDisabled={!data.hotel}
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
              console.log(val);
              onChange({
                ...data,
                season: val?.value,
                seasonLabel: val?.label,
                idMusim: val?.idMusim,
              });
              setJumlahKamar(1); // reset default
              setJumlahExtrabed(1);
            }}
            isDisabled={!data.roomType}
            placeholder="Pilih Musim"
          />
        </Box>

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
            />{" "}
          </Box>
        )}

        {!isAdmin && (
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
        {!isAdmin && (
          <HStack align="center" spacing={3}>
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
        )}

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

export default HotelCard;
