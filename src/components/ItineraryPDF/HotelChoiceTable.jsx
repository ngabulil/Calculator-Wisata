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

const orange = "#FFA726";
const gray = "#F5F5F5";

const tableHeaderStyle = {
  backgroundColor: orange,
  color: "#222",
  fontWeight: "bold",
  fontSize: "1rem",
};

const HotelChoiceTable = ({ akomodasiDays }) => {
  const accommodations = [];
  let counter = 1;

  akomodasiDays?.forEach((day) => {
    if (day.hotels) {
      day.hotels.forEach(hotel => {
        accommodations.push({
          no: counter++,
          name: hotel.hotel?.label || "Unknown Hotel",
          room: hotel.roomType && hotel.roomType.length > 0 ? hotel.roomType[0].label : "Superior Room",
          type: "Hotel"
        });
      });
    }
    
    if (day.villas) {
      day.villas.forEach(villa => {
        accommodations.push({
          no: counter++,
          name: villa.villa?.label || "Unknown Villa",
          room: villa.roomType && villa.roomType.length > 0 ? villa.roomType[0].label : "Superior Room",
          type: "Villa"
        });
      });
    }
  });

  return (
    <Box
      mb={8}
    >
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th textAlign="center" width="60px" style={tableHeaderStyle}>
              NO
            </Th>
            <Th style={tableHeaderStyle}>
              <VStack spacing={0}>
                <Text textAlign="center" width="100%">ACCOMMODATION CHOICE</Text>
                <Text textAlign="center" fontSize="sm" width="100%">(Hotels & Villas)</Text>
              </VStack>
            </Th>
            <Th textAlign="center" width="200px" style={tableHeaderStyle}>
              <VStack spacing={0}>
                <Text textAlign="center" width="100%">ROOM TYPE</Text>
              </VStack>
            </Th>
          </Tr>
        </Thead>
        <Tbody color={"#222"}>
          {accommodations.length > 0 ? (
            accommodations.map((accommodation, index) => (
              <Tr key={index} _hover={{ background: gray }}>
                <Td textAlign="center">{accommodation.no}</Td>
                <Td textAlign="center">
                  <VStack align="center" spacing={0} width="100%">
                    <Text fontWeight="semibold" textAlign="center" width="100%">
                      {accommodation.name}
                      {accommodation.type === "Villa" && (
                        <Text as="span" fontSize="xs" color="blue.600" ml={2}>
                          (Villa)
                        </Text>
                      )}
                    </Text>
                  </VStack>
                </Td>
                <Td textAlign="center">
                  <Text fontWeight="bold" fontSize="md" textAlign="center" width="100%">
                    {accommodation.room}
                  </Text>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={3} textAlign="center" py={4}>
                <Text color="gray.500" textAlign="center">No accommodation data available</Text>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default HotelChoiceTable;