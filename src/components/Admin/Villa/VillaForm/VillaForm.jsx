import {
  Container,
  Box,
  Select,
  FormLabel,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

const predefinedStars = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
];

const VillaForm = () => {
  const [stars, setStars] = useState(1);
  const [contractUntil, setContractUntil] = useState("");
  const [extraBed, setExtraBed] = useState("false");

  const [seasonPrices, setSeasonPrices] = useState({
    normal: "",
    high: "",
    peak: "",
  });

  const [honeymoonPackagePrice, setHoneymoonPackagePrice] = useState("");

  const handleSeasonPriceChange = (season, value) => {
    setSeasonPrices((prev) => ({
      ...prev,
      [season]: value,
    }));
  };

  return (
    <Container maxW="5xl" py={10}>
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
    </Container>
  );
};

export default VillaForm;
