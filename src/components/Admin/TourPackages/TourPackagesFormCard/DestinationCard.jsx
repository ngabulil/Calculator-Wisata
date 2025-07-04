import {
  Box,
  HStack,
  Text,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { MainSelectCreatableWithDelete } from "../../../MainSelect";

// Dummy destinasi
const dummyDestinations = [
  { value: 1, label: "Pantai Kuta", type_wisata: "domestik" },
  { value: 2, label: "Tanah Lot", type_wisata: "asing" },
];

// Opsional: daftar tipe wisata eksplisit
const typeWisataOptions = [
  { value: "domestik", label: "Domestik" },
  { value: "asing", label: "Asing" },
];

const DestinationCard = ({ index, data, onChange, onDelete }) => {
  const [selectedDest, setSelectedDest] = useState(data.selectedDest || null);
  const [selectedType, setSelectedType] = useState(data.selectedType || null);

  const textColor = useColorModeValue("white", "white");

  // Saat memilih destinasi, otomatis isi tipe_wisata
  useEffect(() => {
    if (selectedDest) {
      const type = typeWisataOptions.find(
        (opt) => opt.value === selectedDest.type_wisata
      );
      setSelectedType(type || null);
    }
  }, [selectedDest]);

  // Sync ke parent
  useEffect(() => {
    onChange({
      ...data,
      selectedDest,
      selectedType,
      id_destinasi: selectedDest?.value,
      type_wisata: selectedType?.value,
    });
  }, [selectedDest, selectedType]);

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
          aria-label="Hapus Destinasi"
          onClick={onDelete}
        />
      </HStack>

      {/* Pilih Destinasi */}
      <Box mb={3}>
        <Text fontSize="sm" color="gray.300" mb={1}>
          Pilih Destinasi
        </Text>
        <MainSelectCreatableWithDelete
          options={dummyDestinations}
          value={selectedDest}
          onChange={setSelectedDest}
          placeholder="Pilih destinasi"
        />
      </Box>

      {/* Tipe Wisata */}
      <Box>
        <Text fontSize="sm" color="gray.300" mb={1}>
          Tipe Wisata
        </Text>
        <MainSelectCreatableWithDelete
          options={typeWisataOptions}
          value={selectedType}
          onChange={setSelectedType}
          isDisabled
        />
      </Box>
    </Box>
  );
};

export default DestinationCard;
