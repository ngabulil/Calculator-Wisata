import {
  Box, Table, Thead, Tbody, Tr, Th, Td, Text, useColorModeValue, Spinner
} from "@chakra-ui/react"
import { calculateFinalPrice } from "../utils/priceCalculator"

const formatRp = (val) => {
  if (!val || isNaN(val)) return "Rp 0"
  return "Rp " + Number(val).toLocaleString("id-ID")
}

const PriceBreakdownTable = ({ hotels = [], villas = [], tours = [], extras = [] }) => {
  
  const rows = []

  hotels.forEach(h => {
    const base = h.basePrice * (h.nights || 1)
    const final = h.totalPrice ?? calculateFinalPrice(base, h.markupType, h.markupValue)
    rows.push({
      type: "Hotel",
      name: h.hotelName || h.label,
      base,
      markup: h.markupType === "percent" ? `${h.markupValue}%` : formatRp(h.markupValue),
      final,
    })
  })

  villas.forEach(v => {
    const base = v.basePrice * (v.nights || 1)
    const final = v.totalPrice ?? calculateFinalPrice(base, v.markupType, v.markupValue)
    rows.push({
      type: "Villa",
      name: v.villaName || v.label,
      base,
      markup: v.markupType === "percent" ? `${v.markupValue}%` : formatRp(v.markupValue),
      final,
    })
  })

  tours.forEach(t => {
    const final = t.finalPrice ?? calculateFinalPrice(t.basePrice, t.markupType, t.markupValue)
    rows.push({
      type: "Tour",
      name: t.tourName,
      base: t.basePrice,
      markup: t.markupType === "percent" ? `${t.markupValue}%` : formatRp(t.markupValue),
      final,
    })
  })

  extras.forEach(e => {
    const final = e.finalPrice ?? calculateFinalPrice(e.basePrice, e.markupType, e.markupValue)
    rows.push({
      type: "Extra",
      name: e.label,
      base: e.basePrice,
      markup: e.markupType === "percent" ? `${e.markupValue}%` : formatRp(e.markupValue),
      final,
    })
  })

  const totalFinal = rows.reduce((acc, item) => acc + (item.final || 0), 0)

  const tableBg = useColorModeValue("gray.50", "gray.700")
  const headerBg = useColorModeValue("gray.100", "gray.600")
  const borderColor = useColorModeValue("gray.200", "gray.500")

  return (
    <Box mt={8} borderWidth="1px" borderRadius="lg" overflowX="auto" borderColor={borderColor}>
      <Box p={4} bg={tableBg} borderBottomWidth="1px" borderColor={borderColor}>
        <Text fontSize="xl" fontWeight="bold">Rincian Harga</Text>
      </Box>
      <Table variant="simple" size="sm">
        <Thead bg={headerBg}>
          <Tr>
            <Th>Jenis</Th>
            <Th>Nama</Th>
            <Th isNumeric>Harga Modal</Th>
            <Th isNumeric>Markup</Th>
            <Th isNumeric>Harga Jual</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((item, idx) => (
            <Tr key={idx}>
              <Td>{item.type}</Td>
              <Td>{item.name}</Td>
              <Td isNumeric>{formatRp(item.base)}</Td>
              <Td isNumeric>{item.markup}</Td>
              <Td isNumeric fontWeight="semibold">{formatRp(item.final)}</Td>
            </Tr>
          ))}
          <Tr bg={useColorModeValue("gray.100", "gray.600")}>
            <Td colSpan={4} textAlign="right" fontWeight="bold">Total</Td>
            <Td isNumeric fontWeight="extrabold" color="blue.400">
              {formatRp(totalFinal)}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  )
}

export default PriceBreakdownTable
