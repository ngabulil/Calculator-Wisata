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
  HStack,
  Divider,
} from "@chakra-ui/react";

const orangeDark = "#FB8C00";
const yellow = "#FFF59D";

const tableHeaderStyle = {
  backgroundColor: orangeDark,
  color: "#222",
  fontWeight: "bold",
  fontSize: "1rem",
};

const tableTotalStyle = {
  backgroundColor: yellow,
  fontWeight: "bold",
};

const tableGrandTotalStyle = {
  backgroundColor: orangeDark,
  color: "black",
  fontWeight: "bold",
  fontSize: "1.2rem",
};

const CostBreakDown = ({
  hotelData,
  transportData,
  additionalData,
  grandTotal,
  perPax,
  selling,
  formatCurrency,
}) => {
  return (
    <VStack spacing={6} align="stretch">
      {/* Hotel */}
      <Box>
        <Text fontWeight="bold" mb={1} fontSize="lg" color={orangeDark}>
          <Akomodasi></Akomodasi>
        </Text>
        <Divider mb={1} borderColor="white" />
        <Table variant="simple" size="sm" border="1px solid #e0e0e0">
          <Thead>
            <Tr>
              <Th style={tableHeaderStyle}>Day</Th>
              <Th style={tableHeaderStyle}>Name</Th>
              <Th style={tableHeaderStyle}>Rooms</Th>
              <Th style={tableHeaderStyle}>Price/Room</Th>
              <Th style={tableHeaderStyle}>TOTAL</Th>
            </Tr>
          </Thead>
          <Tbody color={"#222"}>
            {hotelData.map((item, index) => (
              <Tr key={index}>
                <Td>{item.day}</Td>
                <Td>{item.name}</Td>
                <Td>{item.rooms}</Td>
                <Td>{formatCurrency(item.pricePerNight)}</Td>
                <Td>{formatCurrency(item.total)}</Td>
              </Tr>
            ))}
            <Tr>
              <Td colSpan={4} style={tableTotalStyle}>
                Total Hotel
              </Td>
              <Td style={tableTotalStyle}>
                {formatCurrency(
                  hotelData.reduce((sum, i) => sum + i.total, 0)
                )}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>

      {/* Transport */}
      <Box>
        <Text fontWeight="bold" mb={1} fontSize="lg" color={orangeDark}>
          Transportasi
        </Text>
        <Divider mb={1} borderColor="white" />
        <Table variant="simple" size="sm" border="1px solid #e0e0e0">
          <Thead>
            <Tr>
              <Th style={tableHeaderStyle}>Day</Th>
              <Th style={tableHeaderStyle}>Description</Th>
              <Th style={{ ...tableHeaderStyle, textAlign: "right" }}>Price</Th>
            </Tr>
          </Thead>
          <Tbody color={"#222"}>
            {transportData.map((item, index) => (
              <Tr key={index}>
                <Td>{item.day}</Td>
                <Td>{item.description}</Td>
                <Td textAlign="right">{formatCurrency(item.price)}</Td>
              </Tr>
            ))}
            <Tr>
              <Td colSpan={2} style={tableTotalStyle}>
                Total Transport
              </Td>
              <Td style={tableTotalStyle} textAlign="right">
                {formatCurrency(
                  transportData.reduce((sum, i) => sum + i.price, 0)
                )}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>

      {/* Tambahan */}
      <Box>
        <Text fontWeight="bold" mb={1} fontSize="lg" color={orangeDark}>
          Tambahan (Akomodasi & Transport)
        </Text>
        <Divider mb={1} borderColor="white" />
        <Table variant="simple" size="sm" border="1px solid #e0e0e0">
          {additionalData.length > 0 && (
            <Thead>
              <Tr>
                <Th style={tableHeaderStyle}>Day</Th>
                <Th style={tableHeaderStyle}>Item</Th>
                <Th style={tableHeaderStyle}>Quantity</Th>
                <Th style={tableHeaderStyle}>Price</Th>
                <Th style={tableHeaderStyle}>Total</Th>
              </Tr>
            </Thead>
          )}
          <Tbody color="#222">
            {additionalData.length > 0 ? (
              <>
                {additionalData.map((item, index) => (
                  <Tr key={index}>
                    <Td>{item.day}</Td>
                    <Td>{item.name}</Td>
                    <Td>{item.quantity}</Td>
                    <Td>{formatCurrency(item.price)}</Td>
                    <Td>{formatCurrency(item.total)}</Td>
                  </Tr>
                ))}
                <Tr>
                  <Td colSpan={4} style={tableTotalStyle}>
                    Total Tambahan
                  </Td>
                  <Td style={tableTotalStyle}>
                    {formatCurrency(
                      additionalData.reduce((sum, i) => sum + i.total, 0)
                    )}
                  </Td>
                </Tr>
              </>
            ) : (
              <Tr>
                <Td colSpan={5} textAlign="center" color="gray.500">
                  Tidak ada tambahan
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>


      {/* Grand Total */}
      <Box p={4} borderRadius="md" style={tableGrandTotalStyle}>
        <VStack spacing={2}>
          <HStack justify="space-between" w="100%">
            <Text>GRAND TOTAL</Text>
            <Text>{formatCurrency(grandTotal)}</Text>
          </HStack>
          <HStack justify="space-between" w="100%" fontSize="lg">
            <Text>Markup per Pax</Text>
            <Text>{formatCurrency(perPax)}</Text>
          </HStack>
          <HStack justify="space-between" w="100%">
            <Text fontWeight="bold">Selling</Text>
            <Text>{formatCurrency(selling)}</Text>
          </HStack>
        </VStack>
      </Box>
    </VStack>
  );
};

export default CostBreakDown;