import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  VStack,
} from "@chakra-ui/react";
import formatRupiah from "../../utils/rupiahFormat";

const orange = "#FB8C00";
const gray = "#F5F5F5";

const tableHeaderStyle = {
  backgroundColor: orange,
  color: "#222",
  fontWeight: "bold",
  fontSize: "1rem",
  textAlign: "center",
  padding: "2px 40px 12px 40px",
};

const tableCellStyle = {
  padding: "2px 40px 12px 40px",
  verticalAlign: "top",
};

const tablePriceStyle = {
  padding: "2px 20px 12px 40px",
  verticalAlign: "top",
};



const HotelChoiceTable = ({ akomodasiDays }) => {
  const accommodations = [];
  akomodasiDays?.forEach((day, dayIndex) => { 
    if (day.hotels) {
      day.hotels.forEach(hotel => {
        const hotelName = hotel.displayName || hotel.name || hotel.hotel?.label || "Unknown Hotel";
        const stars = hotel.bintang || hotel.star || "";
        
        accommodations.push({
          no: dayIndex + 1,
          name: hotelName,
          stars: stars,
          type: "Hotel",
          price: hotel.hargaPerKamar
        });
      });
    }
    
    if (day.villas && day.villas.length > 0) {
      day.villas.forEach(villa => {
        const villaName = villa.displayName || villa.name || villa.villaName || "Unknown Villa";
        const stars = villa.bintang || villa.star_rating || villa.star;
        
        accommodations.push({
          no: dayIndex + 1,
          name: villaName,
          stars: stars,
          type: "Villa",
          price: villa.hargaPerKamar || 0
        });
      });
    }
  });

  return (
    <Box mb={8}>
      <Table variant="simple" size="sm" border="1px solid #ddd">
        <Thead>
          <Tr>
            <Th style={tableHeaderStyle} border="1px solid #ddd" width="60px">
              HARI
            </Th>
            <Th style={tableHeaderStyle} border="1px solid #ddd">
              <VStack spacing={0}>
                <Text>PILIHAN AKOMODASI</Text> 
                <Text fontSize="sm" fontStyle="italic">(3 Malam Akomodasi)</Text> 
              </VStack>
            </Th>
            <Th style={tableHeaderStyle} border="1px solid #ddd" width="200px">
              <VStack spacing={0}>
                <Text>HARGA PER MALAM</Text>

              </VStack>
            </Th>
          </Tr>
        </Thead>
        <Tbody color={"#222"}>
          {accommodations.length > 0 ? (
            accommodations.map((accommodation, index) => (
              <Tr key={index} _hover={{ background: gray }}>
                <Td style={tableCellStyle} fontWeight="bold">
                  Day {accommodation.no}
                </Td>
                <Td style={tableCellStyle}
                >
                  <VStack align="center" spacing={1} width="100%">
                    <Text fontWeight="bold" fontSize="md" textAlign="center" width="100%">
                      {accommodation.name.toUpperCase()} ({accommodation.stars}*)
                    </Text>
                  </VStack>
                </Td>
                <Td style={tablePriceStyle}>
                  <Text 
                    fontWeight="bold" 
                    fontSize="lg" 
                    textAlign="center" 
                    width="100%"
                    padding="4px 8px"
                    borderRadius="4px"
                  >
                    {formatRupiah(accommodation.price)}/Malam
                  </Text>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={3} textAlign="center" py={4} border="1px solid #ddd">
                <Text color="gray.500" textAlign="center">Tidak ada data akomodasi tersedia</Text>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default HotelChoiceTable;