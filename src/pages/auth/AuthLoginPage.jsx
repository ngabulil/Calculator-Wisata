import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useToast,
  VStack,
  Container,
} from "@chakra-ui/react";
import { useState } from "react";

const AuthLoginPage = ({ onLogin }) => {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulasi login - ganti dengan API call bila perlu
    if (email === "admin@example.com" && password === "admin123") {
      toast({
        title: "Login berhasil",
        description: "Selamat datang, Superadmin!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onLogin?.({ role: "superadmin", email });
    } else {
      toast({
        title: "Login gagal",
        description: "Email atau password salah.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      w={"full"}
      h={"100vh"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box w={"30%"} p={8} borderWidth="1px" borderRadius="md" boxShadow="md">
        <Heading mb={6} size="lg" textAlign="center">
          Login Admin
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            <Button bg={"teal.600"} type="submit" width="full">
              Login
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default AuthLoginPage;
