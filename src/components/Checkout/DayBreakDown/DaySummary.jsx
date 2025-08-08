import { Box, Grid, Text, Flex } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { useCheckoutContext } from "../../../context/CheckoutContext";

const DaySummary = ({
  akomodasiTotal,
  transportTotal,
  tourTotal,
  formatCurrency,
}) => {
  const accentColor = useColorModeValue("teal.300", "teal.400");
  const summaryCardBg = useColorModeValue("gray.600", "gray.700");

  const { totalMarkup } = useCheckoutContext();

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
      {/* Akomodasi */}
      <Box bg={summaryCardBg} p={4} rounded="lg">
        <Text fontSize="sm" color="gray.300">
          Total Akomodasi
        </Text>
        <Text fontSize="lg" fontWeight="bold" color={accentColor}>
          {formatCurrency(akomodasiTotal)}
        </Text>
      </Box>

      {/* Transportasi */}
      <Box bg={summaryCardBg} p={4} rounded="lg">
        <Text fontSize="sm" color="gray.300">
          Total Transportasi
        </Text>
        <Text fontSize="lg" fontWeight="bold" color={accentColor}>
          {formatCurrency(transportTotal)}
        </Text>
      </Box>

      {/* Tour */}
      <Box bg={summaryCardBg} p={4} rounded="lg">
        <Text fontSize="sm" color="gray.300">
          Total Tour
        </Text>
        <Text fontSize="lg" fontWeight="bold" color={accentColor}>
          {formatCurrency(tourTotal)}
        </Text>
      </Box>

      {/* Markup */}
      <Box bg={summaryCardBg} p={4} rounded="lg">
        <Flex align="center" gap={2}>
          <Text fontSize="sm" color="gray.300">
            Total Markup
          </Text>
          <Text fontSize="xs" color="gray.500">
            (Markup × Jumlah pax)
          </Text>
        </Flex>

        <Text fontSize="lg" fontWeight="bold" color={accentColor}>
          {formatCurrency(totalMarkup)}
        </Text>
      </Box>
    </Grid>
  );
};

export default DaySummary;
