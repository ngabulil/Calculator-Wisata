import {
  Box,
  Text,
  VStack,
  HStack,
  Divider,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCheckoutContext } from "../../context/CheckoutContext";
import { useNavigate } from "react-router-dom";

const CheckoutSummary = ({ formatCurrency }) => {
  const { breakdown, grandTotal } = useCheckoutContext();
  const accentColor = useColorModeValue("teal.300", "teal.400");
  const navigate = useNavigate();

  // Mapping label yang lebih baik
  const labelMap = {
    hotels: 'Hotel',
    villas: 'Villa',
    additionals: 'Tambahan',
    transports: 'Transportasi',
    tours: 'Tour',
    markup: 'Markup'
  };

  return (
    <Box bg="gray.600" p={6} rounded="lg" position="sticky" top={6}>
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Total Keseluruhan
      </Text>
      <VStack spacing={3} align="stretch">
        {Object.entries(breakdown).map(([label, value]) => {
          if (value === 0) return null;
          
          return (
            <HStack key={label} justify="space-between" fontSize="sm">
              <Text>
                {labelMap[label] || label}
              </Text>
              <Text>{formatCurrency(value)}</Text>
            </HStack>
          );
        })}
        <Divider my={2} />
        <HStack justify="space-between" fontSize="xl" fontWeight="bold">
          <Text>TOTAL</Text>
          <Text color={accentColor}>{formatCurrency(grandTotal)}</Text>
        </HStack>
      </VStack>
      <Button colorScheme="teal" size="lg" width="full" mt={6} onClick={() => navigate("/expenses")}>
        Proses Checkout
      </Button>
    </Box>
  );
};

export default CheckoutSummary;