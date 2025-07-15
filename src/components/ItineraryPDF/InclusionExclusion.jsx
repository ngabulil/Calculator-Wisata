import {
  Box,
  Table,
  Tbody,
  Tr,
  Td,
  Text,
  VStack,
} from "@chakra-ui/react";

const orange = "#FB8C00";

const tableHeaderStyle = {
  backgroundColor: orange,
  color: "#222",
  fontWeight: "bold",
  fontSize: "1rem",
  padding: "8px",
  verticalAlign: "top",
};

const tableCellStyle = {
  padding: "8px",
  verticalAlign: "top",
};

const InclusionExclusionTable = () => {
  return (
    <>
      <Box mb={6} borderRadius="md" overflow="hidden" color={"#222"}>
        <Table variant="simple" size="sm">
          <Tbody>
            <Tr>
              <Td width="50%" style={tableHeaderStyle} textAlign="center">
                <Text fontWeight="bold">INCLUSION</Text>
              </Td>
              <Td width="50%" style={tableHeaderStyle} textAlign="center">
                <Text fontWeight="bold">Estimation Time</Text>
              </Td>
            </Tr>
            <Tr>
              <Td style={tableCellStyle}>
                <Text fontSize="sm">• Stay for 3 Nights at 4 stars Hotel in Kuta Area</Text>
                <Text fontSize="sm">• All entrance fees, meals, and activities as mention in program</Text>
                <Text fontSize="sm">• Welcome flower in Ngurah Rai International</Text>
                <Text fontSize="sm">• Transport: 6 Seaters car (use maximum 10-12 hours day)</Text>
                <Text fontSize="sm">• Private experience driver</Text>
              </Td>
              <Td style={tableCellStyle}>
                <Text fontSize="sm" fontWeight="semibold" mb={2}>
                  Suggest Estimation Time :
                </Text>
                <Text fontSize="sm">• Arrival in Bali around 12 Pm (afternoon)</Text>
                <Text fontSize="sm">• Departure Time From Bali Anytime</Text>
                <Text fontSize="sm" fontWeight="semibold" mt={3}>
                  * NOTE :{" "}
                  <Text as="span" color="blue.500">
                    Premium Meal
                  </Text>
                </Text>
              </Td>
            </Tr>
            <Tr>
              <Td style={tableHeaderStyle} textAlign="center">
                <Text fontWeight="bold">EXCLUSIONS:</Text>
              </Td>
              <Td style={tableHeaderStyle} textAlign="center">
                <Text fontWeight="bold">PRICE CHANGES:</Text>
              </Td>
            </Tr>
            <Tr>
              <Td style={tableCellStyle}>
                <Text fontSize="sm">• Flight tickets</Text>
                <Text fontSize="sm">• Shopping, Laundry, Medicine, And any others</Text>
                <Text fontSize="sm">• Tipping for Driver ( RM 10 Pax/Day)</Text>
              </Td>
              <Td style={tableCellStyle}>
                <Text fontSize="sm" fontWeight="semibold" mb={2}>
                  PRICE PROMO VALID FOR PERIOD:
                </Text>
                <Text fontSize="sm">• Promo Valid Until June 2025</Text>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>

      <Box mb={6} borderRadius="md" overflow="hidden" color={"#222"}>
        <Table variant="simple" size="sm">
          <Tbody>
            <Tr>
              <Td style={tableHeaderStyle} textAlign="center">
                <Text fontWeight="bold">OTHER PROVISIONS</Text>
              </Td>
            </Tr>
            <Tr>
              <Td style={tableCellStyle} textAlign="center">
                <VStack spacing={2} fontSize="sm" align="flex-start">
                  <Text>• We at Bali Sundaram Travel are not responsible for delays or cancellations</Text>
                  <Text>• Flight Schedules for both Arrivals and Departures so that you can change the Package Schedule</Text>
                  <Text>• Tour that has been programmed.</Text>
                </VStack>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </>
  );
};

export default InclusionExclusionTable;