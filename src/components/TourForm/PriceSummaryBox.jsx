import { Box, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"

const PriceSummaryBox = ({ tourInfo, restaurants, visitorData }) => {
  const [basePrice, setBasePrice] = useState(0)
  const [finalPrice, setFinalPrice] = useState(0)

  useEffect(() => {
    // Dummy base price per person (bisa diganti dengan data dinamis dari JSON)
    const pricePerAdult = 300000 // Rp
    const pricePerChild = 150000 // Rp

    const adult = visitorData.adult ?? 0
    const child = visitorData.child ?? 0

    const markupType = visitorData.markupType ?? "percent"
    const markupValue = visitorData.markupValue ?? 0

    const base = (pricePerAdult * adult) + (pricePerChild * child)
    let final = base

    if (markupType === "percent") {
      final = base + (base * markupValue / 100)
    } else if (markupType === "fixed") {
      final = base + markupValue
    }

    setBasePrice(base)
    setFinalPrice(final)
  }, [visitorData])

  return (
    <Box p={4} borderWidth="1px" borderRadius="md">
      <Text fontWeight="bold" fontSize="lg" mb={2}>💰 Total Harga</Text>
      <Text>Harga Dasar: Rp {basePrice.toLocaleString("id-ID")}</Text>
      <Text>Harga Akhir (dengan markup):</Text>
      <Text fontSize="2xl" fontWeight="bold" color="blue.500">
        Rp {finalPrice.toLocaleString("id-ID")}
      </Text>
    </Box>
  )
}

export default PriceSummaryBox
