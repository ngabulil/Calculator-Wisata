import { Box, Grid, Text } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { useCheckoutContext } from "../../../context/CheckoutContext";

const DaySummary = ({ akomodasiTotal, transportTotal, tourTotal,formatCurrency }) => {
  const accentColor = useColorModeValue("teal.300", "teal.400");
  const summaryCardBg = useColorModeValue("gray.600", "gray.700");

  const { userMarkupAmount } = useCheckoutContext();
  const totalMarkup = userMarkupAmount;

  const items = [
    { label: "Total Akomodasi", value: akomodasiTotal },
    { label: "Total Transportasi", value: transportTotal },
    { label: "Total Tour", value: tourTotal },
    { label: "Total Markup", value: totalMarkup },
  ];

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
      {items.map((item, i) => (
        <Box key={i} bg={summaryCardBg} p={4} rounded="lg">
          <Text fontSize="sm" color="gray.300">{item.label}</Text>
          <Text fontSize="lg" fontWeight="bold" color={accentColor}>
            {formatCurrency(item.value)}
          </Text>
        </Box>
      ))}
    </Grid>
  );
};

export default DaySummary;
