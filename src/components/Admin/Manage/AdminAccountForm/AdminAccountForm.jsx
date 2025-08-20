import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Input,
  Text,
  Button,
  FormLabel,
  Container,
  useToast,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { apiPostAdmin, apiPutAdmin } from "../../../../services/adminService";
import toastConfig from "../../../../utils/toastConfig";
import { useAdminManageContext } from "../../../../context/Admin/AdminManageContext";

const AdminFormPage = (props) => {
  const location = useLocation();
  const toast = useToast();
  const { adminData } = useAdminManageContext();
  const [editFormActive, setEditFormActive] = useState(false);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    username: "",
    password: "",
  });

  // Refs untuk scroll ke input error
  const nameRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleAdminSetValue = () => {
    setName(adminData.name || "");
    setUsername(adminData.username || "");
  };

  const validateForm = () => {
    const newErrors = { name: "", username: "", password: "" };
    if (!name.trim()) newErrors.name = "Nama tidak boleh kosong";
    if (!username.trim()) newErrors.username = "Username tidak boleh kosong";
    if (!editFormActive && !password.trim())
      newErrors.password = "Password tidak boleh kosong";

    setErrors(newErrors);
    return newErrors;
  };

  const scrollToFirstError = (newErrors) => {
    if (newErrors.name && nameRef.current) {
      nameRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (newErrors.username && usernameRef.current) {
      usernameRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    if (newErrors.password && passwordRef.current) {
      passwordRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
  };

  const handleAdminCreate = async () => {
    const newErrors = validateForm();
    if (newErrors.name || newErrors.username || newErrors.password) {
      scrollToFirstError(newErrors);
      return;
    }

    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));
    const data = { name, username, password };

    try {
      const res = await apiPostAdmin(data);
      toast.close(loading);

      if (res.status === 201) {
        toast(
          toastConfig(
            "Admin Created",
            "Admin Berhasil Ditambahkan!",
            "success",
            props.onChange
          )
        );
      } else {
        toast(toastConfig("Create Failed", "Admin Gagal Ditambahkan", "error"));
      }
    } catch (error) {
      toast.close(loading);
      toast(toastConfig("Create Failed", "Admin Gagal Ditambahkan", "error"));
    }
  };

  const handleAdminAccountUpdate = async () => {
    const newErrors = validateForm();
    if (newErrors.name || newErrors.username) {
      scrollToFirstError(newErrors);
      return;
    }

    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));
    const data = { name, username };

    try {
      const res = await apiPutAdmin(adminData.id, data);
      toast.close(loading);

      if (res.status === 200) {
        toast(
          toastConfig(
            "Admin Update",
            "Admin Berhasil Diubah!",
            "success",
            props.onChange
          )
        );
      } else {
        toast(toastConfig("Update Failed", "Admin Gagal Diubah", "error"));
      }
    } catch (error) {
      toast.close(loading);
      toast(toastConfig("Update Failed", "Admin Gagal Diubah", "error"));
    }
  };

  useEffect(() => {
    if (location.pathname.includes("edit")) {
      setEditFormActive(true);
      handleAdminSetValue();
    }
  }, [location.pathname, adminData]);

  return (
    <Container
      maxW="5xl"
      p={6}
      bg={"gray.800"}
      rounded={"12px"}
      display={"flex"}
      flexDirection={"column"}
      gap={2}
    >
      <Text fontSize="24px" fontWeight={"bold"}>
        {editFormActive ? "Edit Admin Akun" : "Create Admin Akun"}
      </Text>

      {/* Nama */}
      <Box mb={4} ref={nameRef}>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Nama</FormLabel>
          <Input
            placeholder="Contoh: John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>
      </Box>

      {/* Username */}
      <Box mb={4} ref={usernameRef}>
        <FormControl isInvalid={!!errors.username}>
          <FormLabel>Username</FormLabel>
          <Input
            placeholder="Contoh: johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FormErrorMessage>{errors.username}</FormErrorMessage>
        </FormControl>
      </Box>

      {/* Password hanya saat create */}
      {!editFormActive && (
        <Box mb={4} ref={passwordRef}>
          <FormControl isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Contoh: johndoe123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>
        </Box>
      )}

      <Button
        w={"full"}
        bg={"teal.600"}
        onClick={editFormActive ? handleAdminAccountUpdate : handleAdminCreate}
      >
        {editFormActive ? "Update Admin Akun" : "Create Admin Data"}
      </Button>
    </Container>
  );
};

export default AdminFormPage;
