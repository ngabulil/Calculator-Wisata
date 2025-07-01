
import { Box, useColorModeValue, Container, Button, Text, HStack, IconButton } from "@chakra-ui/react";
;
import Navbar from "../Admin/Navbar";


const LayoutAdmin = ({ children }) => {
  const bg = useColorModeValue("gray.50", "gray.900");



  return (
    <Box minH="100vh" bg={bg} position="relative">
      <Navbar />
      <Container maxW="7xl" py={3}>
        {children}
      </Container>
     
    </Box>
  );
};

export default LayoutAdmin;
