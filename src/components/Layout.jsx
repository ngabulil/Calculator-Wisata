// components/Layout.jsx
import { Box, useColorModeValue, Container, Button, Text, HStack, IconButton } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCheckoutContext } from "../context/CheckoutContext";
import Navbar from "./Navbar";
import { useState } from "react";
import { CloseIcon, ChevronUpIcon } from "@chakra-ui/icons";

const Layout = ({ children }) => {
  const bg = useColorModeValue("gray.50", "gray.900");
  const location = useLocation();
  const navigate = useNavigate();
  const { akomodasiTotal, transportTotal } = useCheckoutContext();
  const [isVisible, setIsVisible] = useState(true);

  const isCheckoutPage = location.pathname === "/checkout";

  return (
    <Box minH="100vh" bg={bg} position="relative">
      <Navbar />
      <Container maxW="7xl" py={3}>
        {children}
      </Container>

      {/* Grand Total Box - Global */}
      {!isCheckoutPage && (
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
                  Grand Total: Rp {(akomodasiTotal + transportTotal).toLocaleString("id-ID")}
                </Text>
                <HStack spacing={3}>
                  <Button colorScheme="teal" onClick={() => navigate("/checkout")}>
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
