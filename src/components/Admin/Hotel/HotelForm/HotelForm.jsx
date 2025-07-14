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
import { useAdminHotelContext } from "../../../../context/Admin/AdminHotelContext";
import { apiPostHotel, apiPutHotel } from "../../../../services/hotelService";
import toastConfig from "../../../../utils/toastConfig";
import { useToast } from "@chakra-ui/react";
import AddRoomTypeCard from "../HotelFormCard/AddRoomTypeCard";
import AddSeasonCard from "../HotelFormCard/AddSeasonCard";

const predefinedStars = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
];

const HotelForm = () => {
  const toast = useToast();
  const location = useLocation();
  const { hotelData } = useAdminHotelContext();
  const [stars, setStars] = useState(1);
  const [photoLink, setPhotoLink] = useState("");

  //
  const [hotelName, setHotelName] = useState("");

  // fetch create
  const [editFormActive, setEditFormActive] = useState(false);
  const [hotelAvailable, setHotelAvailable] = useState(false);
  const [hotelCreateId, setHotelCreateId] = useState(null);

  const handleHotelSetValue = () => {
    setHotelName(hotelData.hotelName || "");
    setStars(hotelData.stars || 1);

    setPhotoLink(hotelData.photoLink || "");
  };

  const handleHotelCreate = async () => {
    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));
    const data = {
      name: hotelName,
      star: stars,
      link_photo: photoLink,
    };

    try {
      const res = await apiPostHotel(data);

      if (res.status == 201) {
        toast.close(loading);
        toast(
          toastConfig("Hotel Created", "Hotel Berhasil Ditambahkan!", "success")
        );

        setHotelAvailable(true);
        setHotelCreateId(res.result.id);
      } else {
        toast.close(loading);
        toast(toastConfig("Hotel Failed", "Hotel Gagal Ditambahkan", "error"));
        setHotelAvailable(false);
      }
    } catch (error) {
      toast.close(loading);
      console.log(error);
      setHotelAvailable(false);
    }
  };

  const handleHotelUpdate = async () => {
    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));
    const data = {
      name: hotelName,
      star: stars,
      link_photo: photoLink,
    };

    try {
      const res = await apiPutHotel(hotelData.id, data);

      if (res.status == 200) {
        toast.close(loading);
        toast(toastConfig("Edit Hotel", "Hotel Berhasil Diedit!", "success"));

        setHotelAvailable(true);
        setHotelCreateId(res.result.id);
      } else {
        toast.close(loading);
        toast(toastConfig("Edit Hotel", "Hotel Gagal Diedit!", "error"));
        setHotelAvailable(false);
      }
    } catch (error) {
      toast.close(loading);
      console.log(error);
      setHotelAvailable(false);
    }
  };

  useEffect(() => {
    if (location.pathname.includes("edit")) {
      setEditFormActive(true);
      handleHotelSetValue();
    }
  }, [location.pathname, hotelData]);

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
        {editFormActive ? "Edit Hotel" : "Create Hotel"}
      </Text>
      <Box mb={4}>
        <FormLabel>Hotel Name</FormLabel>
        <Input
          placeholder="Contoh: Hotel Bintang Bali"
          value={hotelName}
          onChange={(e) => {
            setHotelName(e.target.value);
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
        onClick={editFormActive ? handleHotelUpdate : handleHotelCreate}
      >
        {editFormActive ? "Update Hotel" : "Create Hotel"}
      </Button>
      {hotelAvailable && (
        <AddRoomTypeCard
          id_hotel={hotelCreateId}
          isEdit={editFormActive}
          roomType={hotelData.roomType}
        />
      )}
      {hotelAvailable && (
        <AddSeasonCard id_hotel={hotelCreateId} isEdit={editFormActive} />
      )}
    </Container>
  );
};

export default HotelForm;
