import {
  Box,
  HStack,
  Text,
  IconButton,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  useMemo,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { MainSelectCreatable } from "../../../MainSelect";
import { useAdminPackageContext } from "../../../../context/Admin/AdminPackageContext";
import { useAdminActivityContext } from "../../../../context/Admin/AdminActivityContext";
import ActivitiesModal from "../TourModal/ActivitiesModal";

const ActivityCard = forwardRef(
  ({ index, data, onChange, onDelete, onModalClose }, ref) => {
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
    const wrapperRef = useRef(null);

    const [errors, setErrors] = useState({});

    const validateAll = () => {
      const newErrors = {};
      if (index != null) {
        if (!data.selectedVendor) newErrors.vendor = "Vendor harus dipilih";
        if (!data.selectedActivity) newErrors.activity = "Aktivitas harus dipilih";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    useImperativeHandle(ref, () => ({
      validate: validateAll,
      scroll: () => {
        wrapperRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      },
    }));

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
      <Box bg="gray.600" p={4} rounded="md" ref={wrapperRef}>
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
            isError={errors.vendor}
          />
        </Box>
        {errors.vendor && (
          <Text fontSize="xs" color="red.300" mt={1}>
            {errors.vendor}
          </Text>
        )}
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
            isError={errors.activity}
          />
          {errors.activity && (
            <Text fontSize="xs" color="red.300" mt={1}>
              {errors.activity}
            </Text>
          )}
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
  }
);

export default ActivityCard;
