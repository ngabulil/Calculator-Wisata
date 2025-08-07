import {
  Box,
  useColorModeValue,
  Container,
  Button,
  Text,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCheckoutContext } from "../context/CheckoutContext";
import { useExpensesContext } from "../context/ExpensesContext";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { CloseIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { useGrandTotalContext } from "../context/GrandTotalContext";

const Layout = ({ children }) => {
  const bg = useColorModeValue("gray.50", "gray.900");
  const location = useLocation();
  const navigate = useNavigate();
  // Mengambil grandTotal dari useCheckoutContext
  const { grandTotal } = useCheckoutContext();
  const { calculateGrandTotal } = useExpensesContext();
  const { akomodasiTotal, tourTotal, transportTotal } = useGrandTotalContext();
  const [isVisible, setIsVisible] = useState(true);

  const isCalculatorPage = location.pathname === "/calculator";

  return (
    <Box minH="100vh" bg={bg} position="relative">
      <Navbar />
      <Container maxW="7xl" py={3}>
        {children}
      </Container>

      {/* Grand Total Box */}
      {isCalculatorPage && (
        <>
          {isVisible ? (
            <Box
              position="fixed"
              bottom={0}
              left={0}
              right={0}
              bg="gray.800"
              color="white"
              py={3}
              px={6}
              zIndex="banner"
              boxShadow="lg"
            >
              <HStack justify="space-between">
                <Text fontWeight="bold">
                  Grand Total: Rp{" "}
                  {/* Menampilkan grandTotal yang diambil dari context */}
                  {[akomodasiTotal, tourTotal, transportTotal]
                    .flat()
                    .reduce((sum, num) => sum + num, 0)
                    .toLocaleString("id-ID")}
                  {/* {(grandTotal + calculateGrandTotal()).toLocaleString("id-ID")} */}
                </Text>
                <HStack spacing={3}>
                  <Button
                    colorScheme="teal"
                    onClick={() => navigate("/checkout")}
                  >
                    Checkout
                  </Button>
                  <IconButton
                    size="sm"
                    aria-label="Tutup"
                    icon={<CloseIcon />}
                    onClick={() => setIsVisible(false)}
                  />
                </HStack>
              </HStack>
            </Box>
          ) : (
            <IconButton
              position="fixed"
              bottom={4}
              left={4}
              zIndex="banner"
              size="md"
              colorScheme="teal"
              aria-label="Buka kembali"
              icon={<ChevronUpIcon />}
              onClick={() => setIsVisible(true)}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default Layout;
