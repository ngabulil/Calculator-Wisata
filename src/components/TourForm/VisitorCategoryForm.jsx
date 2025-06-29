import {
  Box, FormLabel, HStack, NumberInput, NumberInputField,
  Select, Text, VStack
} from "@chakra-ui/react"
import { useEffect, useState } from "react"

const VisitorCategoryForm = ({ onChange }) => {
  const [adult, setAdult] = useState(2)
  const [child, setChild] = useState(0)
  const [markupType, setMarkupType] = useState("percent")
  const [markupValue, setMarkupValue] = useState(0)

  useEffect(() => {
    onChange?.({
      adult,
      child,
      markupType,
      markupValue
    })
  }, [adult, child, markupType, markupValue, onChange])

  return (
    <Box>
      <Text fontWeight="bold" fontSize="lg" mb={2}>👥 Kategori Wisatawan & Markup</Text>
      <VStack align="stretch" spacing={4}>
        <HStack spacing={6}>
          <Box>
            <FormLabel>Dewasa</FormLabel>
            <NumberInput
              min={0}
              value={adult}
              onChange={(_, val) => setAdult(isNaN(val) ? 0 : val)}
            >
              <NumberInputField />
            </NumberInput>
          </Box>
          <Box>
            <FormLabel>Anak</FormLabel>
            <NumberInput
              min={0}
              value={child}
              onChange={(_, val) => setChild(isNaN(val) ? 0 : val)}
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
              value={markupType}
              onChange={(e) => setMarkupType(e.target.value)}
            >
              <option value="percent">%</option>
              <option value="fixed">Rp</option>
            </Select>
            <NumberInput
              min={0}
              value={markupValue}
              onChange={(_, val) => setMarkupValue(isNaN(val) ? 0 : val)}
            >
              <NumberInputField />
            </NumberInput>
          </HStack>
        </Box>
      </VStack>
    </Box>
  )
}

export default VisitorCategoryForm
