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
import toastConfig from "../../utils/toastConfig";
import { apiLoginAdmin } from "../../services/adminService";
import { useNavigate } from "react-router-dom";
import { useAdminAuthContext } from "../../context/AuthContext";

const AuthLoginPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { updateToken } = useAdminAuthContext();

  const handleSubmit = async (e) => {
    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));

    e.preventDefault();

    const data = {
      username: username,
      password: password,
    };

    try {
      if (username == "" || password == "") {
        toast.close(loading);
        toast(
          toastConfig(
            "Login Gagal",
            "Username dan Password tidak boleh kosong",
            "error"
          )
        );
      }

      const res = await apiLoginAdmin(data);

      if (res.status === 200) {
        toast.close(loading);
        updateToken(res.result.token);
        toast(
          toastConfig(
            "Login Berhasil",
            "Selamat datang di halaman admin",
            "success",
            () => {
              navigate("/admin/paket");
            }
          )
        );
      } else {
        toast.close(loading);
        toast(
          toastConfig(
            "Login Gagal",
            "Periksa username dan password Anda",
            "error"
          )
        );
      }
    } catch (error) {
      toast.close(loading);
      toast(toastConfig("Login Gagal", error.message, "error"));
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
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
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
