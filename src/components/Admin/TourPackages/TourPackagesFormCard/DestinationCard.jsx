import {
  Box,
  HStack,
  Text,
  IconButton,
  useColorModeValue,
  Input,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { MainSelectCreatableWithDelete } from "../../../MainSelect";
import { useAdminPackageContext } from "../../../../context/Admin/AdminPackageContext";
import DestinationModal from "../TourModal/DestinationModal";
import { useAdminDestinationContext } from "../../../../context/Admin/AdminDestinationContext";

const typeWisataOptions = [
  { value: "domestik", label: "Domestik" },
  { value: "asing", label: "Asing" },
];

const DestinationCard = ({ index, data, onChange, onDelete, onModalClose }) => {
  const { destination } = useAdminPackageContext();
  const { updateDestinationModalData } = useAdminDestinationContext();
  const [selectedDest, setSelectedDest] = useState(data.selectedDest || null);
  const [selectedType, setSelectedType] = useState(data.selectedType || null);
  const [openModal, setOpenModal] = useState(false);
  const [description, setDescription] = useState("");

  const textColor = useColorModeValue("white", "white");

  const destinationOptions =
    destination?.map((dest) => ({
      value: dest.id,
      label: dest.name,
      originalData: dest,
    })) || [];

  useEffect(() => {
    if (selectedDest && !selectedType) {
      const dest = destinationOptions.find(
        (d) => d.value === selectedDest.value
      );
      if (dest) {
        const isAsing =
          dest.originalData.price_foreign_adult >
          dest.originalData.price_domestic_adult;
        setSelectedType(isAsing ? typeWisataOptions[1] : typeWisataOptions[0]);
      }
    }
  }, [selectedDest]);

  useEffect(() => {
    onChange({
      ...data,
      selectedDest,
      selectedType,
      id_destinasi: selectedDest?.value,
      type_wisata: selectedType?.value,
      description: description || "",
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
          options={destinationOptions}
          value={selectedDest}
          onChange={(value) => {
            setSelectedDest(value);

            if (value.__isNew__) {
              setOpenModal(true);
              updateDestinationModalData({
                name: value.label,
              });
            }
          }}
          placeholder="Pilih destinasi"
        />
      </Box>
      <Box mb={3}>
        <Text fontSize="sm" color="gray.300" mb={1}>
          Deskripsi Aktivitas
        </Text>
        <Input
          bg={"gray.700"}
          value={description || ""}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          placeholder="Masukkan deskripsi aktivitas"
        />
      </Box>

      <DestinationModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          onModalClose(false);
        }}
      />
    </Box>
  );
};

export default DestinationCard;
