import {
  Box, Button, FormLabel, HStack, Input, NumberInput, NumberInputField,
  Select, Text, VStack, IconButton, useColorModeValue
} from "@chakra-ui/react"
import { useState, useContext } from "react"
import { DeleteIcon } from "@chakra-ui/icons"
import { CalculatorContext } from "../context/CalculatorContext"

const AdditionalCostForm = ({ onChange }) => {
  const [items, setItems] = useState([])
  const [input, setInput] = useState({
    label: "",
    basePrice: 0,
    markupType: "percent",
    markupValue: 0,
  })

  const { addExtra, removeExtra } = useContext(CalculatorContext)

  const calculateFinalPrice = ({ basePrice, markupType, markupValue }) => {
    const markup = markupType === "percent" ? (basePrice * markupValue) / 100 : markupValue
    return basePrice + markup
  }

  const handleAdd = () => {
    if (!input.label || input.basePrice <= 0) return

    const newItem = {
      ...input,
      finalPrice: calculateFinalPrice(input),
    }

    const updated = [...items, newItem]
    setItems(updated)
    addExtra(newItem) 
    setInput({ label: "", basePrice: 0, markupType: "percent", markupValue: 0 })
    onChange?.(updated)
  }

  const handleDelete = (index) => {
    const updated = items.filter((_, i) => i !== index)
    setItems(updated)
    removeExtra(index) 
    onChange?.(updated)
  }

  const boxBg = useColorModeValue("white", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.600")
  const listBg = useColorModeValue("gray.50", "gray.700")

  return (
    <Box p={4} borderWidth="1px" borderColor={borderColor} rounded="xl" shadow="md" mt={6} bg={boxBg}>
      <Text fontSize="xl" mb={2} fontWeight="bold">Tambahan Biaya (Opsional)</Text>

      <VStack spacing={4} align="stretch">
        <Box>
          <FormLabel>Nama Item</FormLabel>
          <Input
            placeholder="Contoh: Tiket Tari, Dekorasi"
            value={input.label}
            onChange={(e) => setInput({ ...input, label: e.target.value })}
          />
        </Box>

        <Box>
          <FormLabel>Harga Modal</FormLabel>
          <NumberInput min={0} value={input.basePrice} onChange={(_, val) => setInput({ ...input, basePrice: val || 0 })}>
            <NumberInputField />
          </NumberInput>
        </Box>

        <Box>
          <FormLabel>Markup</FormLabel>
          <HStack>
            <Select w="40%" value={input.markupType} onChange={(e) => setInput({ ...input, markupType: e.target.value })}>
              <option value="percent">%</option>
              <option value="fixed">Rp</option>
            </Select>
            <NumberInput min={0} value={input.markupValue} onChange={(_, val) => setInput({ ...input, markupValue: val || 0 })}>
              <NumberInputField />
            </NumberInput>
          </HStack>
        </Box>

        <Button colorScheme="teal" onClick={handleAdd}>Tambah Item</Button>

        {items.length > 0 && (
          <Box pt={4}>
            <Text fontWeight="semibold" mb={2}>🧾 Daftar Tambahan:</Text>
            {items.map((item, idx) => (
              <HStack
                key={idx}
                justify="space-between"
                borderWidth="1px"
                borderRadius="lg"
                borderColor={borderColor}
                bg={listBg}
                px={4}
                py={2}
                _hover={{ shadow: "md" }}
              >
                <Box>
                  <Text fontWeight="medium">{item.label}</Text>
                  <Text fontSize="sm" color="gray.500">
                    Modal: Rp {item.basePrice.toLocaleString("id-ID")} | Markup: {item.markupType === "percent" ? `${item.markupValue}%` : `Rp ${item.markupValue.toLocaleString("id-ID")}`} | <strong>Jual: Rp {item.finalPrice.toLocaleString("id-ID")}</strong>
                  </Text>
                </Box>
                <IconButton
                  icon={<DeleteIcon />}
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => handleDelete(idx)}
                  aria-label="Hapus"
                />
              </HStack>
            ))}
          </Box>
        )}
      </VStack>
    </Box>
  )
}

export default AdditionalCostForm
