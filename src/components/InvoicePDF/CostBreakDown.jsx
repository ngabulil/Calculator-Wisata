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
// const red = "#FFCDD2";

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
    totalAdditional,
    grandTotal,
    perPax,
    selling,
    formatCurrency,
}) => {
    return (
        <VStack spacing={3} align="stretch">
            {/* Hotel Costs */}
            <Box>
                <Text fontWeight="bold" mb={1} fontSize="lg" color={orangeDark}>
                    Hotel
                </Text>
                <Divider mb={1} borderColor="white"/>
                <Table variant="simple" size="sm" border="1px solid #e0e0e0">
                    <Thead>
                        <Tr>
                            <Th style={tableHeaderStyle}>Day</Th>
                            <Th style={tableHeaderStyle}>Hotel</Th>
                            <Th style={tableHeaderStyle}>Price</Th>
                            <Th style={tableHeaderStyle}>Rooms</Th>
                            <Th style={tableHeaderStyle}>TOTAL</Th>
                        </Tr>
                    </Thead>
                    <Tbody color={"#222"}>
                        {hotelData.map((hotel, index) => (
                            <Tr key={index}>
                                <Td>{hotel.day}</Td>
                                <Td>{hotel.name?.label || hotel.name}</Td>
                                <Td>{formatCurrency(hotel.pricePerNight)}</Td>
                                <Td>{hotel.rooms}</Td>
                                <Td>{formatCurrency(hotel.total)}</Td>
                            </Tr>
                        ))}
                        <Tr>
                            <Td colSpan={4} style={tableTotalStyle}>
                                Total Hotel
                            </Td>
                            <Td style={tableTotalStyle}>
                                {formatCurrency(
                                    hotelData.reduce((sum, item) => sum + item.total, 0)
                                )}
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
            </Box>

            {/* Transport Section */}
            <Box>
                <Text fontWeight="bold" mb={3} fontSize="lg" color={orangeDark}>
                    TRANSPORT
                </Text>
                <Divider mb={1} borderColor="white"/>
                <Table variant="simple" size="sm" border="1px solid #e0e0e0">
                    <Thead>
                        <Tr>
                            <Th style={tableHeaderStyle}>Description</Th>
                            <Th style={{ ...tableHeaderStyle, textAlign: "right" }}>Price</Th>
                        </Tr>
                    </Thead>
                    <Tbody color={"#222"}>
                        {transportData.map((transport, index) => (
                            <Tr key={index}>
                                <Td>{transport.description}</Td>
                                <Td>{formatCurrency(transport.price)}</Td>
                            </Tr>
                        ))}
                        <Tr>
                            <Td style={tableTotalStyle}>Total Transport</Td>
                            <Td style={tableTotalStyle}>
                                {formatCurrency(
                                    transportData.reduce((sum, item) => sum + item.price, 0)
                                )}
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
            </Box>

            {/* Additional Items (Lainnya) */}
            <Box>
                <Text fontWeight="bold" mb={3} fontSize="lg" color={orangeDark}>
                    Additional Items / Lainnya
                </Text>
                <Divider mb={1} borderColor="white"/>
                <Table variant="simple" size="sm" border="1px solid #e0e0e0">
                    {additionalData.length > 0 ? (
                        <Thead>
                            <Tr>
                                <Th style={tableHeaderStyle}>Item</Th>
                                <Th style={{ ...tableHeaderStyle, textAlign: "center" }}>
                                    Quantity
                                </Th>
                                <Th style={{ ...tableHeaderStyle, textAlign: "right" }}>
                                    Price
                                </Th>
                                <Th style={{ ...tableHeaderStyle, textAlign: "right" }}>
                                    Total
                                </Th>
                            </Tr>
                        </Thead>
                    ) : null}
                    <Tbody color={"#222"}>
                        {additionalData.length > 0 ? (
                            <>
                                {additionalData.map((item, index) => (
                                    <Tr key={index}>
                                        <Td>{item.name}</Td>
                                        <Td textAlign="center">{item.quantity}</Td>
                                        <Td textAlign="right">{formatCurrency(item.price)}</Td>
                                        <Td textAlign="right">{formatCurrency(item.total)}</Td>
                                    </Tr>
                                ))}
                                <Tr>
                                    <Td colSpan={3} style={tableTotalStyle}>
                                        Total Additional
                                    </Td>
                                    <Td textAlign="right" style={tableTotalStyle}>
                                        {formatCurrency(totalAdditional)}
                                    </Td>
                                </Tr>
                            </>
                        ) : (
                            <Tr>
                                <Td colSpan={4} textAlign="center" color="gray.500" py={4}>
                                    No additional items
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </Box>

            {/* Grand Total Section */}
            <Box p={4} borderRadius="md" style={tableGrandTotalStyle}>
                <VStack spacing={2}>
                    <HStack justify="space-between" w="100%">
                        <Text>GRAND TOTAL</Text>
                        <Text>{formatCurrency(grandTotal)}</Text>
                    </HStack>
                    <HStack justify="space-between" w="100%" fontSize="lg">
                        <Text>Up per Pax</Text>
                        <Text>{formatCurrency(perPax)}</Text>
                    </HStack>
                    <HStack justify="space-between" w="100%">
                        <Text fontWeight="bold">Selling</Text>
                        <Text>
                            {formatCurrency(selling)}
                        </Text>
                    </HStack>
                </VStack>
            </Box>
        </VStack>

    );
};

export default CostBreakDown;
