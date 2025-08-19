import React, { useState, useEffect, useRef } from "react";
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
  FormControl,
  FormErrorMessage,
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
  const { restaurantData, restModalData, restaurantDraft } =
    useAdminRestaurantContext();
  const [editFormActive, setEditFormActive] = useState(false);
  //
  const [restoName, setRestoName] = useState("");
  const [restoDescription, setRestoDescription] = useState(null);
  const [restoPackage, setRestoPackage] = useState([]);
  const [showError, setShowError] = useState(false);
  const restoNameRef = useRef(null);

  const handleRestaurantSetValue = () => {
    setRestoName(restaurantData.resto_name);
    setRestoDescription(restaurantData.description);
  };

  const handleRestaurantDraft = () => {
    setRestoName(restaurantDraft.resto_name);
    setRestoDescription(restaurantDraft.description);
  };

  const handleRestaurantCreate = async () => {
    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));

    restoPackage.forEach((item) => {
      [
        "price_domestic_adult",
        "price_domestic_child",
        "price_foreign_adult",
        "price_foreign_child",
      ].forEach((key) => {
        if (item[key] === "") {
          item[key] = null;
        }
      });

      if (!item.valid) {
        toast(toastConfig("", "Tanggal Validasi belum diisi", "warning"));
        return;
      }
    });

    const data = {
      resto_name: props.isModal ? restModalData.name : restoName,
      description: restoDescription,
      packages: restoPackage,
    };

    try {
      const res = await apiPostRestaurant(data);

      if (res.status === 201) {
        props.onModalClose?.();
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
    restoPackage.forEach((item) => {
      [
        "price_domestic_adult",
        "price_domestic_child",
        "price_foreign_adult",
        "price_foreign_child",
      ].forEach((key) => {
        if (item[key] === "") {
          item[key] = null;
        }
      });
      if (!item.valid) {
        toast(toastConfig("", "Tanggal Validasi belum diisi", "warning"));
        return;
      }
    });

    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));
    const data = {
      resto_name: restoName,
      description: restoDescription,
      packages: restoPackage,
    };

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

  const handleButtonClicked = () => {
    setShowError(true);
    if (!restoName) {
      restoNameRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      restoNameRef.current?.focus();
      return;
    }
    if (editFormActive) {
      handleRestaurantUpdate();
    } else {
      handleRestaurantCreate();
    }
  };

  useEffect(() => {
    if (!props.isModal && location.pathname.includes("edit")) {
      setEditFormActive(true);
      handleRestaurantSetValue();
    } else {
      handleRestaurantDraft();
    }
  }, [location.pathname, restaurantData]);

  useEffect(() => {
    if (!location.pathname.includes("edit")) {
      const data = {
        resto_name: props.isModal ? restModalData.name : restoName,
        description: restoDescription,
        packages: restoPackage,
      };

      props.onDraft(data);
    }
  }, [restoName, restoDescription, restoPackage]);

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
        <FormControl isRequired isInvalid={showError && !restoName}>
          <FormLabel>Nama Restaurant</FormLabel>
          <Input
            ref={restoNameRef}
            placeholder="Contoh: Nama Restaurant"
            value={props.isModal ? restModalData.name : restoName}
            isDisabled={props.isModal}
            onChange={(e) => {
              setRestoName(e.target.value);
            }}
          />
          {showError && !name && (
            <FormErrorMessage>Nama Restaurant wajib diisi</FormErrorMessage>
          )}
        </FormControl>
      </Box>
      <Box mb={4}>
        <FormLabel>Deskripsi Restaurant</FormLabel>
        <Input
          placeholder="Contoh: Nama Restaurant"
          value={restoDescription}
          isDisabled={props.isModal}
          onChange={(e) => {
            setRestoDescription(e.target.value);
          }}
        />
      </Box>
      <PackageFormList
        isEdit={editFormActive}
        showError={showError}
        packagesValue={
          editFormActive
            ? restaurantData.packages || []
            : restaurantDraft.packages || []
        }
        onChange={(packages) => {
          setRestoPackage(packages);
        }}
      />

      <Button w={"full"} bg={"teal.600"} mt={4} onClick={handleButtonClicked}>
        {editFormActive ? "Update Restaurant" : "Create Restaurant"}
      </Button>
    </Container>
  );
};

const PackageFormList = (props) => {
  const showError = props.showError;

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
    const priceFields = [
      "price_domestic_adult",
      "price_domestic_child",
      "price_foreign_adult",
      "price_foreign_child",
    ];

    if (priceFields.includes(field)) {
      newPackages[index][field] = value === null ? "" : Number(value);
    } else {
      newPackages[index][field] = value;
    }

    setPackages(newPackages);
    props.onChange(newPackages);
  };
  useEffect(() => {
    if (props.packagesValue?.length > 0) {
      const mappedPackages = props.packagesValue.map((pkg) => ({
        name: pkg.package_name || pkg.name || "",
        price_domestic_adult:
          pkg.price_domestic_adult == null ? 0 : pkg.price_domestic_adult,
        price_domestic_child:
          pkg.price_domestic_child == null ? 0 : pkg.price_domestic_child,
        price_foreign_adult:
          pkg.price_foreign_adult == null ? 0 : pkg.price_foreign_adult,
        price_foreign_child:
          pkg.price_foreign_child == null ? 0 : pkg.price_foreign_child,
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
            <FormControl isRequired isInvalid={showError && !pkg.name}>
              <FormLabel>Nama Paket</FormLabel>
              <Input
                placeholder="Contoh: Paket A"
                value={pkg.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
              {showError && !pkg.name && (
                <FormErrorMessage>Nama Paket wajib diisi</FormErrorMessage>
              )}
            </FormControl>
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

          <FormControl isRequired isInvalid={showError && !pkg.valid}>
            <FormLabel>Valid Sampai</FormLabel>
            <Input
              type="date"
              value={pkg.valid?.split("T")[0] || ""}
              onChange={(e) => handleChange(index, "valid", e.target.value)}
            />
            {showError && !pkg.valid && (
              <FormErrorMessage>Tanggal validasi wajib diisi</FormErrorMessage>
            )}
          </FormControl>

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
