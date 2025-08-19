import React, { Suspense, useMemo } from "react";
import { 
  Container, 
  Box, 
  Text, 
  useColorModeValue, 
  Grid, 
  GridItem,
  Skeleton,
  SkeletonText,
  VStack,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { usePackageContext } from "../context/PackageContext";

const DayBreakDown = React.lazy(() => import("../components/Checkout/DayBreakDown/DayBreakDown"));
const CheckoutSummary = React.lazy(() => import("../components/Checkout/CheckoutSummary"));

const DayBreakDownSkeleton = () => (
  <VStack spacing={4} align="stretch">
    {[1, 2, 3].map((index) => (
      <Box key={index} p={4} bg="whiteAlpha.100" rounded="md">
        <HStack justify="space-between" mb={2}>
          <Skeleton height="20px" width="120px" />
          <Skeleton height="20px" width="80px" />
        </HStack>
        <SkeletonText mt={2} noOfLines={2} spacing={2} />
      </Box>
    ))}
  </VStack>
);

const CheckoutSummarySkeleton = () => (
  <Box p={4} bg="whiteAlpha.100" rounded="md">
    <Skeleton height="24px" width="150px" mb={4} />
    <VStack spacing={3} align="stretch">
      {[1, 2, 3, 4].map((index) => (
        <HStack key={index} justify="space-between">
          <Skeleton height="18px" width="100px" />
          <Skeleton height="18px" width="80px" />
        </HStack>
      ))}
    </VStack>
    <Box mt={4} pt={3} borderTop="1px solid" borderColor="whiteAlpha.300">
      <HStack justify="space-between">
        <Skeleton height="20px" width="60px" />
        <Skeleton height="20px" width="120px" />
      </HStack>
    </Box>
  </Box>
);

const CheckoutPage = () => {
  const { selectedPackage, isLoading } = usePackageContext();

  const cardBg = useColorModeValue("gray.700", "gray.800");
  const textColor = useColorModeValue("white", "white");

  // Memoize formatCurrency function untuk menghindari re-creation
  const formatCurrency = useMemo(
    () => (amount) => {
      if (typeof amount !== 'number' || isNaN(amount)) return 'Rp 0';
      return `Rp ${amount.toLocaleString("id-ID")}`;
    },
    []
  );

  // Memoize days data untuk menghindari re-processing
  const memoizedDays = useMemo(() => {
    return selectedPackage?.days || [];
  }, [selectedPackage?.days]);

  // Early return jika tidak ada selectedPackage
  if (!selectedPackage && !isLoading) {
    return (
      <Container maxW="7xl" py={6} px={0}>
        <Box bg={cardBg} rounded="lg" p={6} boxShadow="lg" color={textColor}>
          <Text fontSize="xl" fontWeight="bold" mb={6}>Paket tidak ditemukan</Text>
          <Text>Silakan pilih paket terlebih dahulu.</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="7xl" py={6} px={0}>
      <Box bg={cardBg} rounded="lg" p={6} boxShadow="lg" color={textColor}>
        <Text fontSize="xl" fontWeight="bold" mb={6}>
          Ringkasan Checkout
        </Text>
        
        {isLoading ? (
          // Loading state dengan skeleton
          <Grid templateColumns="repeat(12, 1fr)" gap={6}>
            <GridItem colSpan={{ base: 12, lg: 8 }}>
              <DayBreakDownSkeleton />
            </GridItem>
            <GridItem colSpan={{ base: 12, lg: 4 }}>
              <CheckoutSummarySkeleton />
            </GridItem>
          </Grid>
        ) : (
          <Grid templateColumns="repeat(12, 1fr)" gap={6}>
            <GridItem colSpan={{ base: 12, lg: 8 }}>
              <Suspense 
                fallback={
                  <Box textAlign="center" py={8}>
                    <Spinner size="lg" color="blue.500" />
                    <Text mt={4}>Memuat detail hari...</Text>
                  </Box>
                }
              >
                <DayBreakDown 
                  days={memoizedDays} 
                  formatCurrency={formatCurrency} 
                />
              </Suspense>
            </GridItem>
            <GridItem colSpan={{ base: 12, lg: 4 }}>
              <Suspense 
                fallback={
                  <Box textAlign="center" py={8}>
                    <Spinner size="lg" color="green.500" />
                    <Text mt={4}>Memuat ringkasan...</Text>
                  </Box>
                }
              >
                <CheckoutSummary formatCurrency={formatCurrency} />
              </Suspense>
            </GridItem>
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default CheckoutPage;