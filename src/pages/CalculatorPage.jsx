import {
  Box,
  Container,
  Heading,
  VStack,
  useToast,
  useColorModeValue
} from "@chakra-ui/react"
import { CalculatorProvider } from "../context/CalculatorContext"
import useCalculator from "../hooks/useCalculator"
import AccommodationSelector from "../components/AccommodationSelector"
import TourSelector from "../components/TourSelector"
import AdditionalCostForm from "../components/AdditionalCostForm"
import PriceBreakdownTable from "../components/PriceBreakdownTable"
import SubmitBar from "../components/SubmitBar"

const CalculatorContent = () => {
  const {
    hotels, villas, tours, extras,
    updateHotels, updateVillas,
    addTour, removeTour,
    addExtra, removeExtra,
    resetAll, totalPrice
  } = useCalculator()

  const toast = useToast()

  const handleSubmit = () => {
    toast({
      title: "Data disimpan.",
      description: "Simulasi berhasil dihitung.",
      status: "success",
      duration: 3000,
      isClosable: true
    })
    console.log({
      hotels, villas, tours, extras, total: totalPrice
    })

  }

  const bg = useColorModeValue("white", "gray.800")

  return (
    <>
      <Container maxW="5xl" py={10} bg="gray.900" color="gray.100" minH="100vh">
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
            <Button colorScheme="blue" onClick={handleSubmit}>
              Simpan Paket
            </Button>
          </Box>
        </VStack>
      </Container>

      <SubmitBar
        total={totalPrice}
        onSubmit={handleSubmit}
        onReset={resetAll}
      />
    </>
  )
}

const CalculatorPage = () => (
  <CalculatorProvider>
    <CalculatorContent />
  </CalculatorProvider>
)

export default CalculatorPage
