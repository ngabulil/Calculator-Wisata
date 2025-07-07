import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    VStack
} from '@chakra-ui/react';

const orange = "#FFA726";
const gray = "#F5F5F5";

const tableHeaderStyle = {
    backgroundColor: orange,
    color: "#222",
    fontWeight: "bold",
    fontSize: "1rem"
};

const HotelChoicesTable = ({ hotelChoices }) => (
    <Box mb={8} borderRadius="md" overflow="hidden" border="1px solid #e0e0e0" className="print:border-black">
        <Table variant="simple" size="sm">
            <Thead>
                <Tr>
                    <Th textAlign="center" width="60px" style={tableHeaderStyle} className="print:bg-gray-200 print:text-black print:border-black">NO</Th>
                    <Th style={tableHeaderStyle} className="print:bg-gray-200 print:text-black print:border-black">
                        <VStack spacing={0}>
                            <Text>HOTEL CHOICE</Text>
                            <Text fontSize="sm">(3 Night Hotel)</Text>
                        </VStack>
                    </Th>
                    <Th textAlign="center" width="200px" style={tableHeaderStyle} className="print:bg-gray-200 print:text-black print:border-black">
                        <VStack spacing={0}>
                            <Text>PRICE PER PAX</Text>
                            <Text fontSize="sm">2 Pax</Text>
                            <Text fontSize="xs">Transport 6 Seater</Text>
                            <Text fontSize="xs" fontWeight="normal" fontStyle="italic">(Driver as Guide)</Text>
                        </VStack>
                    </Th>
                </Tr>
            </Thead>
            <Tbody color={"#222"}>
                {hotelChoices.map((hotel, index) => (
                    <Tr key={index} _hover={{ background: gray }} className="print:border-black">
                        <Td textAlign="center" className="print:text-black print:border-black">{hotel.no}</Td>
                        <Td className="print:text-black print:border-black">
                            <VStack align="flex-start" spacing={0}>
                                <Text fontWeight="semibold">{hotel.name}</Text>
                                <Text fontSize="xs">{hotel.roomType}</Text>
                            </VStack>
                        </Td>
                        <Td textAlign="center" className="print:text-black print:border-black">
                            <Box as="span" py={1} px={3} className="bg-yellow-200 print:bg-yellow-100 print:text-black print:border-black" display="inline-block" borderRadius="md">
                                <Text fontWeight="bold" fontSize="md">{hotel.price}</Text>
                            </Box>
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    </Box>
);

export default HotelChoicesTable;