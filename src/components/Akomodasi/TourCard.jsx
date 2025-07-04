import {
  Box,
  HStack,
  Text,
  IconButton,
  Input,
  useColorModeValue,
  Select,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { MainSelectCreatableWithDelete } from "../MainSelect";

// Dummy data
const dummyDestinations = [
  { value: 1, label: "Pantai Kuta", type_wisata: "domestik" },
  { value: 2, label: "Tanah Lot", type_wisata: "asing" },
];

const dummyActivities = [
  { value: 1, label: "Snorkeling", type_wisate: "domestik" },
  { value: 2, label: "Paragliding", type_wisate: "asing" },
];

const dummyRestaurants = [
  { value: 1, label: "Bebek Tepi Sawah" },
  { value: 2, label: "Warung Made" },
];

const TourInfoCard = ({ index, onDelete, data, onChange }) => {
  const [selectedDest, setSelectedDest] = useState(data.selectedDest || null);
  const [selectedActivity, setSelectedActivity] = useState(
    data.selectedActivity || null
  );
  const [selectedResto, setSelectedResto] = useState(
    data.selectedResto || null
  );

  const inputBg = useColorModeValue("gray.700", "gray.700");
  const borderColor = useColorModeValue("gray.600", "gray.600");
  const textColor = useColorModeValue("white", "white");

  useEffect(() => {
    onChange({
      ...data,
      selectedDest,
      selectedActivity,
      selectedResto,
    });
  }, [selectedDest, selectedActivity, selectedResto]);

  return (
    <Box bg="gray.600" p={4} rounded="md">
      <HStack justify="space-between" mb={3}>
        <Text fontWeight="bold" color={textColor}>
          Tour Day {index + 1}
        </Text>
        <IconButton
          size="xs"
          icon={<DeleteIcon />}
          colorScheme="red"
          variant="ghost"
          aria-label="Hapus"
          onClick={onDelete}
        />
      </HStack>

      {/* Destination */}
      <Box mb={3}>
        <Text mb={1} fontSize="sm" color="gray.300">
          Destinasi
        </Text>
        <MainSelectCreatableWithDelete
          options={dummyDestinations}
          value={selectedDest}
          onChange={setSelectedDest}
          placeholder="Pilih destinasi"
          isClearable
        />
        {selectedDest?.type_wisata && (
          <Text mt={1} fontSize="xs" color="gray.400">
            Tipe: {selectedDest.type_wisata}
          </Text>
        )}
      </Box>

      {/* Activity */}
      <Box mb={3}>
        <Text mb={1} fontSize="sm" color="gray.300">
          Aktivitas
        </Text>
        <MainSelectCreatableWithDelete
          options={dummyActivities}
          value={selectedActivity}
          onChange={setSelectedActivity}
          placeholder="Pilih aktivitas"
          isClearable
        />
        {selectedActivity?.type_wisate && (
          <Text mt={1} fontSize="xs" color="gray.400">
            Tipe: {selectedActivity.type_wisate}
          </Text>
        )}
      </Box>

      {/* Restaurant */}
      <Box>
        <Text mb={1} fontSize="sm" color="gray.300">
          Restoran
        </Text>
        <MainSelectCreatableWithDelete
          options={dummyRestaurants}
          value={selectedResto}
          onChange={setSelectedResto}
          placeholder="Pilih restoran"
          isClearable
        />
      </Box>
    </Box>
  );
};

export default TourInfoCard;
