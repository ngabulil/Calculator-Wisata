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
  textAlign: "center",
  padding: "2px 40px 12px 10px",
  verticalAlign: "top", 
};

const tableCellStyle = {
  padding: "2px 20px 12px 10px",
  verticalAlign: "top",
};

const narrowColumnStyle = {
  ...tableCellStyle,
  width: "60px",
};

const wideColumnStyle = {
  ...tableCellStyle,
  minWidth: "200px",
};

const tableTotalStyle = {
  backgroundColor: yellow,
  fontWeight: "bold",
  padding: "2px 40px 12px 10px",
  verticalAlign: "top",
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
  selling,
  formatCurrency,
  markup
}) => {
  const sortByDay = (data) => {
    return [...data].sort((a, b) => {
      const dayA = parseInt(a.day.replace(/\D/g, '')) || 0;
      const dayB = parseInt(b.day.replace(/\D/g, '')) || 0;
      return dayA - dayB;
    });
  };

  // Sort the data before rendering
  const sortedHotelData = sortByDay(hotelData);
  const sortedTransportData = sortByDay(transportData);
  const sortedAdditionalData = sortByDay(additionalData);

  return (
    <VStack spacing={6} align="stretch">
      {/* Hotel */}
      <Box>
        <Text fontWeight="bold" mb={1} fontSize="lg" color={orangeDark}>
          Akomodasi
        </Text>
        <Divider mb={1} borderColor="white" />
        <Table variant="simple" size="sm" border="1px solid #e0e0e0">
          <Thead>
            <Tr>
              <Th style={{...tableHeaderStyle, width: "60px"}}>Day</Th>
              <Th style={{...tableHeaderStyle, minWidth: "200px"}}>Name</Th>
              <Th style={{...tableHeaderStyle, width: "60px"}}>Rooms</Th>
              <Th style={{...tableHeaderStyle, width: "100px"}}>Price/Room</Th>
              <Th style={{...tableHeaderStyle, width: "100px"}}>TOTAL</Th>
            </Tr>
          </Thead>
          <Tbody color={"#222"}>
            {sortedHotelData.map((item, index) => (
              <Tr key={index}>
                <Td style={narrowColumnStyle}>{item.day}</Td>
                <Td style={wideColumnStyle}>{item.name}</Td>
                <Td style={narrowColumnStyle}>{item.rooms}</Td>
                <Td style={{...narrowColumnStyle, textAlign: "left"}}>
                  {formatCurrency(item.pricePerNight)}
                </Td>
                <Td style={{...narrowColumnStyle, textAlign: "left"}}>
                  {formatCurrency(item.total)}
                </Td>
              </Tr>
            ))}
            <Tr>
              <Td colSpan={4} style={tableTotalStyle}>
                Total Hotel
              </Td>
              <Td style={{...tableTotalStyle, textAlign: "left"}}>
                {formatCurrency(
                  sortedHotelData.reduce((sum, i) => sum + i.total, 0)
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
              <Th style={{...tableHeaderStyle, width: "60px"}}>Day</Th>
              <Th style={{...tableHeaderStyle, minWidth: "200px"}}>Description</Th>
              <Th style={{...tableHeaderStyle, width: "100px"}}>Price</Th>
            </Tr>
          </Thead>
          <Tbody color={"#222"}>
            {sortedTransportData.map((item, index) => (
              <Tr key={index}>
                <Td style={narrowColumnStyle}>{item.day}</Td>
                <Td style={wideColumnStyle}>{item.description}</Td>
                <Td style={{...narrowColumnStyle, textAlign: "left"}}>
                  {formatCurrency(item.price)}
                </Td>
              </Tr>
            ))}
            <Tr>
              <Td colSpan={2} style={tableTotalStyle}>
                Total Transport
              </Td>
              <Td style={{...tableTotalStyle, textAlign: "left"}}>
                {formatCurrency(
                  sortedTransportData.reduce((sum, i) => sum + i.price, 0)
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
          {sortedAdditionalData.length > 0 && (
            <Thead>
              <Tr>
                <Th style={{...tableHeaderStyle, width: "60px"}}>Day</Th>
                <Th style={{...tableHeaderStyle, minWidth: "150px"}}>Item</Th>
                <Th style={{...tableHeaderStyle, width: "60px"}}>Qty</Th>
                <Th style={{...tableHeaderStyle, width: "100px"}}>Price</Th>
                <Th style={{...tableHeaderStyle, width: "100px"}}>Total</Th>
              </Tr>
            </Thead>
          )}
          <Tbody color="#222">
            {sortedAdditionalData.length > 0 ? (
              <>
                {sortedAdditionalData.map((item, index) => (
                  <Tr key={index}>
                    <Td style={narrowColumnStyle}>{item.day}</Td>
                    <Td style={wideColumnStyle}>{item.name}</Td>
                    <Td style={narrowColumnStyle}>{item.quantity}</Td>
                    <Td style={{...narrowColumnStyle, textAlign: "left"}}>
                      {formatCurrency(item.price)}
                    </Td>
                    <Td style={{...narrowColumnStyle, textAlign: "left"}}>
                      {formatCurrency(item.total)}
                    </Td>
                  </Tr>
                ))}
                <Tr>
                  <Td colSpan={4} style={tableTotalStyle}>
                    Total Tambahan
                  </Td>
                  <Td style={{...tableTotalStyle, textAlign: "left"}}>
                    {formatCurrency(
                      sortedAdditionalData.reduce((sum, i) => sum + i.total, 0)
                    )}
                  </Td>
                </Tr>
              </>
            ) : (
              <Tr>
                <Td colSpan={5} style={{...tableCellStyle, textAlign: "center", color: "gray.500"}}>
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
            <Text>Markup</Text>
            <Text>{formatCurrency(markup)}</Text>
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