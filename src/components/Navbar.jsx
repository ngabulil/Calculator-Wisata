// components/Navbar.jsx
import { Box, Flex, Text, Link as ChakraLink } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  fontWeight: isActive ? "bold" : "normal",
  borderBottom: isActive ? "2px solid white" : "none",
  paddingBottom: "2px",
});

const Navbar = () => {
  return (
    <Box bg="teal.600" color="white" px={6} py={4} shadow="md">
      <Flex align="center" justify="space-between">
        <Text fontWeight="bold">Calculator Wisata</Text>
        <Flex gap={6}>
          <NavLink to="/calculator" style={linkStyle}>
            Akomodasi
          </NavLink>
          <NavLink to="/tour-packages" style={linkStyle}>
            Tour Packages
          </NavLink>
          <NavLink to="/transport" style={linkStyle}>
            Transport
          </NavLink>
          <NavLink to="/checkout" style={linkStyle}>
            Checkout
          </NavLink>
          <NavLink to="/admin" style={linkStyle}>
            Admin
          </NavLink>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
