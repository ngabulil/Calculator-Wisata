// components/Navbar.jsx
import { Box, Flex, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import SubNavbarPackage from "../Admin/packages/SubNavbarPackage/SubNavbarPackage";

const linkStyle = ({ isActive }) => ({
  fontWeight: isActive ? "bold" : "normal",
  borderBottom: isActive ? "2px solid white" : "none",
  paddingBottom: "2px",
});

const Navbar = () => {
  return (
    <Box bg="teal.600" color="white" px={6} py={4} shadow="md">
      <Flex alignItems="center" justify="space-between">
        <Text fontWeight="bold">Admin</Text>
        <Flex gap={6} alignItems="center">
          {/* <SubNavbarPackage /> */}
          <NavLink to="/admin" style={linkStyle}>
            Paket
          </NavLink>
          <NavLink to="/admin/packages/hotel" style={linkStyle}>
            Hotel
          </NavLink>
          <NavLink to="/admin/packages/villa" style={linkStyle}>
            Villa
          </NavLink>
          {/* <NavLink to="/admin/transport" style={linkStyle}>
            Transport
          </NavLink>
          <NavLink to="/admin/acomodation" style={linkStyle}>
            Akomodasi
          </NavLink> */}
          <NavLink to="/calculator" style={linkStyle}>
            Calculator
          </NavLink>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
