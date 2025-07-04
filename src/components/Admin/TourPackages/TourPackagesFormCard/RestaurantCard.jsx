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

// Dummy restoran & menu
const dummyRestaurants = [
  { value: 701, label: "Bebek Tepi Sawah" },
  { value: 702, label: "Warung Made" },
];

const dummyMenus = {
  701: [
    { value: 801, label: "Bebek Goreng" },
    { value: 802, label: "Ayam Bakar" },
  ],
  702: [
    { value: 803, label: "Nasi Campur Bali" },
    { value: 804, label: "Ikan Bakar" },
  ],
};

const RestaurantCard = ({ index, data, onChange, onDelete }) => {
  const [selectedResto, setSelectedResto] = useState(
    data.selectedResto || null
  );
  const [selectedMenu, setSelectedMenu] = useState(data.selectedMenu || null);

  const textColor = useColorModeValue("white", "white");

  useEffect(() => {
    onChange({
      ...data,
      selectedResto,
      selectedMenu,
      id_resto: selectedResto?.value,
      id_menu: selectedMenu?.value,
    });
  }, [selectedResto, selectedMenu]);

  const availableMenus = selectedResto
    ? dummyMenus[selectedResto.value] || []
    : [];

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
          aria-label="Hapus Restoran"
          onClick={onDelete}
        />
      </HStack>

      {/* Pilih Restoran */}
      <Box mb={3}>
        <Text fontSize="sm" color="gray.300" mb={1}>
          Pilih Restoran
        </Text>
        <MainSelectCreatableWithDelete
          options={dummyRestaurants}
          value={selectedResto}
          onChange={(val) => {
            setSelectedResto(val);
            setSelectedMenu(null); // reset menu saat ganti restoran
          }}
          placeholder="Pilih restoran"
        />
      </Box>

      {/* Pilih Menu */}
      {selectedResto && (
        <Box>
          <Text fontSize="sm" color="gray.300" mb={1}>
            Pilih Menu
          </Text>
          <MainSelectCreatableWithDelete
            options={availableMenus}
            value={selectedMenu}
            onChange={setSelectedMenu}
            placeholder="Pilih menu"
          />
        </Box>
      )}
    </Box>
  );
};

export default RestaurantCard;
