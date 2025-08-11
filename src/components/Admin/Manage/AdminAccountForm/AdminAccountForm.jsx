import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Text,
  Button,
  FormLabel,
  Container,
  useToast,
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

  const handleAdminSetValue = () => {
    setName(adminData.name);
    setUsername(adminData.username);
  };

  const handleAdminCreate = async () => {
    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));
    const data = {
      name: name,
      username: username,
      password: password,
    };

    try {
      const res = await apiPostAdmin(data);

      if (res.status === 201) {
        toast.close(loading);
        toast(
          toastConfig(
            "Admin Created",
            "Admin Berhasil Ditambahkan!",
            "success",
            props.onChange
          )
        );
      } else {
        toast.close(loading);
        toast(toastConfig("Create Failed", "Admin Gagal Ditambahkan", "error"));
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.close(loading);

      toast(toastConfig("Create Failed", "Admin Gagal Ditambahkan", "error"));
    }
  };

  const handleAdminAccountUpdate = async () => {
    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));
    const data = {
      name: name,
      username: username,
    };

    for (const [key, value] of Object.entries(data)) {
      if (value === "") {
        toast.close(loading);
        toast(toastConfig("Input Error", `${key} tidak boleh kosong`, "error"));
        return;
      }
    }

    try {
      const res = await apiPutAdmin(adminData.id, data);

      if (res.status === 200) {
        toast.close(loading);
        toast(
          toastConfig(
            "Admin Update",
            "Admin Berhasil Diubah!",
            "success",
            props.onChange
          )
        );
      } else {
        toast.close(loading);
        toast(toastConfig("Update Failed", "Admin Gagal Diubah", "error"));
      }
      // eslint-disable-next-line no-unused-vars
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
        {editFormActive ? "Edit Admin Akun " : "Create Admin Akun"}
      </Text>
      <Box mb={4}>
        <FormLabel>Nama </FormLabel>
        <Input
          placeholder="Contoh: John Doe"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </Box>
      <Box mb={4}>
        <FormLabel>Username</FormLabel>
        <Input
          placeholder="Contoh: johndoe"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
      </Box>
      {!editFormActive && (
        <Box mb={4}>
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="Contoh: johndoe123"
            value={password}
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
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
