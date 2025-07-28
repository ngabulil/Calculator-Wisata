import {
  Box,
  HStack,
  Text,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useState, useMemo } from "react";
import { MainSelectCreatableWithDelete } from "../../../MainSelect";
import { useAdminPackageContext } from "../../../../context/Admin/AdminPackageContext";
import RestaurantModal from "../TourModal/RestaurantModal";
import { useAdminRestaurantContext } from "../../../../context/Admin/AdminRestaurantContext";

const RestaurantCard = ({ index, data, onChange, onDelete, onModalClose }) => {
  const { restaurant } = useAdminPackageContext();
  const { updateRestModalData } = useAdminRestaurantContext();
  const [openModal, setOpenModal] = useState(false);

  const [selectedResto, setSelectedResto] = useState(
    data.selectedResto || null
  );
  const [selectedPackage, setSelectedPackage] = useState(
    data.selectedPackage || null
  );
  const [selectedTypeWisata, setSelectedTypeWisata] = useState(
    data.selectedTypeWisata || null
  );

  const textColor = useColorModeValue("white", "white");

  const restaurantOptions = useMemo(() => {
    return restaurant.map((r) => ({
      value: r.id,
      label: r.resto_name,
    }));
  }, [restaurant]);

  const packageOptions = useMemo(() => {
    if (!selectedResto) return [];
    const resto = restaurant.find((r) => r.id === selectedResto.value);
    return (
      resto?.packages.map((p) => ({
        value: p.id_package,
        label: p.package_name,
        fullData: p,
      })) || []
    );
  }, [selectedResto, restaurant]);

  // const typeWisataOptions = useMemo(() => {
  //   const defaultOptions = [
  //     { value: "domestik", label: "Domestik" },
  //     { value: "asing", label: "Asing" },
  //   ];

  //   if (!selectedTypeWisata) return defaultOptions;

  //   return defaultOptions.filter((opt) => opt.value === selectedTypeWisata);
  // }, [selectedTypeWisata]);

  useEffect(() => {
    onChange({
      ...data,
      selectedResto,
      selectedPackage,
      selectedTypeWisata,
      id_resto: selectedResto?.value,
      id_package: selectedPackage?.value,
      type_wisata: selectedTypeWisata?.value,
    });
  }, [selectedResto, selectedPackage, selectedTypeWisata]);

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

      <Box mb={3}>
        <Text fontSize="sm" color="gray.300" mb={1}>
          Pilih Restoran
        </Text>
        <MainSelectCreatableWithDelete
          options={restaurantOptions}
          value={selectedResto}
          onChange={(val) => {
            setSelectedResto(val);
            setSelectedPackage(null);
            setSelectedTypeWisata(null);
            if (val.__isNew__) {
              setOpenModal(true);
              updateRestModalData({ name: val.value });
            }
          }}
          placeholder="Pilih restoran"
        />
      </Box>

      {selectedResto && (
        <>
          <Box mb={3}>
            <Text fontSize="sm" color="gray.300" mb={1}>
              Pilih Paket Menu
            </Text>
            <MainSelectCreatableWithDelete
              options={packageOptions}
              value={selectedPackage}
              onChange={setSelectedPackage}
              placeholder="Pilih paket"
            />
          </Box>

          {/* <Box>
            <Text fontSize="sm" color="gray.300" mb={1}>
              Type Wisata
            </Text>
            <MainSelectCreatableWithDelete
              options={typeWisataOptions}
              value={selectedTypeWisata}
              onChange={setSelectedTypeWisata}
              placeholder="Pilih jenis wisata"
            />
          </Box> */}
        </>
      )}
      <RestaurantModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          onModalClose(false);
        }}
      />
    </Box>
  );
};

export default RestaurantCard;
