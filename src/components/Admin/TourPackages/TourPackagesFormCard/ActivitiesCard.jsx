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

// Dummy data aktivitas dan vendor
const dummyVendors = [
  { value: 501, label: "Bali Dive Center" },
  { value: 502, label: "Sky Adventure Club" },
];

const dummyActivities = [
  { value: 601, label: "Snorkeling", id_vendor: 501, type_wisate: "domestik" },
  { value: 602, label: "Paragliding", id_vendor: 502, type_wisate: "asing" },
];

const typeWisataOptions = [
  { value: "domestik", label: "Domestik" },
  { value: "asing", label: "Asing" },
];

const ActivityCard = ({ index, data, onChange, onDelete }) => {
  const [selectedActivity, setSelectedActivity] = useState(
    data.selectedActivity || null
  );
  const [selectedVendor, setSelectedVendor] = useState(
    data.selectedVendor || null
  );
  const [selectedTypeWisata, setSelectedTypeWisata] = useState(
    data.selectedTypeWisata || null
  );

  const textColor = useColorModeValue("white", "white");

  // Sinkronisasi data ke parent
  useEffect(() => {
    onChange({
      ...data,
      selectedActivity,
      selectedVendor,
      selectedTypeWisata,
      id_activity: selectedActivity?.value,
      id_vendor: selectedVendor?.value,
      type_wisate: selectedTypeWisata?.value,
    });
  }, [selectedActivity, selectedVendor, selectedTypeWisata]);

  // Auto-set vendor dan type_wisate saat activity dipilih
  useEffect(() => {
    if (selectedActivity) {
      const act = dummyActivities.find(
        (a) => a.value === selectedActivity.value
      );
      if (act) {
        const vendor = dummyVendors.find((v) => v.value === act.id_vendor);
        const type = typeWisataOptions.find((t) => t.value === act.type_wisate);
        setSelectedVendor(vendor || null);
        setSelectedTypeWisata(type || null);
      }
    }
  }, [selectedActivity]);

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
          aria-label="Hapus Aktivitas"
          onClick={onDelete}
        />
      </HStack>

      {/* Pilih Aktivitas */}
      <Box mb={3}>
        <Text fontSize="sm" color="gray.300" mb={1}>
          Pilih Aktivitas
        </Text>
        <MainSelectCreatableWithDelete
          options={dummyActivities}
          value={selectedActivity}
          onChange={setSelectedActivity}
          placeholder="Pilih aktivitas"
        />
      </Box>

      {/* Pilih Vendor */}
      <Box mb={3}>
        <Text fontSize="sm" color="gray.300" mb={1}>
          Vendor
        </Text>
        <MainSelectCreatableWithDelete
          options={dummyVendors}
          value={selectedVendor}
          onChange={setSelectedVendor}
          placeholder="Pilih vendor"
          isDisabled
        />
      </Box>

      {/* Tipe Wisata */}
      <Box>
        <Text fontSize="sm" color="gray.300" mb={1}>
          Tipe Wisata
        </Text>
        <MainSelectCreatableWithDelete
          options={typeWisataOptions}
          value={selectedTypeWisata}
          onChange={setSelectedTypeWisata}
          placeholder="Pilih tipe wisata"
          isDisabled
        />
      </Box>
    </Box>
  );
};

export default ActivityCard;
