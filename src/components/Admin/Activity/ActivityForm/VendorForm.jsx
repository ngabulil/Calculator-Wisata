import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Text,
  Button,
  FormLabel,
  Container,
  useToast,
} from "@chakra-ui/react";

import { useLocation } from "react-router-dom";
import {
  apiPostActivityVendors,
  apiPutActivityVendors,
} from "../../../../services/activityService";
import toastConfig from "../../../../utils/toastConfig";
import { useAdminActivityContext } from "../../../../context/Admin/AdminActivityContext";

const VendorFormPage = (props) => {
  const location = useLocation();
  const toast = useToast();
  const { vendorData, vendorDraft } = useAdminActivityContext();
  const [editFormActive, setEditFormActive] = useState(false);

  const [name, setName] = useState("");

  const handleVendorSetValue = () => {
    setName(vendorData.name);
  };

  const handleVendorDraft = () => {
    setName(vendorDraft?.name || "");
  };

  const handleVendorCreate = async () => {
    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));
    const data = {
      name: name,
    };

    try {
      const res = await apiPostActivityVendors(data);

      if (res.status === 201) {
        toast.close(loading);
        toast(
          toastConfig(
            "Vendor Created",
            "Vendor Berhasil Ditambahkan!",
            "success",
            props.onChange
          )
        );
      } else {
        toast.close(loading);
        toast(
          toastConfig("Create Failed", "Vendor Gagal Ditambahkan", "error")
        );
      }
    } catch (error) {
      toast.close(loading);
      console.log(error);
      toast(toastConfig("Create Failed", "Vendor Gagal Ditambahkan", "error"));
    }
  };

  const handleVendorUpdate = async () => {
    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));
    const data = {
      name: name,
    };

    try {
      const res = await apiPutActivityVendors(vendorData.id, data);

      if (res.status === 200) {
        toast.close(loading);
        toast(
          toastConfig(
            "Vendor Update",
            "Vendor Berhasil Diubah!",
            "success",
            props.onChange
          )
        );
      } else {
        toast.close(loading);
        toast(toastConfig("Update Failed", "Vendor Gagal Diubah", "error"));
      }
    } catch (error) {
      toast.close(loading);
      console.log(error);
      toast(toastConfig("Update Failed", "Vendor Gagal Diubah", "error"));
    }
  };

  useEffect(() => {
    if (location.pathname.includes("edit")) {
      setEditFormActive(true);
      handleVendorSetValue();
    } else {
      handleVendorDraft();
    }
  }, [location.pathname, vendorData]);

  useEffect(() => {
    if (!location.pathname.includes("edit")) {
      const data = {
        name: name,
      };
      props.onDraft(data);
    }
  }, [name]);

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
        {editFormActive ? "Edit Vendor" : "Create Vendor"}
      </Text>
      <Box mb={4}>
        <FormLabel>Nama Vendor</FormLabel>
        <Input
          placeholder="Contoh: Trip Adventure"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </Box>

      <Button
        w={"full"}
        bg={"teal.600"}
        onClick={editFormActive ? handleVendorUpdate : handleVendorCreate}
      >
        {editFormActive ? "Update Vendor" : "Create Vendor"}
      </Button>
    </Container>
  );
};

export default VendorFormPage;
