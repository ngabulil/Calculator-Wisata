import {
  Box,
  Text,
  VStack,
  HStack,
  Divider,
  Button,
  useColorModeValue,
  Input,
  Select,
  Flex,
} from "@chakra-ui/react";
import { useCheckoutContext } from "../../context/CheckoutContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CheckoutSummary = ({ formatCurrency }) => {
  const { 
    breakdown, 
    grandTotal,
    subtotalBeforeUserMarkup, 
    userMarkup, 
    childMarkup,
    userMarkupAmount, 
    updateUserMarkup,
    childMarkupAmount,
    updateChildMarkup 
  } = useCheckoutContext();
  const accentColor = useColorModeValue("teal.300", "teal.400");
  const navigate = useNavigate();
  
  const [markupInput, setMarkupInput] = useState(userMarkup.value.toString());
  const [childMarkupInput, setChildMarkupInput] = useState(childMarkup.value.toString());

  const labelMap = {
    hotels: 'Hotel',
    villas: 'Villa',
    additionals: 'Tambahan',
    transports: 'Transportasi',
    tours: 'Tour',
    markup: 'Markup'
  };

  const handleMarkupTypeChange = (e) => {
    const newType = e.target.value;
    updateUserMarkup(newType, userMarkup.value);
  };

  const handleMarkupValueChange = (e) => {
    const value = e.target.value;
    setMarkupInput(value);
  
    const numericValue = parseFloat(value) || 0;
    updateUserMarkup(userMarkup.type, numericValue);
  };

  const handleChildMarkupTypeChange = (e) => {
    const newType = e.target.value;
    updateChildMarkup(newType, childMarkup.value); // Fixed: was passing 'childMarupAmount' instead of 'childMarkup.value'
  };

  const handleChildMarkupValueChange = (e) => {
    const value = e.target.value;
    setChildMarkupInput(value);
  
    const numericValue = parseFloat(value) || 0;
    updateChildMarkup(childMarkup.type, numericValue); // Fixed: was missing 'childMarkup.type' parameter
  };

  return (
    <Box bg="gray.600" p={6} rounded="lg" position="sticky" top={6}>
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Total Keseluruhan
      </Text>
      
      <VStack spacing={3} align="stretch">
        {Object.entries(breakdown).map(([label, value]) => {
          if (value === 0 || label === 'markup') return null;
          
          return (
            <HStack key={label} justify="space-between" fontSize="sm">
              <Text>{labelMap[label] || label}</Text>
              <Text>{formatCurrency(value)}</Text>
            </HStack>
          );
        })}
        <HStack justify="space-between" fontSize="sm" fontWeight="bold">
          <Text>Total</Text>
          <Text>{formatCurrency(subtotalBeforeUserMarkup)}</Text>
        </HStack>
        <Divider my={2} />

        {/* Input markup dengan select dan fungsionalitas */}
        <HStack justify="space-between" fontSize="12px" mt={2}>
          <Text>Markup Adult</Text>
          <Flex align="center" gap={3}>
            <Select 
              value={userMarkup.type} 
              onChange={handleMarkupTypeChange}
              size="sm" 
              width="70px"
              bg="whiteAlpha.200"
              _hover={{ bg: "whiteAlpha.300" }}
            >
              <option value="percent">%</option>
              <option value="fixed">IDR</option>
            </Select>
            
            <Input
              value={markupInput}
              onChange={handleMarkupValueChange}
              placeholder="0"
              size="sm"
              width="100px"
              textAlign="right"
              bg="whiteAlpha.200"
              _hover={{ bg: "whiteAlpha.300" }}
              type="number"
              min="0"
            />
            
            <Text minWidth="80px" textAlign="right">
              {formatCurrency(userMarkupAmount)}
            </Text>
          </Flex>
        </HStack>

        <HStack justify="space-between" fontSize="12px" mt={2}>
          <Text>Markup Child</Text>
          <Flex align="center" gap={3}>
            <Select 
              value={childMarkup.type} 
              onChange={handleChildMarkupTypeChange}
              size="sm" 
              width="70px"
              bg="whiteAlpha.200"
              _hover={{ bg: "whiteAlpha.300" }}
            >
              <option value="percent">%</option>
              <option value="fixed">IDR</option>
            </Select>
            
            <Input
              value={childMarkupInput}
              onChange={handleChildMarkupValueChange}
              placeholder="0"
              size="sm"
              width="100px"
              textAlign="right"
              bg="whiteAlpha.200"
              _hover={{ bg: "whiteAlpha.300" }}
              type="number"
              min="0"
            />
            
            <Text minWidth="80px" textAlign="right">
              {formatCurrency(childMarkupAmount)}
            </Text>
          </Flex>
        </HStack>

        <Divider my={2} />
        
        <HStack justify="space-between" fontSize="xl" fontWeight="bold">
          <Text>GRAND TOTAL</Text>
          <Text color={accentColor}>{formatCurrency(grandTotal)}</Text>
        </HStack>
      </VStack>
      
      <Button 
        colorScheme="teal" 
        size="lg" 
        width="full" 
        mt={6}
        onClick={() => navigate("/expenses")}
      >
        Proses Checkout
      </Button>
    </Box>
  );
};

export default CheckoutSummary;