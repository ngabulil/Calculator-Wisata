import {
  Container, Heading, VStack, Box, Button, useToast
} from "@chakra-ui/react"
import { useState } from "react"
import TourHeaderForm from "../components/TourForm/TourHeaderForm.jsx"
import RestaurantForm from "../components/TourForm/RestaurantForm.jsx"
import VisitorCategoryForm from "../components/TourForm/VisitorCategoryForm.jsx"
import PriceSummaryBox from "../components/TourForm/PriceSummaryBox.jsx"

const TourPackagePage = () => {
  const [tourInfo, setTourInfo] = useState({})
  const [restaurants, setRestaurants] = useState([])
  const [visitorData, setVisitorData] = useState({})
  const toast = useToast()

  const handleSubmit = () => {
    toast({
      title: "Paket Tour Disimpan.",
      description: "Data berhasil disubmit.",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
    console.log({ tourInfo, restaurants, visitorData })
  }

  return (
    <Container maxW="5xl" py={10}>
      <Heading mb={6}>Form Paket Tour</Heading>
      <VStack spacing={8} align="stretch">
        <TourHeaderForm onChange={setTourInfo} />
        <RestaurantForm onChange={setRestaurants} />
        <VisitorCategoryForm onChange={setVisitorData} />
        <PriceSummaryBox
          tourInfo={tourInfo}
          restaurants={restaurants}
          visitorData={visitorData}
        />
        <Box>
          <Button colorScheme="blue" onClick={handleSubmit}>Simpan Paket</Button>
        </Box>
      </VStack>
    </Container>
  )
}

export default TourPackagePage
