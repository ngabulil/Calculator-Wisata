import React from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Divider,
  Button,
  useColorModeValue
} from "@chakra-ui/react";
import { useCheckoutContext } from "../context/CheckoutContext";

const CheckoutSummary = ({ formatCurrency }) => {
  const { breakdown, grandTotal } = useCheckoutContext();
  const accentColor = useColorModeValue("teal.300", "teal.400");

  return (
    <Box bg="gray.600" p={6} rounded="lg" position="sticky" top={6}>
      <Text fontSize="lg" fontWeight="bold" mb={4}>Total Keseluruhan</Text>
      <VStack spacing={3} align="stretch">
        {Object.entries(breakdown).map(([label, value]) => (
          <HStack key={label} justify="space-between" fontSize="sm">
            <Text>Subtotal {label.charAt(0).toUpperCase() + label.slice(1)}</Text>
            <Text>{formatCurrency(value)}</Text>
          </HStack>
        ))}
        <Divider my={2} />
        <HStack justify="space-between" fontSize="xl" fontWeight="bold">
          <Text>TOTAL</Text>
          <Text color={accentColor}>{formatCurrency(grandTotal)}</Text>
        </HStack>
      </VStack>
      <Button colorScheme="teal" size="lg" width="full" mt={6}>Proses Checkout</Button>
    </Box>
  );
};

export default CheckoutSummary;