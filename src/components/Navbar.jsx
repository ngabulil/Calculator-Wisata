// components/Navbar.jsx
import { Box, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <Box bg="teal.600" color="white" px={6} py={4} shadow="md">
      <Flex align="center" justify="space-between">
        <Text fontWeight="bold">Calculator Wisata</Text>
        <Flex gap={6}>
          <Link to="/calculator">Akomodasi</Link>
          <Link to="/tour-packages">Tour Packages</Link>
          <Link to="/transport">Transport</Link>
          <Link to="/checkout">Checkout</Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
