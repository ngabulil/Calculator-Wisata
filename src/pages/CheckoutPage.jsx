import { Container, Box, Text, useColorModeValue, Grid, GridItem } from "@chakra-ui/react";
import { usePackageContext } from "../context/PackageContext";
import DayBreakDown from "../components/Checkout/DayBreakDown";
import CheckoutSummary from "../components/Checkout/CheckoutSummary";

const CheckoutPage = () => {
  const { selectedPackage } = usePackageContext();

  const cardBg = useColorModeValue("gray.700", "gray.800");
  const textColor = useColorModeValue("white", "white");

  const formatCurrency = (amount) => `Rp ${amount.toLocaleString("id-ID")}`;

  return (
    <Container maxW="7xl" py={6} px={0}>
      <Box bg={cardBg} rounded="lg" p={6} boxShadow="lg" color={textColor}>
        <Text fontSize="xl" fontWeight="bold" mb={6}>Ringkasan Checkout</Text>
        <Grid templateColumns="repeat(12, 1fr)" gap={6}>
          <GridItem colSpan={{ base: 12, lg: 8 }}>
            <DayBreakDown days={selectedPackage.days || []} formatCurrency={formatCurrency} />
          </GridItem>
          <GridItem colSpan={{ base: 12, lg: 4 }}>
            <CheckoutSummary formatCurrency={formatCurrency} />
          </GridItem>
        </Grid>
      </Box>
    </Container>
  );
};

export default CheckoutPage;