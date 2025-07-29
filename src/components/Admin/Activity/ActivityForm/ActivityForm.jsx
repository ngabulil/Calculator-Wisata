import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Select,
  Text,
  Button,
  FormLabel,
  Flex,
  Container,
  useToast,
} from "@chakra-ui/react";

import { useLocation } from "react-router-dom";
import {
  apiPostActivityDetails,
  apiPutActivityDetails,
} from "../../../../services/activityService";
import toastConfig from "../../../../utils/toastConfig";
import { useAdminActivityContext } from "../../../../context/Admin/AdminActivityContext";

const ActivityFormPage = (props) => {
  const location = useLocation();
  const toast = useToast();
  const {
    activityData,
    allActivityVendors,
    getAllActivityVendors,
    activityModalData,
  } = useAdminActivityContext();
  const [editFormActive, setEditFormActive] = useState(false);
  const [vendorId, setVendorId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceForeignAdult, setPriceForeignAdult] = useState(null);
  const [priceForeignChild, setPriceForeignChild] = useState(null);
  const [priceDomesticAdult, setPriceDomesticAdult] = useState(null);
  const [priceDomesticChild, setPriceDomesticChild] = useState(null);
  const [keterangan, setKeterangan] = useState("");
  const [note, setNote] = useState("");
  const [valid, setValid] = useState("");

  const handleActivitySetValue = () => {
    setVendorId(activityData.vendor_id);
    setName(activityData.name);
    setDescription(activityData.description);
    setPriceForeignAdult(activityData.price_foreign_adult);
    setPriceForeignChild(activityData.price_foreign_child);
    setPriceDomesticAdult(activityData.price_domestic_adult);
    setPriceDomesticChild(activityData.price_domestic_child);
    setKeterangan(activityData.keterangan);
    setNote(activityData.note);
    setValid(activityData.valid);
  };

  const handleActivityCreate = async () => {
    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));
    const data = {
      vendor_id: vendorId,
      name: props.isModal ? activityModalData.name : name,
      description: description,
      price_foreign_adult: priceForeignAdult == "" ? 0 : priceForeignAdult,
      price_foreign_child: priceForeignChild == "" ? 0 : priceForeignChild,
      price_domestic_adult: priceDomesticAdult == "" ? 0 : priceDomesticAdult,
      price_domestic_child: priceDomesticChild == "" ? 0 : priceDomesticChild,
      keterangan: keterangan,
      note: note,
      valid: valid,
    };

    if (!vendorId)
      toast(toastConfig("", "Vendor tidak boleh kosong", "warning"));
    if (!name)
      toast(toastConfig("", "Nama Aktivitas tidak boleh kosong", "warning"));
    if (!valid)
      toast(toastConfig("", "Tanggal Valid tidak boleh kosong", "warning"));

    try {
      const res = await apiPostActivityDetails(data);

      if (res.status === 201) {
        props.onModalClose?.();
        toast.close(loading);
        toast(
          toastConfig(
            "Activity Created",
            "Aktivitas Berhasil Ditambahkan!",
            "success",
            props.onChange
          )
        );
      } else {
        toast.close(loading);
        toast(
          toastConfig("Create Failed", "Aktivitas Gagal Ditambahkan", "error")
        );
      }
    } catch (error) {
      toast.close(loading);
      console.log(error);
      toast(
        toastConfig("Create Failed", "Aktivitas Gagal Ditambahkan", "error")
      );
    }
  };

  const handleActivityUpdate = async () => {
    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));

    if (!vendorId)
      toast(toastConfig("", "Vendor tidak boleh kosong", "warning"));
    if (!name)
      toast(toastConfig("", "Nama Aktivitas tidak boleh kosong", "warning"));
    if (!valid)
      toast(toastConfig("", "Tanggal Valid tidak boleh kosong", "warning"));

    const data = {
      vendor_id: vendorId,
      name: name,
      description: description,
      price_foreign_adult: priceForeignAdult == "" ? 0 : priceForeignAdult,
      price_foreign_child: priceForeignChild == "" ? 0 : priceForeignChild,
      price_domestic_adult: priceDomesticAdult == "" ? 0 : priceDomesticAdult,
      price_domestic_child: priceDomesticChild == "" ? 0 : priceDomesticChild,
      keterangan: keterangan,
      note: note,
      valid: valid,
    };

    try {
      const res = await apiPutActivityDetails(activityData.id, data);

      if (res.status === 200) {
        toast.close(loading);
        toast(
          toastConfig(
            "Sukes Update",
            "Aktivitas Berhasil Diubah!",
            "success",
            props.onChange
          )
        );
      } else {
        toast.close(loading);
        toast(toastConfig("Create Failed", "Aktivitas Gagal Diubah", "error"));
      }
    } catch (error) {
      toast.close(loading);
      console.log(error);
      toast(toastConfig("Create Failed", "Aktivitas Gagal Diubah", "error"));
    }
  };

  useEffect(() => {
    if (!props.isModal && location.pathname.includes("edit")) {
      setEditFormActive(true);
      handleActivitySetValue();
    }
  }, [location.pathname, activityData]);

  useEffect(() => {
    getAllActivityVendors();
  }, []);

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
        {editFormActive ? "Edit Aktivitas" : "Create Aktivitas"}
      </Text>
      <Box mb={4}>
        <FormLabel>Nama Aktivitas</FormLabel>
        <Input
          placeholder="Contoh: Trip Adventure"
          value={props.isModal ? activityModalData.name : name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          isDisabled={props.isModal ? true : false}
        />
      </Box>
      <Box mb={4}>
        <FormLabel>Deskripsi</FormLabel>
        <Input
          placeholder="Deskripsikan Aktivitas Anda"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
      </Box>
      <Box mb={4}>
        <FormLabel>Note</FormLabel>
        <Input
          placeholder="Contoh: Bawa Payung"
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
          }}
        />
      </Box>
      <Box mb={4}>
        <FormLabel>Keterangan</FormLabel>
        <Input
          placeholder="Contoh: Jalan Jalan ke Gunung"
          value={keterangan}
          onChange={(e) => {
            setKeterangan(e.target.value);
          }}
        />
      </Box>
      <Box mb={4}>
        <FormLabel>Vendor</FormLabel>
        <Select
          name="vendor_id"
          value={vendorId}
          onChange={(e) => {
            setVendorId(e.target.value);
          }}
          placeholder="Select vendor"
        >
          {allActivityVendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.name}
            </option>
          ))}
        </Select>{" "}
      </Box>
      <Box mb={4}>
        <FormLabel>Valid Date</FormLabel>
        <Input
          type="date"
          placeholder="Contoh: Aktivitas Bintang Bali"
          value={valid}
          onChange={(e) => {
            setValid(e.target.value);
          }}
        />
      </Box>
      <Flex direction="column" w="full" p={4} bg={"gray.700"} rounded={"12px"}>
        <Text fontSize="20px" fontWeight={"bold"} mb={2}>
          Price List{" "}
        </Text>
        <Box mb={4}>
          <FormLabel>Price Foreign Adult</FormLabel>
          <Input
            type="number"
            placeholder="Contoh: 70000"
            value={priceForeignAdult == null ? 0 : priceForeignAdult}
            onChange={(e) => setPriceForeignAdult(e.target.value)}
            required
          />
        </Box>

        <Box mb={4}>
          <FormLabel>Price Foreign Child</FormLabel>
          <Input
            type="number"
            placeholder="Contoh: 50000"
            value={priceForeignChild == null ? 0 : priceForeignChild}
            onChange={(e) => setPriceForeignChild(e.target.value)}
          />
        </Box>

        <Box mb={4}>
          <FormLabel>Price Domestic Adult</FormLabel>
          <Input
            type="number"
            placeholder="Contoh: 55000"
            value={priceDomesticAdult == null ? 0 : priceDomesticAdult}
            onChange={(e) => setPriceDomesticAdult(e.target.value)}
            required
          />
        </Box>

        <Box mb={4}>
          <FormLabel>Price Domestic Child</FormLabel>
          <Input
            type="number"
            placeholder="Contoh: 35000"
            value={priceDomesticChild == null ? 0 : priceDomesticChild}
            onChange={(e) => setPriceDomesticChild(e.target.value)}
          />
        </Box>
      </Flex>
      <Button
        w={"full"}
        bg={"blue.500"}
        onClick={editFormActive ? handleActivityUpdate : handleActivityCreate}
      >
        {editFormActive ? "Update Aktivitas" : "Create Aktivitas"}
      </Button>
    </Container>
  );
};

export default ActivityFormPage;
