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
import { roundPrice } from "../../utils/roundPrice";

const orangeDark = "#FB8C00";
const yellow = "#FFF59D";

const tableHeaderStyle = {
  backgroundColor: orangeDark,
  color: "#222",
  fontWeight: "bold",
  fontSize: "1rem",
  textAlign: "center",
  padding: "8px 12px",
  verticalAlign: "middle",
  whiteSpace: "nowrap",
};

const tableCellStyle = {
  padding: "8px 12px",
  verticalAlign: "middle",
  fontSize: "0.95rem",
  lineHeight: "1.2",
};

const narrowColumnStyle = {
  ...tableCellStyle,
  width: "70px",
  textAlign: "center",
};

const mediumColumnStyle = {
  ...tableCellStyle,
  width: "120px",
  textAlign: "left",
};

const wideColumnStyle = {
  ...tableCellStyle,
  minWidth: "180px",
  maxWidth: "220px",
  textAlign: "left",
  wordWrap: "break-word",
  overflow: "hidden",
};

const tableTotalStyle = {
  backgroundColor: yellow,
  fontWeight: "bold",
  padding: "8px 12px",
  verticalAlign: "middle",
  fontSize: "0.95rem",
};

const tableGrandTotalStyle = {
  backgroundColor: orangeDark,
  color: "black",
  fontWeight: "bold",
  fontSize: "1.1rem",
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
  exchangeRate,
  isEditingExchangeRate = false,
  childGroupsWithPricing = [],
  onExchangeRateChange = () => { },
}) => {
  const sortByDay = (data) => {
    return [...data].sort((a, b) => {
      const dayA = parseInt(a.day.replace(/\D/g, "")) || 0;
      const dayB = parseInt(b.day.replace(/\D/g, "")) || 0;
      return dayA - dayB;
    });
  };

  const getExtrabedQuantity = (item) => {
    if (!item.extrabedByTraveler) return 0;

    let totalQty = 0;

    Object.keys(item.extrabedByTraveler).forEach(travelerKey => {
      const travelerData = item.extrabedByTraveler[travelerKey];
      if (travelerData && travelerData.use === true) {
        totalQty += parseInt(travelerData.qty) || 0;
      }
    });

    return totalQty;
  };

  const getExtrabedCost = (item) => {
    const pricePerExtrabed = item.extrabedPrice || 0;
    return pricePerExtrabed;
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

  const hotelPerAdult = roundPrice(totalAdult > 0 ? hotelTotal / totalAdult : 0);
  const transportPerAdult = roundPrice(totalAdult > 0 ? transportTotal / totalAdult : 0);
  const additionalPerAdult = roundPrice(totalAdult > 0 ? additionalTotal / totalAdult : 0);

  const hasExtrabed = sortedHotelData.some(item => getExtrabedQuantity(item) > 0);

  return (
    <VStack spacing={3} align="stretch">
      {/* Hotel */}
      <Box>
        <Text fontWeight="bold" mb={1} fontSize="lg" color={orangeDark}>
          Akomodasi
        </Text>
        <Divider mb={2} borderColor="white" />
        <Box overflowX="auto">
          <Table variant="simple" size="sm" border="1px solid #e0e0e0" width="100%">
           <Thead>
              <Tr>
                <Th style={{ ...tableHeaderStyle, width: "50px" }}>Day</Th>
                <Th style={{ ...tableHeaderStyle, width: "150px" }}>Name</Th>
                <Th style={{ ...tableHeaderStyle, width: "150px" }}>Rooms</Th>
                <Th style={{ ...tableHeaderStyle, width: "90px" }}>
                  Price/Room
                </Th>
                {hasExtrabed && (
                  <Th style={{ ...tableHeaderStyle, width: "100px" }}>
                    Extrabed
                  </Th>
                )}
                <Th style={{ ...tableHeaderStyle, width: "90px" }}>TOTAL</Th>
              </Tr>
            </Thead>
            <Tbody color={"#222"}>
              {sortedHotelData.map((item, index) => {
                const extrabedQty = getExtrabedQuantity(item);
                const extrabedCost = getExtrabedCost(item);

                return (
                  <Tr key={index}>
                    <Td style={narrowColumnStyle}>{item.day}</Td>
                    <Td style={wideColumnStyle}>{item.name}</Td>
                    <Td style={narrowColumnStyle}>{item.rooms} {item.roomType}</Td>
                    <Td style={mediumColumnStyle}>
                      {formatCurrency(item.pricePerNight)}
                    </Td>
                    {hasExtrabed && (
                      <Td style={mediumColumnStyle}>
                        {(extrabedQty || 0) > 0 ? (
                          <div style={{ fontSize: "0.9em" }}>
                            {extrabedQty} x {formatCurrency((extrabedCost || 0))}
                          </div>
                        ) : (
                          "-"
                        )}
                      </Td>
                    )}
                    <Td style={mediumColumnStyle}>
                      {formatCurrency(item.total)}
                    </Td>
                  </Tr>
                );
              })}
              <Tr>
                <Td colSpan={hasExtrabed ? 5 : 4} style={tableTotalStyle}>
                  Total Hotel
                </Td>
                <Td style={{ ...tableTotalStyle, textAlign: "left" }}>
                  {formatCurrency(hotelTotal)}
                </Td>
              </Tr>
              <Tr>
                <Td
                  colSpan={hasExtrabed ? 5 : 4}
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
      </Box>

      {/* Transport */}
      <Box>
        <Text fontWeight="bold" mb={1} fontSize="lg" color={orangeDark}>
          Transportasi
        </Text>
        <Divider mb={2} borderColor="white" />
        <Box overflowX="auto">
          <Table variant="simple" size="sm" border="1px solid #e0e0e0" width="100%">
            <Thead>
              <Tr>
                <Th style={{ ...tableHeaderStyle, width: "70px" }}>Day</Th>
                <Th style={{ ...tableHeaderStyle, width: "300px" }}>
                  Description
                </Th>
                <Th style={{ ...tableHeaderStyle, width: "120px" }}>Price</Th>
              </Tr>
            </Thead>
            <Tbody color={"#222"}>
              {sortedTransportData.map((item, index) => (
                <Tr key={index}>
                  <Td style={narrowColumnStyle}>{item.day}</Td>
                  <Td style={{ ...wideColumnStyle, width: "300px" }}>{item.description}</Td>
                  <Td style={mediumColumnStyle}>
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
      </Box>

      {/* Tambahan */}
      <Box>
        <Text fontWeight="bold" mb={2} fontSize="lg" color={orangeDark}>
          Tambahan (Akomodasi & Transport)
        </Text>
        <Divider mb={2} borderColor="white" />
        <Box overflowX="auto" mb={5}>
          <Table variant="simple" size="sm" border="1px solid #e0e0e0" width="100%">
            {sortedAdditionalData.length > 0 && (
              <Thead>
                <Tr>
                  <Th style={{ ...tableHeaderStyle, width: "70px" }}>Day</Th>
                  <Th style={{ ...tableHeaderStyle, width: "180px" }}>Item</Th>
                  <Th style={{ ...tableHeaderStyle, width: "70px" }}>Qty</Th>
                  <Th style={{ ...tableHeaderStyle, width: "120px" }}>Price</Th>
                  <Th style={{ ...tableHeaderStyle, width: "120px" }}>Total</Th>
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
                      <Td style={mediumColumnStyle}>
                        {formatCurrency(item.price)}
                      </Td>
                      <Td style={mediumColumnStyle}>
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
                        padding: "20px",
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
      </Box>

      {/* Grand Total */}
      <Box p={4} borderRadius="md" style={tableGrandTotalStyle}>
        <VStack spacing={3}>
          <HStack justify="space-between" w="100%">
            <Text fontSize="lg">TOTAL</Text>
            <Text fontSize="lg">{formatCurrency(grandTotal)}</Text>
          </HStack>
          <HStack justify="space-between" w="100%">
            <Text fontSize="lg">Markup</Text>
            <Text fontSize="lg">{formatCurrency(markup)}</Text>
          </HStack>
          <HStack justify="space-between" w="100%">
            <Text fontWeight="bold" fontSize="lg">Price Pax Adult</Text>
            <Text fontWeight="bold" fontSize="lg">{formatCurrency(selling)}</Text>
          </HStack>
          {childGroupsWithPricing.map((childGroup, index) => (
            <HStack key={childGroup.id || index} justify="space-between" w="100%">
              <Text fontWeight="bold" fontSize="lg">
                Price Pax {childGroup.label}
              </Text>
              <Text fontWeight="bold" fontSize="lg">
                {formatCurrency(childGroup.price)}
              </Text>
            </HStack>
          ))}
          <HStack justify="space-between" w="100%">
            <Text fontSize="lg">Exchange Rate</Text>
            {isEditingExchangeRate ? (
              <Input
                type="number"
                value={exchangeRate}
                onChange={(e) => {
                  const value = e.target.value;
                  onExchangeRateChange(value === "" ? "" : Number(value));
                }}
                style={{
                  width: "120px",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  textAlign: "right",
                }}
              />
            ) : (
              <Text fontWeight="bold" fontSize="lg">{formatCurrency(exchangeRate)}</Text>
            )}
          </HStack>
        </VStack>
      </Box>
    </VStack>
  );
};

export default CostBreakDown;