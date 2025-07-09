import {
  Box,
  VStack,
  HStack,
  Input,
  FormLabel,
  IconButton,
  Button,
  NumberInput,
  NumberInputField,
  Text,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { useState } from "react";

const layananTypes = ["fullDay", "halfDay", "inOut", "menginap"];

const TransportForm = ({ isEdit = false, vehiclesValue = [], onChange }) => {
  const [vehicles, setVehicles] = useState(
    isEdit && vehiclesValue.length > 0
      ? vehiclesValue
      : [
          {
            jenisKendaraan: "",
            vendor: "",
            vendor_link: "",
            keterangan: {
              fullDay: [],
              halfDay: [],
              inOut: [],
              menginap: [],
            },
          },
        ]
  );

  const handleChange = (index, field, value) => {
    const newVehicles = [...vehicles];
    newVehicles[index][field] = value;
    setVehicles(newVehicles);
    onChange?.(newVehicles);
  };

  const handleAreaChange = (index, type, areaIndex, field, value) => {
    const newVehicles = [...vehicles];
    newVehicles[index].keterangan[type][areaIndex][field] = value;
    setVehicles(newVehicles);
    onChange?.(newVehicles);
  };

  const handleAddVehicle = () => {
    setVehicles([
      ...vehicles,
      {
        jenisKendaraan: "",
        vendor: "",
        vendor_link: "",
        keterangan: {
          fullDay: [],
          halfDay: [],
          inOut: [],
          menginap: [],
        },
      },
    ]);
  };

  const handleRemoveVehicle = (index) => {
    const updated = vehicles.filter((_, i) => i !== index);
    setVehicles(updated);
    onChange?.(updated);
  };

  const handleAddArea = (index, type) => {
    const newVehicles = [...vehicles];
    newVehicles[index].keterangan[type].push({
      id_area: "",
      area: "",
      price: 0,
    });
    setVehicles(newVehicles);
    onChange?.(newVehicles);
  };

  const handleRemoveArea = (index, type, areaIndex) => {
    const newVehicles = [...vehicles];
    newVehicles[index].keterangan[type] = newVehicles[index].keterangan[
      type
    ].filter((_, i) => i !== areaIndex);
    setVehicles(newVehicles);
    onChange?.(newVehicles);
  };

  return (
    <VStack spacing={8} align="stretch">
      {vehicles.map((vehicle, index) => (
        <Box
          key={index}
          bg="gray.700"
          p={4}
          rounded="xl"
          boxShadow="md"
          position="relative"
        >
          <HStack justify="space-between" mb={2}>
            <FormLabel fontWeight="bold">Kendaraan #{index + 1}</FormLabel>
            <IconButton
              icon={<DeleteIcon />}
              colorScheme="red"
              size="sm"
              onClick={() => handleRemoveVehicle(index)}
              isDisabled={vehicles.length === 1}
            />
          </HStack>

          <Box mb={3}>
            <FormLabel>Jenis Kendaraan</FormLabel>
            <Input
              value={vehicle.jenisKendaraan}
              onChange={(e) =>
                handleChange(index, "jenisKendaraan", e.target.value)
              }
              placeholder="Contoh: Toyota Innova Reborn"
            />
          </Box>

          <Box mb={3}>
            <FormLabel>Vendor</FormLabel>
            <Input
              value={vehicle.vendor}
              onChange={(e) => handleChange(index, "vendor", e.target.value)}
              placeholder="Contoh: PT. Bali Transport"
            />
          </Box>

          <Box mb={3}>
            <FormLabel>Link Vendor</FormLabel>
            <Input
              value={vehicle.vendor_link}
              onChange={(e) =>
                handleChange(index, "vendor_link", e.target.value)
              }
              placeholder="https://example.com/innova"
            />
          </Box>

          {layananTypes.map((type) => (
            <Box key={type} mb={4}>
              <HStack justify="space-between">
                <FormLabel textTransform="capitalize">{type}</FormLabel>
                <Button
                  size="xs"
                  onClick={() => handleAddArea(index, type)}
                  leftIcon={<AddIcon />}
                >
                  Tambah Area
                </Button>
              </HStack>

              {vehicle.keterangan[type]?.map((areaItem, areaIndex) => (
                <Box
                  key={areaIndex}
                  bg="gray.600"
                  p={3}
                  rounded="md"
                  mb={2}
                  position="relative"
                >
                  <HStack spacing={3} mb={2}>
                    <Input
                      placeholder="ID Area"
                      value={areaItem.id_area}
                      onChange={(e) =>
                        handleAreaChange(
                          index,
                          type,
                          areaIndex,
                          "id_area",
                          e.target.value
                        )
                      }
                    />
                    <Input
                      placeholder="Nama Area"
                      value={areaItem.area}
                      onChange={(e) =>
                        handleAreaChange(
                          index,
                          type,
                          areaIndex,
                          "area",
                          e.target.value
                        )
                      }
                    />
                    <NumberInput
                      value={areaItem.price}
                      onChange={(val) =>
                        handleAreaChange(index, type, areaIndex, "price", val)
                      }
                      min={0}
                    >
                      <NumberInputField placeholder="Harga" />
                    </NumberInput>
                    <IconButton
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleRemoveArea(index, type, areaIndex)}
                    />
                  </HStack>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      ))}

      <Button
        leftIcon={<AddIcon />}
        colorScheme="teal"
        onClick={handleAddVehicle}
        alignSelf="flex-start"
      >
        Tambah Kendaraan
      </Button>
    </VStack>
  );
};

export default TransportForm;
