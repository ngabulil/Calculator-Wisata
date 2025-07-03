import {
  Container,
  Box,
  Select,
  FormLabel,
  Input,
  Text,
  VStack,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAdminVillaContext } from "../../../../context/Admin/AdminVillaContext";

const predefinedStars = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
];

const VillaForm = () => {
  const location = useLocation();
  const { villaData } = useAdminVillaContext();
  const [editFormActive, setEditFormActive] = useState(false);
  const [stars, setStars] = useState(1);
  const [contractUntil, setContractUntil] = useState("");
  const [extraBed, setExtraBed] = useState("false");
  const [honeymoonPackagePrice, setHoneymoonPackagePrice] = useState("");
  const [villaName, setVillaName] = useState("");
  const [roomType, setRoomType] = useState("");
  const [photoLink, setPhotoLink] = useState("");
  const [seasonPrices, setSeasonPrices] = useState({
    normal: "",
    high: "",
    peak: "",
  });

  const handleSeasonPriceChange = (season, value) => {
    setSeasonPrices((prev) => ({
      ...prev,
      [season]: value,
    }));
  };

  const handleVillaSetValue = () => {
    setVillaName(villaData.hotelName || "");
    setStars(villaData.stars || 1);
    setRoomType(villaData.roomType || "");
    setSeasonPrices({
      normal: villaData.seasons?.normal || "",
      high: villaData.seasons?.high || "",
      peak: villaData.seasons?.peak || "",
    });
    setExtraBed(villaData.extraBed ? "true" : "false");
    setContractUntil(villaData.contractUntil || "");
    setPhotoLink(villaData.photoLink || "");
  };

  const handleVillaCreate = () => {
    const data = {
      hotelName: villaName,
      stars: stars,
      photoLink: photoLink,
      roomType: roomType,
      seasons: {
        normal: seasonPrices.normal,
        high: seasonPrices.high,
        peak: seasonPrices.peak,
      },

      extraBed: extraBed,
      contractUntil: contractUntil,
    };
    console.log(data);
  };

  const handleVillaUpdate = () => {
    const data = {
      hotelName: villaName,
      stars: stars,
      roomType: roomType,
      photoLink: photoLink,
      seasons: {
        normal: seasonPrices.normal,
        high: seasonPrices.high,
        peak: seasonPrices.peak,
      },

      extraBed: extraBed,
      contractUntil: contractUntil,
    };

    console.log(data);
  };

  useEffect(() => {
    if (location.pathname.includes("edit")) {
      setEditFormActive(true);
      handleVillaSetValue();
    }
  }, [location.pathname, villaData]);
  return (
    <Container
      maxW="5xl"
      p={6}
      bg={"gray.700"}
      rounded={"12px"}
      display={"flex"}
      flexDirection={"column"}
      gap={2}
    >
      <Text fontSize="24px" fontWeight={"bold"}>
        {editFormActive ? "Edit Villa" : "Create Villa"}
      </Text>
      <Box mb={4}>
        <FormLabel>Villa Name</FormLabel>
        <Input
          placeholder="Contoh: Villa Bintang Bali"
          value={"Villa"}
          onChange={(e) => {
            console.log(e.target.value);
          }}
        />
      </Box>
      <Box mb={4}>
        <FormLabel>Room Type</FormLabel>
        <Input
          placeholder="Contoh: Livio Suite"
          value={roomType}
          onChange={(e) => {
            setRoomType(e.target.value);
          }}
        />
      </Box>
      <Box mb={4}>
        <FormLabel>Link Hotel Photos</FormLabel>
        <Input
          placeholder="Contoh: https://picsum.photos/id/237/200/300 "
          value={photoLink}
          onChange={(e) => {
            setRoomType(e.target.value);
          }}
        />
      </Box>

      <Box mb={4}>
        <FormLabel>Stars</FormLabel>
        <Select value={stars} onChange={(e) => setStars(e.target.value)}>
          {predefinedStars.map((p, idx) => (
            <option key={idx} value={p.value}>
              {p.label}
            </option>
          ))}
        </Select>
      </Box>

      <Box mb={4}>
        <FormLabel>Season Prices</FormLabel>
        <VStack
          spacing={3}
          align="stretch"
          p={"12px"}
          bg={"gray.800"}
          rounded={"12px"}
        >
          <Box>
            <Text fontSize="sm" mb={1}>
              Normal Season Price
            </Text>
            <Input
              type="number"
              placeholder="e.g. 500000"
              value={seasonPrices.normal}
              onChange={(e) =>
                handleSeasonPriceChange("normal", e.target.value)
              }
            />
          </Box>
          <Box>
            <Text fontSize="sm" mb={1}>
              High Season Price
            </Text>
            <Input
              type="number"
              placeholder="e.g. 750000"
              value={seasonPrices.high}
              onChange={(e) => handleSeasonPriceChange("high", e.target.value)}
            />
          </Box>
          <Box>
            <Text fontSize="sm" mb={1}>
              Peak Season Price
            </Text>
            <Input
              type="number"
              placeholder="e.g. 1000000"
              value={seasonPrices.peak}
              onChange={(e) => handleSeasonPriceChange("peak", e.target.value)}
            />
          </Box>
        </VStack>
      </Box>

      <Box mb={4}>
        <FormLabel>Honeymoon Package Price</FormLabel>
        <Input
          type="number"
          placeholder="e.g. 1500000"
          value={honeymoonPackagePrice}
          onChange={(e) => setHoneymoonPackagePrice(e.target.value)}
        />
      </Box>

      <Box mb={4}>
        <FormLabel>Contract Until</FormLabel>
        <Input
          type="date"
          value={contractUntil}
          onChange={(e) => setContractUntil(e.target.value)}
        />
      </Box>

      <Box mb={4}>
        <FormLabel>Extra Bed Available</FormLabel>
        <Select value={extraBed} onChange={(e) => setExtraBed(e.target.value)}>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </Select>
      </Box>
      <Button
        w={"full"}
        bg={"blue.500"}
        onClick={editFormActive ? handleVillaUpdate : handleVillaCreate}
      >
        {editFormActive ? "Update Hotel" : "Create Hotel"}
      </Button>
    </Container>
  );
};

export default VillaForm;
