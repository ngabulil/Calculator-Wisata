import {
  Container,
  Heading,
  VStack,
  Box,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import TourHeaderForm from "../../../../components/TourForm/TourHeaderForm.jsx";
import RestaurantForm from "../../../../components/TourForm/RestaurantForm.jsx";
import VisitorCategoryForm from "../../../../components/TourForm/VisitorCategoryForm.jsx";
import PriceSummaryBox from "../../../../components/TourForm/PriceSummaryBox.jsx";

const TourPackagePage = () => {
  const [tourInfo, setTourInfo] = useState({});
  const [restaurants, setRestaurants] = useState([]);
  const [visitorData, setVisitorData] = useState({});
  const toast = useToast();

  const handleSubmit = () => {
    // toast({
    //   title: "Paket Tour Disimpan.",
    //   description: "Data berhasil disubmit.",
    //   status: "success",
    //   duration: 3000,
    //   isClosable: true,
    // });
    console.log({ tourInfo, restaurants, visitorData });
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
      <Heading mb={6}>Buat Paket Tour</Heading>
      <VStack spacing={8} align="stretch">
        <TourHeaderForm onChange={setTourInfo} />
        <RestaurantForm isAdmin onChange={setRestaurants} />
        <VisitorCategoryForm onChange={setVisitorData} />
        <Box w={"full"}>
          <Button w={"full"} colorScheme="blue" onClick={handleSubmit}>
            Buat Paket Tour
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default TourPackagePage;
