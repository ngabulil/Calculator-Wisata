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
import { useAdminHotelContext } from "../../../../context/Admin/AdminHotelContext";

const predefinedStars = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
];

const HotelForm = () => {
  const location = useLocation();
  const { hotelData } = useAdminHotelContext();
  const [editFormActive, setEditFormActive] = useState(false);
  const [stars, setStars] = useState(1);
  const [contractUntil, setContractUntil] = useState("");
  const [extraBed, setExtraBed] = useState(false);
  const [hotelName, setHotelName] = useState("");
  const [roomType, setRoomType] = useState("");
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

  const handleHotelSetValue = () => {
    setHotelName(hotelData.hotelName || "");
    setStars(hotelData.stars || 1);
    setRoomType(hotelData.roomType || "");
    setSeasonPrices({
      normal: hotelData.seasons?.normal || "",
      high: hotelData.seasons?.high || "",
      peak: hotelData.seasons?.peak || "",
    });
    setExtraBed(hotelData.extraBed ? "true" : "false");
    setContractUntil(hotelData.contractUntil || "");
  };

  const handleHotelCreate = () => {
    const data = {
      hotelName: hotelName,
      stars: stars,
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

  const handleHotelUpdate = () => {
    const data = {
      hotelName: hotelName,
      stars: stars,
      roomType: roomType,
      seasons: {
        normal: seasonPrices.normal,
        high: seasonPrices.high,
        peak: seasonPrices.peak,
      },

      extraBed: extraBed,
      contractUntil: contractUntil,
    };
  };

  useEffect(() => {
    if (location.pathname.includes("edit")) {
      setEditFormActive(true);
      handleHotelSetValue();
    }
  }, [location.pathname, hotelData]);

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
        Buat Hotel
      </Text>
      <Box mb={4}>
        <FormLabel>Hotel Name</FormLabel>
        <Input
          placeholder="Contoh: Hotel Bintang Bali"
          value={hotelName}
          onChange={(e) => {
            setHotelName(e.target.value);
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
        onClick={editFormActive ? handleHotelUpdate : handleHotelCreate}
      >
        {editFormActive ? "Update Hotel" : "Create Hotel"}
      </Button>
    </Container>
  );
};

export default HotelForm;
