import { Box, Text, HStack, Divider, VStack } from '@chakra-ui/react';

const orange = "#FFA726";
const orangeDark = "#FB8C00";

const InvoiceHeader = ({ packageName, totalAdult, totalChild, adminName }) => (
  <Box>
    <VStack spacing={1} mb={6}>
      <Text fontSize="2xl" fontWeight="bold" color={orangeDark} textAlign="center" letterSpacing="wide">
        Travel Quotation
      </Text>
    </VStack>
    
    <Divider mb={4} borderColor="gray.300" />
    
    <Box mb={6} p={2} borderRadius="md" style={{ backgroundColor: orange }}>
      <HStack justify="space-between" mb={2}>
        <Text fontWeight="bold" fontSize="lg">Code: {packageName}</Text>
      </HStack>
      <HStack justify="space-between">
        <Text fontWeight="semibold">Total Adult: {totalAdult} Total Child: {totalChild}</Text>
        <Text fontWeight="semibold">InputBy: {adminName}</Text>
      </HStack>
    </Box>
  </Box>
);

export default InvoiceHeader;