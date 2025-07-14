// components/Navbar.jsx
import { Box, Flex, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import AccountCard from "./accountCard";
import { useAdminAuthContext } from "../../context/AuthContext";

const linkStyle = ({ isActive }) => ({
  fontWeight: isActive ? "bold" : "normal",
  borderBottom: isActive ? "2px solid white" : "none",
  paddingBottom: "2px",
});

const Navbar = () => {
  const { userData } = useAdminAuthContext();

  return (
    <Box bg="teal.600" color="white" px={6} py={4} shadow="md">
      <Flex alignItems="center" justify="space-between">
        <Text fontWeight="bold">Admin</Text>
        <Flex gap={6} alignItems="center">
          {/* <SubNavbarPackage /> */}
          <NavLink to="/admin/paket" style={linkStyle}>
            Paket
          </NavLink>
          <NavLink to="/admin/hotel" style={linkStyle}>
            Hotel
          </NavLink>
          <NavLink to="/admin/villa" style={linkStyle}>
            Villa
          </NavLink>
          <NavLink to="/admin/activity" style={linkStyle}>
            Activity
          </NavLink>
          <NavLink to="/admin/restaurant" style={linkStyle}>
            Restaurant
          </NavLink>
          <NavLink to="/admin/transport" style={linkStyle}>
            Transport
          </NavLink>
          <NavLink to="/admin/destination" style={linkStyle}>
            Destinasi
          </NavLink>
          <NavLink to="/admin/pesanan" style={linkStyle}>
            Pesanan
          </NavLink>
          {userData.role === "super_admin" && (
            <NavLink to="/admin/manage" style={linkStyle}>
              Akun Manajemen
            </NavLink>
          )}

          <NavLink to="/calculator" style={linkStyle}>
            Calculator
          </NavLink>
          <AccountCard />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
