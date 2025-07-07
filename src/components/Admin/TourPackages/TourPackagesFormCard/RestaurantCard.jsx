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

const RestaurantCard = ({ index, data, onChange, onDelete }) => {
  const { restaurant } = useAdminPackageContext();

  const [selectedResto, setSelectedResto] = useState(
    data.selectedResto || null
  );
  const [selectedPackage, setSelectedPackage] = useState(
    data.selectedPackage || null
  );

  const textColor = useColorModeValue("white", "white");

  // Daftar opsi restoran
  const restaurantOptions = useMemo(() => {
    return restaurant.map((r) => ({
      value: r.id,
      label: r.resto_name,
    }));
  }, [restaurant]);

  // Daftar paket berdasarkan restoran terpilih
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

  // Sinkronisasi ke parent
  useEffect(() => {
    onChange({
      ...data,
      selectedResto,
      selectedPackage,
      id_resto: selectedResto?.value,
      id_package: selectedPackage?.value,
    });
  }, [selectedResto, selectedPackage]);

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
          options={restaurantOptions}
          value={selectedResto}
          onChange={(val) => {
            setSelectedResto(val);
            setSelectedPackage(null); // reset package saat ganti resto
          }}
          placeholder="Pilih restoran"
        />
      </Box>

      {/* Pilih Paket Menu */}
      {selectedResto && (
        <Box>
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
      )}
    </Box>
  );
};

export default RestaurantCard;
