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
  useToast,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import toastConfig from "../../../../utils/toastConfig";
import { useAdminTransportContext } from "../../../../context/Admin/AdminTransportContext";
import {
  apiPostMobilFull,
  apiPutMobilFull,
} from "../../../../services/transport";
import { useLocation } from "react-router-dom";

const layananTypes = ["fullDay", "halfDay", "inOut", "menginap"];

const TransportForm = (props) => {
  const [vehicle, setVehicle] = useState({
    name: "",
    vendor: "",
    vendor_link: "",
    keterangan: {
      fullDay: [],
      halfDay: [],
      inOut: [],
      menginap: [],
    },
  });

  const { transportData, mobilModalData } = useAdminTransportContext();
  const toast = useToast();
  const location = useLocation();
  const [editFormActive, setEditFormActive] = useState(false);

  const handleChange = (field, value) => {
    setVehicle((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAreaChange = (type, areaIndex, field, value) => {
    const updated = { ...vehicle };
    updated.keterangan[type][areaIndex][field] = value;
    setVehicle(updated);
  };

  const handleAddArea = (type) => {
    const updated = { ...vehicle };
    updated.keterangan[type].push({
      area: "",
      price: 0,
    });
    setVehicle(updated);
  };

  const handleRemoveArea = (type, areaIndex) => {
    const updated = { ...vehicle };
    updated.keterangan[type] = updated.keterangan[type].filter(
      (_, i) => i !== areaIndex
    );
    setVehicle(updated);
  };

  const handleTransportSetValue = () => {
    setVehicle({
      name: transportData.jenisKendaraan,
      vendor: transportData.vendor,
      vendor_link: transportData.vendor_link,
      keterangan: {
        fullDay: transportData.keterangan.fullDay || [],
        halfDay: transportData.keterangan.halfDay || [],
        inOut: transportData.keterangan.inOut || [],
        menginap: transportData.keterangan.menginap || [],
      },
    });
  };

  const handleTransportCreate = async () => {
    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));
    try {
      const data = {
        ...vehicle,
        name: mobilModalData.name,
      };

      const res = await apiPostMobilFull(props.isModal ? data : vehicle);

      if (res.status === 201) {
        toast.close(loading);
        toast(
          toastConfig(
            "Transport Created",
            "Transport Berhasil Ditambahkan!",
            "success",
            props.onChange
          )
        );
      } else {
        toast.close(loading);
        toast(
          toastConfig("Create Failed", "Transport Gagal Ditambahkan", "error")
        );
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.close(loading);
      toast(
        toastConfig("Create Failed", "Transport Gagal Ditambahkan", "error")
      );
    }
  };

  const handleTransportUpdate = async () => {
    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));
    try {
      for (const [key, value] of Object.entries(vehicle)) {
        if (value === "") {
          toast.close(loading);
          toast(
            toastConfig("Input Error", `${key} tidak boleh kosong`, "error")
          );
          return;
        }
      }

      const res = await apiPutMobilFull(transportData.id, vehicle);

      if (res.status === 200) {
        toast.close(loading);
        toast(
          toastConfig(
            "Transport Update",
            "Transport Berhasil Diubah!",
            "success",
            props.onChange
          )
        );
      } else {
        toast.close(loading);

        toast(toastConfig("Update Failed", "Transport Gagal Diubah", "error"));
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.close(loading);

      toast(toastConfig("Update Failed", "Transport Gagal Diubah", "error"));
    }
  };

  useEffect(() => {
    if (!props.isModal && location.pathname.includes("edit")) {
      setEditFormActive(true);
      handleTransportSetValue();
    }
  }, [location.pathname, transportData]);

  return (
    <VStack spacing={8} align="stretch">
      <Box
        bg="gray.700"
        p={4}
        rounded="xl"
        boxShadow={!props.isModal && "md"}
        position="relative"
      >
        <HStack justify="space-between" mb={2}>
          <FormLabel fontWeight="bold">Kendaraan</FormLabel>
        </HStack>

        <Box mb={3}>
          <FormLabel>Nama Kendaraan</FormLabel>
          <Input
            value={props.isModal ? mobilModalData.name : vehicle.name}
            onChange={(e) =>
              handleChange(
                "name",
                props.isModal ? mobilModalData.name : e.target.value
              )
            }
            placeholder="Contoh: Toyota Innova Reborn"
            isDisabled={props.isModal}
          />
        </Box>

        <Box mb={3}>
          <FormLabel>Vendor</FormLabel>
          <Input
            value={vehicle.vendor}
            onChange={(e) => handleChange("vendor", e.target.value)}
            placeholder="Contoh: PT. Bali Transport"
          />
        </Box>

        <Box mb={3}>
          <FormLabel>Link Vendor</FormLabel>
          <Input
            value={vehicle.vendor_link}
            onChange={(e) => handleChange("vendor_link", e.target.value)}
            placeholder="https://example.com/innova"
          />
        </Box>

        {layananTypes.map((type) => (
          <Box key={type} mb={4}>
            <HStack justify="space-between">
              <FormLabel textTransform="capitalize">{type}</FormLabel>
              <Button
                size="xs"
                onClick={() => handleAddArea(type)}
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
                    placeholder="Nama Area"
                    value={areaItem.area}
                    onChange={(e) =>
                      handleAreaChange(type, areaIndex, "area", e.target.value)
                    }
                  />
                  <NumberInput
                    value={areaItem.price}
                    onChange={(val) =>
                      handleAreaChange(type, areaIndex, "price", val)
                    }
                    min={0}
                  >
                    <NumberInputField placeholder="Harga" />
                  </NumberInput>
                  <IconButton
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleRemoveArea(type, areaIndex)}
                  />
                </HStack>
              </Box>
            ))}
          </Box>
        ))}

        <Button
          w={"full"}
          bg={"blue.500"}
          onClick={
            editFormActive ? handleTransportUpdate : handleTransportCreate
          }
        >
          {editFormActive ? "Update Transport" : "Create Transport"}
        </Button>
      </Box>
    </VStack>
  );
};

export default TransportForm;
