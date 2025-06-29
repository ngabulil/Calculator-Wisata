import {
  Box, Button, FormLabel, HStack, NumberInput, NumberInputField,
  Select, Text, VStack, IconButton, useColorModeValue
} from "@chakra-ui/react"
import { useState, useEffect, useContext } from "react"
import { DeleteIcon } from "@chakra-ui/icons"
import tourData from "../data/tours.json"
import { calculateFinalPrice } from "../utils/priceCalculator"
import { CalculatorProvider, CalculatorContext } from "../context/CalculatorContext"


const TourSelector = ({ onChange }) => {
  const [items, setItems] = useState([])
  const [input, setInput] = useState({
    tourName: "",
    category: "domestic",
    adult: 2,
    child: 0,
    markupType: "percent",
    markupValue: 0,
  })

  const { addTour, removeTour } = useContext(CalculatorContext)

  const selectedTour = tourData.find(t => t.name === input.tourName)
  const adultPrice = selectedTour?.[input.category]?.adult ?? 0
  const childPrice = selectedTour?.[input.category]?.child ?? 0
  const basePrice = (adultPrice * input.adult) + (childPrice * input.child)
  const finalPrice = calculateFinalPrice(basePrice, input.markupType, input.markupValue)

  const bg = useColorModeValue("white", "gray.700")
  const border = useColorModeValue("gray.200", "gray.600")
  const textMuted = useColorModeValue("gray.600", "gray.400")
  const rowBg = useColorModeValue("gray.100", "gray.800")

  const handleAdd = () => {
    if (!input.tourName || (input.adult + input.child <= 0)) return

    const newItem = {
      ...input,
      basePrice,
      finalPrice,
    }

    const updated = [...items, newItem]
    setItems(updated)
    addTour(newItem)
    setInput({
      tourName: "",
      category: "domestic",
      adult: 2,
      child: 0,
      markupType: "percent",
      markupValue: 0,
    })
  }

  const handleDelete = (index) => {
    const updated = items.filter((_, i) => i !== index)
    setItems(updated)
    removeTour(index)
  }

  useEffect(() => {
    onChange?.(items)
  }, [items, onChange])

  return (
    <Box p={6} borderWidth="1px" borderRadius="lg" shadow="md" bg={bg} borderColor={border} mt={6}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>🗺️ Paket Tour</Text>

      <VStack spacing={4} align="stretch">
        <Box>
          <FormLabel>Nama Paket</FormLabel>
          <Select
            placeholder="Pilih paket"
            value={input.tourName}
            onChange={(e) => setInput({ ...input, tourName: e.target.value })}
          >
            {tourData.map((t, idx) => (
              <option key={idx} value={t.name}>{t.name}</option>
            ))}
          </Select>
        </Box>

        <Box>
          <FormLabel>Kategori Wisatawan</FormLabel>
          <Select
            value={input.category}
            onChange={(e) => setInput({ ...input, category: e.target.value })}
          >
            <option value="domestic">Domestik</option>
            <option value="foreign">Mancanegara</option>
          </Select>
        </Box>

        <HStack spacing={4}>
          <Box>
            <FormLabel>Dewasa</FormLabel>
            <NumberInput
              min={0}
              value={input.adult}
              onChange={(_, val) => setInput({ ...input, adult: isNaN(val) ? 0 : val })}
            >
              <NumberInputField />
            </NumberInput>
          </Box>
          <Box>
            <FormLabel>Anak</FormLabel>
            <NumberInput
              min={0}
              value={input.child}
              onChange={(_, val) => setInput({ ...input, child: isNaN(val) ? 0 : val })}
            >
              <NumberInputField />
            </NumberInput>
          </Box>
        </HStack>

        <Box>
          <FormLabel>Markup</FormLabel>
          <HStack spacing={3}>
            <Select
              w="40%"
              value={input.markupType}
              onChange={(e) => setInput({ ...input, markupType: e.target.value })}
            >
              <option value="percent">%</option>
              <option value="fixed">Rp</option>
            </Select>
            <NumberInput
              min={0}
              value={input.markupValue}
              onChange={(_, val) => setInput({ ...input, markupValue: isNaN(val) ? 0 : val })}
            >
              <NumberInputField />
            </NumberInput>
          </HStack>
        </Box>

        <Box>
          <Text fontWeight="semibold">Total Harga:</Text>
          <Text fontSize="lg" fontWeight="bold">Rp {finalPrice.toLocaleString("id-ID")}</Text>
        </Box>

        <Button colorScheme="blue" onClick={handleAdd}>Tambah Paket</Button>

        {items.length > 0 && (
          <Box pt={4}>
            <Text fontWeight="semibold" mb={2}>Daftar Paket:</Text>
            {items.map((item, idx) => {
              const found = tourData.find(t => t.name === item.tourName)
              const pricePerAdult = found?.[item.category]?.adult ?? 0
              const pricePerChild = found?.[item.category]?.child ?? 0

              return (
                <Box key={idx} p={3} rounded="md" bg={rowBg} mb={2}>
                  <HStack justify="space-between">
                    <Box>
                      <Text fontWeight="medium">{item.tourName} ({item.category})</Text>
                      <Text fontSize="sm" color={textMuted}>
                        {item.adult} dewasa x Rp {pricePerAdult.toLocaleString("id-ID")}<br />
                        {item.child} anak x Rp {pricePerChild.toLocaleString("id-ID")}<br />
                        Markup: {item.markupType === "percent"
                          ? `${item.markupValue}%`
                          : `Rp ${item.markupValue.toLocaleString("id-ID")}`}<br />
                        <strong>Total: Rp {item.finalPrice.toLocaleString("id-ID")}</strong>
                      </Text>
                    </Box>
                    <IconButton
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      aria-label="hapus"
                      onClick={() => handleDelete(idx)}
                    />
                  </HStack>
                </Box>
              )
            })}
          </Box>
        )}
      </VStack>
    </Box>
  )
}

export default TourSelector
