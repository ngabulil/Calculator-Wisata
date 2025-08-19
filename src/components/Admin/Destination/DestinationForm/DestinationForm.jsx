import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Input,
  Text,
  Button,
  FormLabel,
  Flex,
  Container,
  useToast,
  FormControl,
  FormErrorMessage,
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
  const { destinationData, destModalData, destinationDraft } =
    useAdminDestinationContext();
  const [editFormActive, setEditFormActive] = useState(false);

  const [name, setName] = useState("");
  const [priceForeignAdult, setPriceForeignAdult] = useState("");
  const [priceForeignChild, setPriceForeignChild] = useState("");
  const [priceDomesticAdult, setPriceDomesticAdult] = useState("");
  const [priceDomesticChild, setPriceDomesticChild] = useState("");
  const [note, setNote] = useState("");
  const [description, setDescription] = useState(null);
  const [showError, setShowError] = useState(false);
  const nameRef = useRef(null);
  const priceForeignAdultRef = useRef(null);
  const priceForeignChildRef = useRef(null);
  const priceDomesticAdultRef = useRef(null);
  const priceDomesticChildRef = useRef(null);

  const handleDestinationSetValue = () => {
    setName(destinationData.name);
    setPriceForeignAdult(destinationData.price_foreign_adult);
    setPriceForeignChild(destinationData.price_foreign_child);
    setPriceDomesticAdult(destinationData.price_domestic_adult);
    setPriceDomesticChild(destinationData.price_domestic_child);
    setNote(destinationData.note);
    setDescription(destinationData.description || "");
  };

  const handleDestinationDraft = () => {
    setName(destinationDraft.name);
    setPriceForeignAdult(destinationDraft.price_foreign_adult);
    setPriceForeignChild(destinationDraft.price_foreign_child);
    setPriceDomesticAdult(destinationDraft.price_domestic_adult);
    setPriceDomesticChild(destinationDraft.price_domestic_child);
    setNote(destinationDraft.note);
    setDescription(destinationDraft.description || "");
  };

  const handleDestinationCreate = async () => {
    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));
    const data = {
      name: props.isModal ? destModalData.name : name,
      price_foreign_adult: priceForeignAdult == "" ? 0 : priceForeignAdult,
      price_foreign_child: priceForeignChild == "" ? 0 : priceForeignChild,
      price_domestic_adult: priceDomesticAdult == "" ? 0 : priceDomesticAdult,
      price_domestic_child: priceDomesticChild == "" ? 0 : priceDomesticChild,
      note: note,
      description: description,
    };

    try {
      const res = await apiPostDestination(data);

      if (res.status === 201) {
        props.onModalClose?.();
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
      price_foreign_adult: priceForeignAdult == "" ? 0 : priceForeignAdult,
      price_foreign_child: priceForeignChild == "" ? 0 : priceForeignChild,
      price_domestic_adult: priceDomesticAdult == "" ? 0 : priceDomesticAdult,
      price_domestic_child: priceDomesticChild == "" ? 0 : priceDomesticChild,
      note: note,
      description: description,
    };

    try {
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

  const handleButtonClicked = () => {
    setShowError(true);

    if (editFormActive) {
      handleDestinationUpdate();
    } else {
      handleDestinationCreate();
    }
  };

  useEffect(() => {
    if (!props.isModal && location.pathname.includes("edit")) {
      setEditFormActive(true);
      handleDestinationSetValue();
    } else {
      console.log("draft", destinationDraft);
      handleDestinationDraft();
    }
  }, [location.pathname, destinationData]);

  useEffect(() => {
    if (!location.pathname.includes("edit")) {
      const data = {
        name: props.isModal ? destModalData.name : name,
        price_foreign_adult: priceForeignAdult == "" ? 0 : priceForeignAdult,
        price_foreign_child: priceForeignChild == "" ? 0 : priceForeignChild,
        price_domestic_adult: priceDomesticAdult == "" ? 0 : priceDomesticAdult,
        price_domestic_child: priceDomesticChild == "" ? 0 : priceDomesticChild,
        note: note,
        description: description,
      };

      props.onDraft(data);
    }
  }, [
    name,
    note,
    description,
    priceForeignAdult,
    priceForeignChild,
    priceDomesticAdult,
    priceDomesticChild,
  ]);

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
        <FormControl isRequired isInvalid={showError && !name}>
          <FormLabel>Nama Destinasi</FormLabel>
          <Input
            ref={nameRef}
            placeholder="Contoh: Garuda Wisnu Kencana"
            value={props.isModal ? destModalData.name : name}
            isDisabled={props.isModal}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          {showError && !name && (
            <FormErrorMessage>Nama Destinasi wajib diisi</FormErrorMessage>
          )}
        </FormControl>
      </Box>
      <Box mb={4}>
        <FormLabel>Deskripsi</FormLabel>
        <Input
          placeholder="Contoh: Tuliskan Deskripsi Destinasi"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
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
          <FormControl isRequired isInvalid={showError && !priceForeignAdult}>
            <FormLabel>Price Foreign Adult</FormLabel>
            <Input
              ref={priceForeignAdultRef}
              type="number"
              placeholder="Contoh: 70"
              value={priceForeignAdult == null ? 0 : priceForeignAdult}
              onChange={(e) => setPriceForeignAdult(e.target.value)}
            />
            {showError && !priceForeignAdult && (
              <FormErrorMessage>
                Price Foreign Adult wajib diisi
              </FormErrorMessage>
            )}
          </FormControl>
        </Box>

        <Box mb={4}>
          <FormControl isRequired isInvalid={showError && !priceForeignChild}>
            <FormLabel>Price Foreign Child</FormLabel>
            <Input
              type="number"
              placeholder="Contoh: 50"
              value={priceForeignChild == null ? 0 : priceForeignChild}
              onChange={(e) => setPriceForeignChild(e.target.value)}
            />
            {showError && !priceForeignChild && (
              <FormErrorMessage>
                Price Foreign Child wajib diisi
              </FormErrorMessage>
            )}
          </FormControl>
        </Box>

        <Box mb={4}>
          <FormControl isRequired isInvalid={showError && !priceDomesticAdult}>
            <FormLabel>Price Domestic Adult</FormLabel>
            <Input
              type="number"
              placeholder="Contoh: 55"
              value={priceDomesticAdult == null ? 0 : priceDomesticAdult}
              onChange={(e) => setPriceDomesticAdult(e.target.value)}
            />
            {showError && !priceDomesticAdult && (
              <FormErrorMessage>
                Price Domestic Adult wajib diisi
              </FormErrorMessage>
            )}
          </FormControl>
        </Box>

        <Box mb={4}>
          <FormControl isRequired isInvalid={showError && !priceDomesticChild}>
            <FormLabel>Price Domestic Child</FormLabel>
            <Input
              type="number"
              placeholder="Contoh: 35"
              value={priceDomesticChild == null ? 0 : priceDomesticChild}
              onChange={(e) => setPriceDomesticChild(e.target.value)}
            />
            {showError && !priceDomesticChild && (
              <FormErrorMessage>
                Price Domestic Child wajib diisi
              </FormErrorMessage>
            )}
          </FormControl>
        </Box>
      </Flex>
      <Button w={"full"} bg={"teal.600"} onClick={handleButtonClicked}>
        {editFormActive ? "Update Destinasi" : "Create Destinasi"}
      </Button>
    </Container>
  );
};

export default DestinationFormPage;
