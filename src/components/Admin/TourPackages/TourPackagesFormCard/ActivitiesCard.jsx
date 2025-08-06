import {
  Box,
  HStack,
  Text,
  IconButton,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useState, useMemo } from "react";
import { MainSelectCreatable } from "../../../MainSelect";
import { useAdminPackageContext } from "../../../../context/Admin/AdminPackageContext";
import { useAdminActivityContext } from "../../../../context/Admin/AdminActivityContext";
import ActivitiesModal from "../TourModal/ActivitiesModal";

const ActivityCard = ({ index, data, onChange, onDelete, onModalClose }) => {
  const [openModal, setOpenModal] = useState(false);
  const { activities } = useAdminPackageContext();
  const { updateActivityModalData } = useAdminActivityContext();

  const [description, setDescription] = useState(data.description || "");
  const [selectedVendor, setSelectedVendor] = useState(
    data.selectedVendor || null
  );
  const [selectedActivity, setSelectedActivity] = useState(
    data.selectedActivity || null
  );
  const [selectedTypeWisata, setSelectedTypeWisata] = useState(
    data.selectedTypeWisata || null
  );

  const textColor = useColorModeValue("white", "white");

  const vendorOptions = useMemo(() => {
    return activities.map((v) => ({
      value: v.id,
      label: v.name_vendor,
    }));
  }, [activities]);

  const activityOptions = useMemo(() => {
    if (!selectedVendor) return [];
    const vendor = activities.find((v) => v.id === selectedVendor.value);
    return (
      vendor?.activities.map((a) => ({
        value: a.activity_id,
        label: a.name,
        fullData: a,
      })) || []
    );
  }, [activities, selectedVendor]);

  // const typeWisataOptions = [
  //   { value: "domestik", label: "Domestik" },
  //   { value: "asing", label: "Asing" },
  // ];

  useEffect(() => {
    onChange({
      ...data,
      selectedVendor,
      selectedActivity,
      selectedTypeWisata,
      id_vendor: selectedVendor?.value,
      id_activity: selectedActivity?.value,
      type_wisata: selectedTypeWisata?.value,
      description: description || "",
    });
  }, [selectedVendor, selectedActivity, selectedTypeWisata]);

  return (
    <Box bg="gray.600" p={4} rounded="md">
      <HStack justify="space-between" mb={3}>
        <Text fontWeight="bold" color={textColor}>
        {index + 1}. Aktivitas 
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

      {/* Pilih Vendor */}
      <Box mb={3}>
        <Text fontSize="sm" color="gray.300" mb={1}>
          Pilih Vendor
        </Text>
        <MainSelectCreatable
          options={vendorOptions}
          value={selectedVendor}
          onChange={(val) => {
            setSelectedVendor(val);
            setSelectedActivity(null);
            setSelectedTypeWisata(null);
          }}
          placeholder="Pilih vendor"
        />
      </Box>

      {/* Pilih Aktivitas */}
      <Box mb={3}>
        <Text fontSize="sm" color="gray.300" mb={1}>
          Pilih Aktivitas
        </Text>
        <MainSelectCreatable
          options={activityOptions}
          value={selectedActivity}
          onChange={(value) => {
            setSelectedActivity(value);

            if (value.__isNew__) {
              setOpenModal(true);
              updateActivityModalData({
                name: value.value,
              });
            }
          }}
          isDisabled={!selectedVendor}
          placeholder="Pilih aktivitas"
        />
      </Box>
      {/*  */}
      {/* <Box mb={3}>
        <Text fontSize="sm" color="gray.300" mb={1}>
          Deskripsi Destinasi
        </Text>
        <Input
          bg={"gray.700"}
          value={description || ""}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          placeholder="Masukkan deskripsi aktivitas"
        />
      </Box> */}

      <ActivitiesModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          onModalClose(false);
        }}
      />
    </Box>
  );
};

export default ActivityCard;
