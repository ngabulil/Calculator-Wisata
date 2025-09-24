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
import { useCurrencyContext } from "../../context/CurrencyContext";
import { formatCurrencyWithCode } from "../../utils/currencyUtills";

const orange = "#FB8C00";
const gray = "#F5F5F5";

const tableHeaderStyle = {
  backgroundColor: orange,
  color: "#222",
  fontWeight: "bold",
  fontSize: "15px",
  textAlign: "center",
  padding: "2px 20px 12px 20px",
};

const tableCellStyle = {
  padding: "2px 20px 16px 20px",
  verticalAlign: "top",
};

const HotelChoiceTable = ({
  accommodationData,
  getAlternativePrices,
  selectedPackage,
  childTotal,
}) => {
  const { currency } = useCurrencyContext();

  const { 
    allAccommodations = [], 
    accommodationNights, 
    firstRowPrices 
  } = accommodationData || {};

  const formatCurrencyWithContext = (amount) => formatCurrencyWithCode(amount, currency);

  return (
    <Box mb={8}>
      <Table variant="simple" size="sm" border="1px solid #ddd">
        <Thead>
          <Tr>
            <Th style={tableHeaderStyle} border="1px solid #ddd" width="5%" rowSpan={2}>
              NO
            </Th>
            <Th style={tableHeaderStyle} border="1px solid #ddd" width="60%" rowSpan={2}>
              <VStack spacing={0}>
                <Text fontWeight="bold" fontSize="14px">
                  HOTEL CHOICE
                </Text>
                <Text fontSize="xs" color="gray.700" fontWeight="normal">
                  ({accommodationNights || 0} Night Hotel)
                </Text>
              </VStack>
            </Th>
            <Th
              style={tableHeaderStyle}
              border="1px solid #ddd"
              width="45%"
              colSpan={selectedPackage?.totalPaxChildren > 0 ? 2 : 1}
            >
              <Text fontWeight="bold" fontSize="14px">
                PRICE PER PAX
              </Text>
            </Th>
          </Tr>
          <Tr>
            <Th style={{ ...tableHeaderStyle }} border="1px solid #ddd" width="25%">
              <VStack spacing={0}>
                <Text fontSize="2xs" fontWeight="bold">
                  A{selectedPackage?.totalPaxAdult}+C{childTotal || 0}
                </Text>
                <Text fontSize="2xs" fontWeight="bold">
                  Transport 6 Seater
                </Text>
              </VStack>
            </Th>
          </Tr>
        </Thead>

        <Tbody color={"#222"}>
          {allAccommodations.map((item, index) => {
            const isFirst = index === 0;

            // Baris pertama pakai harga dari firstRowPrices
            const prices = isFirst
              ? firstRowPrices
              : getAlternativePrices(item.price, item.extrabedPrice);

            return (
              <Tr key={`accommodation-${index}`} _hover={{ background: gray }}>
                <Td style={tableCellStyle} fontWeight="bold" textAlign="center">
                  {item.no || index + 1}
                </Td>
                <Td style={tableCellStyle}>
                  <VStack align="flex-start" spacing={1}>
                    <Text fontWeight="bold">
                      {item.name.toUpperCase()}
                      {item.stars ? ` (${item.stars}*)` : ""}
                    </Text>
                    {item.type !== "Package" && (
                      <Text fontSize="sm" color="gray.600">
                        ({item.jumlahKamar} {item.roomType || ""}
                        {item.hasExtrabed && item.extrabedCount > 0
                          ? ` + ${item.extrabedCount} Extrabed`
                          : ""}
                        )
                      </Text>
                    )}
                  </VStack>
                </Td>
                <Td style={tableCellStyle} fontWeight="bold" fontSize="xs">
                  <VStack spacing={1} align="flex-start">
                    <Text fontWeight="bold" color="teal.700">
                      ADULT :{" "}
                      {formatCurrencyWithContext(
                        prices.adultPrice ?? prices.adultBase
                      )}{" "}
                      / Pax
                    </Text>
                    {prices.childGroups?.map((group) => (
                      <Text key={group.id} fontWeight="bold">
                        CHILD {group.age} :{" "}
                        {formatCurrencyWithContext(
                          prices.childPriceTotals[group.id]
                        )}{" "}
                        / Pax
                      </Text>
                    ))}
                  </VStack>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

export default HotelChoiceTable;
