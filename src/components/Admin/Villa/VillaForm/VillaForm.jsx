import {
  Container,
  Box,
  Select,
  FormLabel,
  Input,
  Text,
  VStack,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAdminVillaContext } from "../../../../context/Admin/AdminVillaContext";
import toastConfig from "../../../../utils/toastConfig";
import { useToast } from "@chakra-ui/react";
import { apiPostVilla, apiPutVilla } from "../../../../services/villaService";
import AddRoomTypeCard from "../VillaFormCard/AddRoomTypeCard";
import AddSeasonCard from "../VillaFormCard/AddSeasonsCard";

const predefinedStars = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
];

const VillaForm = () => {
  const location = useLocation();
  const { villaData } = useAdminVillaContext();
  const toast = useToast();
  //
  const [editFormActive, setEditFormActive] = useState(false);
  const [villaAvailable, setVillaAvailable] = useState(false);
  const [villaCreateId, setVillaCreateId] = useState(null);
  //
  const [stars, setStars] = useState(1);

  const [villaName, setVillaName] = useState("");
  const [photoLink, setPhotoLink] = useState("");

  const handleVillaSetValue = () => {
    setVillaName(villaData.villaName || "");
    setStars(villaData.stars || 1);

    setPhotoLink(villaData.photoLink || "");
  };

  const handleVillaCreate = async () => {
    const data = {
      name: villaName,
      star: stars,
      link_photo: photoLink,
    };
    try {
      const res = await apiPostVilla(data);

      if (res.status == 201) {
        toast(
          toastConfig("Hotel Created", "Hotel Berhasil Ditambahkan!", "success")
        );

        setVillaAvailable(true);
        setVillaCreateId(res.result.id);
      } else {
        toast(toastConfig("Villa Failed", "Villa Gagal Ditambahkan", "error"));
        setVillaAvailable(false);
      }
    } catch (error) {
      console.log(error);
      setVillaAvailable(false);
    }
  };

  const handleVillaUpdate = async () => {
    const data = {
      name: villaName,
      star: stars,
      link_photo: photoLink,
    };

    try {
      const res = await apiPutVilla(villaData.id, data);

      if (res.status == 200) {
        toast(toastConfig("Edit Villa", "Hotel Berhasil Diedit!", "success"));

        setVillaAvailable(true);
        setVillaCreateId(res.result.id);
      } else {
        toast(toastConfig("Edit Villa", "Villa Gagal Diedit!", "error"));
        setVillaAvailable(false);
      }
    } catch (error) {
      console.log(error);
      setVillaAvailable(false);
    }
  };

  useEffect(() => {
    if (location.pathname.includes("edit")) {
      setEditFormActive(true);
      handleVillaSetValue();
    }
  }, [location.pathname, villaData]);
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
        {editFormActive ? "Edit Villa" : "Create Villa"}
      </Text>
      <Box mb={4}>
        <FormLabel>Villa Name</FormLabel>
        <Input
          placeholder="Contoh: Villa Bintang Bali"
          value={villaName}
          onChange={(e) => {
            setVillaName(e.target.value);
          }}
        />
      </Box>
      <Box mb={4}>
        <FormLabel>Link Hotel Photos</FormLabel>
        <Input
          placeholder="Contoh: https://picsum.photos/id/237/200/300 "
          value={photoLink}
          onChange={(e) => {
            setPhotoLink(e.target.value);
          }}
        />
      </Box>
      <Box mb={4}>
        <FormLabel>Stars</FormLabel>
        <Select value={stars} onChange={(e) => setStars(e.target.value)}>
          {predefinedStars.map((p, idx) => (
            <option key={idx} value={p.value}>
              {p.label}
            </option>
          ))}
        </Select>
      </Box>

      <Button
        w={"full"}
        bg={"blue.500"}
        onClick={editFormActive ? handleVillaUpdate : handleVillaCreate}
      >
        {editFormActive ? "Update Villa" : "Create Villa"}
      </Button>
      {villaAvailable && (
        <AddRoomTypeCard
          id_villa={villaCreateId}
          isEdit={editFormActive}
          roomType={villaData.roomType}
        />
      )}
      {villaAvailable && (
        <AddSeasonCard id_villa={villaCreateId} isEdit={editFormActive} />
      )}
    </Container>
  );
};

export default VillaForm;
