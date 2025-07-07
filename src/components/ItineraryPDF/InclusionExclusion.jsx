import {
  Box,
  Table,
  Tbody,
  Tr,
  Td,
  Text,
  VStack,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";

const orange = "#FFA726";

const tableHeaderStyle = {
  backgroundColor: orange,
  color: "#222",
  fontWeight: "bold",
  fontSize: "1rem",
};

const InclusionExclusionTable = () => {
  return (
    <>
      <Box
        mb={6}
        borderRadius="md"
        overflow="hidden"
        border="1px solid #e0e0e0"
        color={"#222"}
      >
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
              <Td p={4} verticalAlign="top">
                <UnorderedList spacing={1} fontSize="sm">
                  <ListItem>
                    Stay for 3 Nights at 4 stars Hotel in Kuta Area
                  </ListItem>
                  <ListItem>
                    All entrance fees, meals, and activities as mention in
                    program
                  </ListItem>
                  <ListItem>
                    Welcome flower in Ngurah Rai International
                  </ListItem>
                  <ListItem>
                    Transport: 6 Seaters car (use maximum 10-12 hours day)
                  </ListItem>
                  <ListItem>Private experience driver</ListItem>
                </UnorderedList>
              </Td>
              <Td p={4} verticalAlign="top">
                <Text fontSize="sm" fontWeight="semibold" mb={2}>
                  Suggest Estimation Time :
                </Text>
                <UnorderedList spacing={1} fontSize="sm">
                  <ListItem>Arrival in Bali around 12 Pm (afternoon)</ListItem>
                  <ListItem>Departure Time From Bali Anytime</ListItem>
                </UnorderedList>
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
              <Td p={4} verticalAlign="top">
                <UnorderedList spacing={1} fontSize="sm">
                  <ListItem>Flight tickets</ListItem>
                  <ListItem>
                    Shopping, Laundry, Medicine, And any others
                  </ListItem>
                  <ListItem>Tipping for Driver ( RM 10 Pax/Day)</ListItem>
                </UnorderedList>
              </Td>
              <Td p={4} verticalAlign="top">
                <Text fontSize="sm" fontWeight="semibold" mb={2}>
                  PRICE PROMO VALID FOR PERIOD:
                </Text>
                <Text fontSize="sm">• Promo Valid Until June 2025</Text>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>

      <Box
        mb={6}
        borderRadius="md"
        overflow="hidden"
        border="1px solid #e0e0e0"
        color={"#222"}
      >
        <Table variant="simple" size="sm">
          <Tbody>
            <Tr>
              <Td style={tableHeaderStyle} textAlign="center">
                <Text fontWeight="bold">OTHER PROVISIONS</Text>
              </Td>
            </Tr>
            <Tr>
              <Td p={4} textAlign="center">
                <VStack spacing={2} fontSize="sm">
                  <Text>
                    We at Bali Sundaram Travel are not responsible for delays or
                    cancellations
                  </Text>
                  <Text>
                    Flight Schedules for both Arrivals and Departures so that
                    you can change the Package Schedule
                  </Text>
                  <Text>Tour that has been programmed.</Text>
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