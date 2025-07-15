import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Text,
  Button,
  FormLabel,
  Container,
  useToast,
  NumberInput,
  NumberInputField,
  VStack,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { useLocation } from "react-router-dom";
import {
  apiPutRestaurant,
  apiPostRestaurant,
} from "../../../../services/restaurantService";
import toastConfig from "../../../../utils/toastConfig";
import { useAdminRestaurantContext } from "../../../../context/Admin/AdminRestaurantContext";

const RestaurantFormPage = (props) => {
  const location = useLocation();
  const toast = useToast();
  const { restaurantData } = useAdminRestaurantContext();
  const [editFormActive, setEditFormActive] = useState(false);
  //
  const [restoName, setRestoName] = useState("");
  const [restoPackage, setRestoPackage] = useState([]);

  const handleRestaurantSetValue = () => {
    setRestoName(restaurantData.resto_name);
  };

  const handleRestaurantCreate = async () => {
    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));
    const data = {
      resto_name: restoName,
      packages: restoPackage,
    };

    for (const [key, value] of Object.entries(data)) {
      if (value === "") {
        toast(toastConfig("Input Error", `${key} tidak boleh kosong`, "error"));
        return;
      }
    }

    try {
      const res = await apiPostRestaurant(data);

      if (res.status === 201) {
        toast.close(loading);
        toast(
          toastConfig(
            "Restaurant Created",
            "Restaurant Berhasil Ditambahkan!",
            "success",
            props.onChange
          )
        );
      } else {
        toast.close(loading);
        toast(
          toastConfig("Create Failed", "Restaurant Gagal Ditambahkan", "error")
        );
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.close(loading);
      toast(
        toastConfig("Create Failed", "Restaurant Gagal Ditambahkan", "error")
      );
    }
  };

  const handleRestaurantUpdate = async () => {
    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));
    const data = {
      resto_name: restoName,
      packages: restoPackage,
    };

    for (const [key, value] of Object.entries(data)) {
      if (value === "") {
        toast(toastConfig("Input Error", `${key} tidak boleh kosong`, "error"));
        return;
      }
    }

    try {
      const res = await apiPutRestaurant(restaurantData.id, data);

      if (res.status === 200) {
        toast.close(loading);
        toast(
          toastConfig(
            "Restaurant Update",
            "Restaurant Berhasil Diubah!",
            "success",
            props.onChange
          )
        );
      } else {
        toast.close(loading);
        toast(toastConfig("Update Failed", "Restaurant Gagal Diubah", "error"));
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.close(loading);

      toast(toastConfig("Update Failed", "Restaurant Gagal Diubah", "error"));
    }
  };

  useEffect(() => {
    if (location.pathname.includes("edit")) {
      setEditFormActive(true);
      handleRestaurantSetValue();
    }
  }, [location.pathname, restaurantData]);

  return (
    <Container
      maxW="5xl"
      p={6}
      bg={"gray.800"}
      rounded={"12px"}
      display={"flex"}
      flexDirection={"column"}
      gap={2}
    >
      <Text fontSize="24px" fontWeight={"bold"}>
        {editFormActive ? "Edit Restaurant" : "Create Restaurant"}
      </Text>
      <Box mb={4}>
        <FormLabel>Nama Restaurant</FormLabel>
        <Input
          placeholder="Contoh: Nama Restaurant"
          value={restoName}
          onChange={(e) => {
            setRestoName(e.target.value);
          }}
        />
      </Box>
      <PackageFormList
        isEdit={editFormActive}
        packagesValue={restaurantData.packages || []}
        onChange={(packages) => {
          setRestoPackage(packages);
        }}
      />

      <Button
        w={"full"}
        bg={"blue.500"}
        mt={4}
        onClick={
          editFormActive ? handleRestaurantUpdate : handleRestaurantCreate
        }
      >
        {editFormActive ? "Update Restaurant" : "Create Restaurant"}
      </Button>
    </Container>
  );
};

const PackageFormList = (props) => {
  const [packages, setPackages] = useState([
    {
      name: "",
      price_domestic_adult: 0,
      price_domestic_child: 0,
      price_foreign_adult: 0,
      price_foreign_child: 0,
      pax: "",
      note: "",
      valid: "",
      link_contract: "",
    },
  ]);

  const handleAddPackage = () => {
    setPackages([
      ...packages,
      {
        name: "",
        price_domestic_adult: 0,
        price_domestic_child: 0,
        price_foreign_adult: 0,
        price_foreign_child: 0,
        pax: "",
        note: "",
        valid: "",
        link_contract: "",
      },
    ]);
  };

  const handleRemovePackage = (index) => {
    setPackages(packages.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const newPackages = [...packages];
    newPackages[index][field] = value;
    setPackages(newPackages);
    props.onChange(newPackages);
  };
  useEffect(() => {
    if (props.isEdit && props.packagesValue?.length > 0) {
      const mappedPackages = props.packagesValue.map((pkg) => ({
        name: pkg.package_name,
        price_domestic_adult: pkg.price_domestic_adult,
        price_domestic_child: pkg.price_domestic_child,
        price_foreign_adult: pkg.price_foreign_adult,
        price_foreign_child: pkg.price_foreign_child,
        pax: pkg.pax,
        note: pkg.note,
        valid: pkg.valid,
        link_contract: pkg.link_contract,
      }));

      setPackages(mappedPackages);
      props.onChange(mappedPackages);
    }
  }, [props.isEdit, props.packagesValue]);

  return (
    <VStack spacing={4} align="stretch">
      {packages.map((pkg, index) => (
        <Box
          key={index}
          bg={"gray.700"}
          rounded={12}
          p={4}
          boxShadow="md"
          position="relative"
        >
          <HStack justify="space-between" mb={4}>
            <FormLabel fontWeight="bold">Paket #{index + 1}</FormLabel>
            <IconButton
              icon={<DeleteIcon />}
              size="sm"
              colorScheme="red"
              aria-label="Hapus paket"
              onClick={() => handleRemovePackage(index)}
              isDisabled={packages.length === 1}
            />
          </HStack>

          <Box mb={3}>
            <FormLabel>Nama Paket</FormLabel>
            <Input
              placeholder="Contoh: Paket A"
              value={pkg.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
            />
          </Box>

          <Box mb={3}>
            <FormLabel>Harga Domestik Dewasa</FormLabel>
            <NumberInput
              value={pkg.price_domestic_adult}
              onChange={(val) =>
                handleChange(index, "price_domestic_adult", val)
              }
            >
              <NumberInputField placeholder="Contoh: 75000" />
            </NumberInput>
          </Box>

          <Box mb={3}>
            <FormLabel>Harga Domestik Anak</FormLabel>
            <NumberInput
              value={pkg.price_domestic_child}
              onChange={(val) =>
                handleChange(index, "price_domestic_child", val)
              }
            >
              <NumberInputField placeholder="Contoh: 50000" />
            </NumberInput>
          </Box>

          <Box mb={3}>
            <FormLabel>Harga Asing Dewasa</FormLabel>
            <NumberInput
              value={pkg.price_foreign_adult}
              onChange={(val) =>
                handleChange(index, "price_foreign_adult", val)
              }
            >
              <NumberInputField placeholder="Contoh: 110000" />
            </NumberInput>
          </Box>

          <Box mb={3}>
            <FormLabel>Harga Asing Anak</FormLabel>
            <NumberInput
              value={pkg.price_foreign_child}
              onChange={(val) =>
                handleChange(index, "price_foreign_child", val)
              }
            >
              <NumberInputField placeholder="Contoh: 80000" />
            </NumberInput>
          </Box>

          <Box mb={3}>
            <FormLabel>Jumlah Pax</FormLabel>
            <Input
              placeholder="Contoh: 1"
              value={pkg.pax}
              onChange={(e) => handleChange(index, "pax", e.target.value)}
            />
          </Box>

          <Box mb={3}>
            <FormLabel>Catatan</FormLabel>
            <Input
              placeholder="Contoh: Minimal 2 pax"
              value={pkg.note}
              onChange={(e) => handleChange(index, "note", e.target.value)}
            />
          </Box>

          <Box mb={3}>
            <FormLabel>Valid Sampai</FormLabel>
            <Input
              type="date"
              value={pkg.valid?.split("T")[0] || ""}
              onChange={(e) => handleChange(index, "valid", e.target.value)}
            />
          </Box>

          <Box mb={3}>
            <FormLabel>Link Kontrak</FormLabel>
            <Input
              placeholder="https://..."
              value={pkg.link_contract}
              onChange={(e) =>
                handleChange(index, "link_contract", e.target.value)
              }
            />
          </Box>
        </Box>
      ))}

      <Button
        w={"full"}
        leftIcon={<AddIcon />}
        variant={"outline"}
        colorScheme="teal"
        onClick={handleAddPackage}
        alignSelf="flex-start"
      >
        Tambah Paket
      </Button>
    </VStack>
  );
};

export default RestaurantFormPage;
