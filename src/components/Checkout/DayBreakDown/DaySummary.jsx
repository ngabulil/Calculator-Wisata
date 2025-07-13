import { Box, Grid, Text } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";

const DaySummary = ({ akomodasiTotal, transportTotal, tourTotal, markup, formatCurrency }) => {
  const accentColor = useColorModeValue("teal.300", "teal.400");
  const summaryCardBg = useColorModeValue("gray.600", "gray.700");

  const items = [
    { label: "Total Akomodasi", value: akomodasiTotal },
    { label: "Total Transportasi", value: transportTotal },
    { label: "Total Tour", value: tourTotal },
    { label: "Total Markup", value: markup },
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
