import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Text,
  Button,
  FormLabel,
  Flex,
  Container,
  useToast,
} from "@chakra-ui/react";

import { useLocation } from "react-router-dom";
import {
  apiPutDestination,
  apiPostDestination,
} from "../../../../services/destinationService";
import toastConfig from "../../../../utils/toastConfig";
import { useAdminDestinationContext } from "../../../../context/Admin/AdminDestinationContext";

const DestinationFormPage = (props) => {
  const location = useLocation();
  const toast = useToast();
  const { destinationData } = useAdminDestinationContext();
  const [editFormActive, setEditFormActive] = useState(false);

  const [name, setName] = useState("");
  const [priceForeignAdult, setPriceForeignAdult] = useState("");
  const [priceForeignChild, setPriceForeignChild] = useState("");
  const [priceDomesticAdult, setPriceDomesticAdult] = useState("");
  const [priceDomesticChild, setPriceDomesticChild] = useState("");

  const [note, setNote] = useState("");

  const handleDestinationSetValue = () => {
    setName(destinationData.name);
    setPriceForeignAdult(destinationData.price_foreign_adult);
    setPriceForeignChild(destinationData.price_foreign_child);
    setPriceDomesticAdult(destinationData.price_domestic_adult);
    setPriceDomesticChild(destinationData.price_domestic_child);
    setNote(destinationData.note);
  };

  const handleDestinationCreate = async () => {
    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));
    const data = {
      name: name,
      price_foreign_adult: priceForeignAdult,
      price_foreign_child: priceForeignChild,
      price_domestic_adult: priceDomesticAdult,
      price_domestic_child: priceDomesticChild,
      note: note,
    };

    try {
      for (const [key, value] of Object.entries(data)) {
        if (value === "") {
          toast.close(loading);
          toast(
            toastConfig("Input Error", `${key} tidak boleh kosong`, "error")
          );
          return;
        }
      }

      const res = await apiPostDestination(data);

      if (res.status === 201) {
        toast.close(loading);
        toast(
          toastConfig(
            "Destinasi Created",
            "Destinasi Berhasil Ditambahkan!",
            "success",
            props.onChange
          )
        );
      } else {
        toast.close(loading);
        toast(
          toastConfig("Create Failed", "Destinasi Gagal Ditambahkan", "error")
        );
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.close(loading);
      toast(
        toastConfig("Create Failed", "Destinasi Gagal Ditambahkan", "error")
      );
    }
  };

  const handleDestinationUpdate = async () => {
    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));
    const data = {
      name: name,
      price_foreign_adult: priceForeignAdult,
      price_foreign_child: priceForeignChild,
      price_domestic_adult: priceDomesticAdult,
      price_domestic_child: priceDomesticChild,
      note: note,
    };

    try {
      for (const [key, value] of Object.entries(data)) {
        if (value === "") {
          toast.close(loading);
          toast(
            toastConfig("Input Error", `${key} tidak boleh kosong`, "error")
          );
          return;
        }
      }

      const res = await apiPutDestination(destinationData.id, data);

      if (res.status === 200) {
        toast.close(loading);
        toast(
          toastConfig(
            "Sukses Update",
            "Destinasi Berhasil Diubah!",
            "success",
            props.onChange
          )
        );
      } else {
        toast.close(loading);
        toast(toastConfig("Create Failed", "Destinasi Gagal Diubah", "error"));
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.close(loading);
      toast(toastConfig("Create Failed", "Destinasi Gagal Diubah", "error"));
    }
  };

  useEffect(() => {
    if (location.pathname.includes("edit")) {
      setEditFormActive(true);
      handleDestinationSetValue();
    }
  }, [location.pathname, destinationData]);

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
        {editFormActive ? "Edit Destinasi" : "Create Destinasi"}
      </Text>
      <Box mb={4}>
        <FormLabel>Nama Destinasi</FormLabel>
        <Input
          placeholder="Contoh: Garuda Wisnu Kencana"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </Box>
      <Box mb={4}>
        <FormLabel>Note</FormLabel>
        <Input
          placeholder="Contoh: Sudah termasuk tiket"
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
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
            placeholder="Contoh: 70"
            value={priceForeignAdult}
            onChange={(e) => setPriceForeignAdult(e.target.value)}
          />
        </Box>

        <Box mb={4}>
          <FormLabel>Price Foreign Child</FormLabel>
          <Input
            type="number"
            placeholder="Contoh: 50"
            value={priceForeignChild}
            onChange={(e) => setPriceForeignChild(e.target.value)}
          />
        </Box>

        <Box mb={4}>
          <FormLabel>Price Domestic Adult</FormLabel>
          <Input
            type="number"
            placeholder="Contoh: 55"
            value={priceDomesticAdult}
            onChange={(e) => setPriceDomesticAdult(e.target.value)}
          />
        </Box>

        <Box mb={4}>
          <FormLabel>Price Domestic Child</FormLabel>
          <Input
            type="number"
            placeholder="Contoh: 35"
            value={priceDomesticChild}
            onChange={(e) => setPriceDomesticChild(e.target.value)}
          />
        </Box>
      </Flex>
      <Button
        w={"full"}
        bg={"blue.500"}
        onClick={
          editFormActive ? handleDestinationUpdate : handleDestinationCreate
        }
      >
        {editFormActive ? "Update Destinasi" : "Create Destinasi"}
      </Button>
    </Container>
  );
};

export default DestinationFormPage;
