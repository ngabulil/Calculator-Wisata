import { Box, Text, HStack, Divider } from '@chakra-ui/react';

const orange = "#FFA726";
const orangeDark = "#FB8C00";

const InvoiceHeader = ({ code, totalPax }) => (
    <Box>
        <Text fontSize="2xl" fontWeight="bold" mb={6} color={orangeDark} textAlign="center" letterSpacing="wide">
            Travel Itinerary & Quotation
        </Text>
        <Divider mb={4} borderColor="white"/>

        <Box mb={6} p={2} borderRadius="md" style={{ backgroundColor: orange }}>
            <HStack justify="space-between" mb={2}>
                <Text fontWeight="bold" fontSize="lg">Code: {code}</Text>
            </HStack>
            <HStack justify="space-between">
                <Text fontWeight="semibold">Total Pax: {totalPax}</Text>
                {/* <Text fontWeight="semibold">Total Fee: {totalFee}</Text> */}
            </HStack>
        </Box>
    </Box>
);

export default InvoiceHeader