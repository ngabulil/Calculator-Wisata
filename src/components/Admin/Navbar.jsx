// components/Navbar.jsx
import { Box, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <Box bg="teal.600" color="white" px={6} py={4} shadow="md">
      <Flex align="center" justify="space-between">
        <Text fontWeight="bold">Admin</Text>
        <Flex gap={6}>
          <Link to="/admin">Package</Link>
          <Link to="/admin/tour-packages">Tour Packages</Link>
          <Link to="/admin/transport">Transport</Link>
          <Link to="/admin/acomodation">Akomodasi</Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
