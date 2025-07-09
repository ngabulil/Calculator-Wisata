import React, { useState } from "react";
import {
  Box,
  Input,
  Select,
  Text,
  Button,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Flex,
  Container,
} from "@chakra-ui/react";

// Dummy data vendor dari array
const vendors = [
  {
    id: 1,
    name: "Bali Adventure Tours",
    createdAt: "2025-07-07T00:54:10.412Z",
    updatedAt: "2025-07-07T00:54:10.412Z",
  },
];

const ActivityFormPage = () => {
  const [editFormActive, setEditFormActive] = useState(false);
  const [vendorId, setVendorId] = useState("");
  const [name, setName] = useState("");
  const [priceForeignAdult, setPriceForeignAdult] = useState("");
  const [priceForeignChild, setPriceForeignChild] = useState("");
  const [priceDomesticAdult, setPriceDomesticAdult] = useState("");
  const [priceDomesticChild, setPriceDomesticChild] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [note, setNote] = useState("");
  const [valid, setValid] = useState("");

  const handleActivityCreate = () => {
    console.log("Submitted activity:");
  };
  const handleActivityUpdate = () => {
    console.log("Submitted activity:");
  };

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
          value={name}
          onChange={(e) => {
            setName(e.target.value);
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
          {vendors.map((vendor) => (
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
        onClick={editFormActive ? handleActivityUpdate : handleActivityCreate}
      >
        {editFormActive ? "Update Aktivitas" : "Create Aktivitas"}
      </Button>
    </Container>
  );
};

export default ActivityFormPage;
