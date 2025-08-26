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
  Input
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
  markup,
  totalAdult = 1,
  totalChild = 0,
  exchangeRate,
  isEditingExchangeRate = false,
  sellingChild,
  onExchangeRateChange = () => {},
}) => {
  const sortByDay = (data) => {
    return [...data].sort((a, b) => {
      const dayA = parseInt(a.day.replace(/\D/g, "")) || 0;
      const dayB = parseInt(b.day.replace(/\D/g, "")) || 0;
      return dayA - dayB;
    });
  };

  const sortedHotelData = sortByDay(hotelData);
  const sortedTransportData = sortByDay(transportData);
  const sortedAdditionalData = sortByDay(additionalData);

  const hotelTotal = sortedHotelData.reduce((sum, i) => sum + i.total, 0);
  const transportTotal = sortedTransportData.reduce(
    (sum, i) => sum + i.price,
    0
  );
  const additionalTotal = sortedAdditionalData.reduce(
    (sum, i) => sum + i.total,
    0
  );

  const hotelPerAdult = totalAdult > 0 ? hotelTotal / totalAdult : 0;
  const transportPerAdult = totalAdult > 0 ? transportTotal / totalAdult : 0;
  const additionalPerAdult = totalAdult > 0 ? additionalTotal / totalAdult : 0;

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
              <Th style={{ ...tableHeaderStyle, width: "60px" }}>Day</Th>
              <Th style={{ ...tableHeaderStyle, minWidth: "200px" }}>Name</Th>
              <Th style={{ ...tableHeaderStyle, width: "60px" }}>Rooms</Th>
              <Th style={{ ...tableHeaderStyle, width: "100px" }}>
                Price/Room
              </Th>
              <Th style={{ ...tableHeaderStyle, width: "100px" }}>TOTAL</Th>
            </Tr>
          </Thead>
          <Tbody color={"#222"}>
            {sortedHotelData.map((item, index) => (
              <Tr key={index}>
                <Td style={narrowColumnStyle}>{item.day}</Td>
                <Td style={wideColumnStyle}>{item.name}</Td>
                <Td style={narrowColumnStyle}>{item.rooms}</Td>
                <Td style={{ ...narrowColumnStyle, textAlign: "left" }}>
                  {formatCurrency(item.pricePerNight)}
                </Td>
                <Td style={{ ...narrowColumnStyle, textAlign: "left" }}>
                  {formatCurrency(item.total)}
                </Td>
              </Tr>
            ))}
            <Tr>
              <Td colSpan={4} style={tableTotalStyle}>
                Total Hotel
              </Td>
              <Td style={{ ...tableTotalStyle, textAlign: "left" }}>
                {formatCurrency(hotelTotal)}
              </Td>
            </Tr>
            <Tr>
              <Td
                colSpan={4}
                style={{ ...tableTotalStyle, textAlign: "right" }}
              >
                Grand Total
              </Td>
              <Td style={{ ...tableTotalStyle, textAlign: "left" }}>
                {formatCurrency(hotelPerAdult)}
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
              <Th style={{ ...tableHeaderStyle, width: "60px" }}>Day</Th>
              <Th style={{ ...tableHeaderStyle, minWidth: "200px" }}>
                Description
              </Th>
              <Th style={{ ...tableHeaderStyle, width: "100px" }}>Price</Th>
            </Tr>
          </Thead>
          <Tbody color={"#222"}>
            {sortedTransportData.map((item, index) => (
              <Tr key={index}>
                <Td style={narrowColumnStyle}>{item.day}</Td>
                <Td style={wideColumnStyle}>{item.description}</Td>
                <Td style={{ ...narrowColumnStyle, textAlign: "left" }}>
                  {formatCurrency(item.price)}
                </Td>
              </Tr>
            ))}
            <Tr>
              <Td colSpan={2} style={tableTotalStyle}>
                Total Transport
              </Td>
              <Td style={{ ...tableTotalStyle, textAlign: "left" }}>
                {formatCurrency(transportTotal)}
              </Td>
            </Tr>
            <Tr>
              <Td
                colSpan={2}
                style={{ ...tableTotalStyle, textAlign: "right" }}
              >
                Grand Total
              </Td>
              <Td style={{ ...tableTotalStyle, textAlign: "left" }}>
                {formatCurrency(transportPerAdult)}
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
                <Th style={{ ...tableHeaderStyle, width: "60px" }}>Day</Th>
                <Th style={{ ...tableHeaderStyle, minWidth: "150px" }}>Item</Th>
                <Th style={{ ...tableHeaderStyle, width: "60px" }}>Qty</Th>
                <Th style={{ ...tableHeaderStyle, width: "100px" }}>Price</Th>
                <Th style={{ ...tableHeaderStyle, width: "100px" }}>Total</Th>
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
                    <Td style={{ ...narrowColumnStyle, textAlign: "left" }}>
                      {formatCurrency(item.price)}
                    </Td>
                    <Td style={{ ...narrowColumnStyle, textAlign: "left" }}>
                      {formatCurrency(item.total)}
                    </Td>
                  </Tr>
                ))}
                <Tr>
                  <Td colSpan={4} style={tableTotalStyle}>
                    Total Tambahan
                  </Td>
                  <Td style={{ ...tableTotalStyle, textAlign: "left" }}>
                    {formatCurrency(additionalTotal)}
                  </Td>
                </Tr>
                <Tr>
                  <Td
                    colSpan={4}
                    style={{ ...tableTotalStyle, textAlign: "right" }}
                  >
                    Grand Total
                  </Td>
                  <Td style={{ ...tableTotalStyle, textAlign: "left" }}>
                    {formatCurrency(additionalPerAdult)}
                  </Td>
                </Tr>
              </>
            ) : (
              <>
                <Tr>
                  <Td
                    colSpan={5}
                    style={{
                      ...tableCellStyle,
                      textAlign: "center",
                      color: "gray.500",
                    }}
                  >
                    Tidak ada tambahan
                  </Td>
                </Tr>
              </>
            )}
          </Tbody>
        </Table>
      </Box>

      {/* Grand Total */}
      <Box p={4} borderRadius="md" style={tableGrandTotalStyle}>
        <VStack spacing={2}>
          <HStack justify="space-between" w="100%">
            <Text>TOTAL</Text>
            <Text>{formatCurrency(grandTotal)}</Text>
          </HStack>
          <HStack justify="space-between" w="100%" fontSize="lg">
            <Text>Markup</Text>
            <Text>{formatCurrency(markup)}</Text>
          </HStack>
          <HStack justify="space-between" w="100%">
            <Text fontWeight="bold">Price Pax Adult</Text>
            <Text>{formatCurrency(selling)}</Text>
          </HStack>
         {totalChild > 0 && (
            <HStack justify="space-between" w="100%">
              <Text>Price Pax Child</Text>
              <Text>{formatCurrency(sellingChild)}</Text>
            </HStack>
          )}
          <HStack justify="space-between" w="100%">
            <Text>Exchange Rate</Text>
            {isEditingExchangeRate ? (
              <Input
                type="number"
                value={exchangeRate}
                onChange={(e) => {
                  const value = e.target.value;
                  onExchangeRateChange(value === "" ? "" : Number(value));
                }}
                style={{
                  width: "100px",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  textAlign: "right",
                }}
              />
            ) : (
              <Text fontWeight="bold">{formatCurrency(exchangeRate)}</Text>
            )}
          </HStack>
        </VStack>
      </Box>
    </VStack>
  );
};

export default CostBreakDown;