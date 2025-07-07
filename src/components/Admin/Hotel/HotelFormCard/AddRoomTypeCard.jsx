import {
  Box,
  Text,
  Input,
  NumberInput,
  NumberInputField,
  Button,
  useToast,
} from "@chakra-ui/react";

import { useState } from "react";
import { useAdminHotelContext } from "../../../../context/Admin/AdminHotelContext";
import { apiPostHotelRooms } from "../../../../services/hotelService";
import toastConfig from "../../../../utils/toastConfig";

const AddRoomTypeCard = (props) => {
  const toast = useToast();
  const { getRoomTypeSelect } = useAdminHotelContext();

  const [newRoom, setNewRoom] = useState({
    name: "",
    extrabed_price: "",
    contract_limit: "",
    id_hotel: 1,
  });

  const handleCreateRoom = async () => {
    const createdRoom = {
      id_hotel: props.id_hotel,
      name: newRoom.name,
      extrabed_price: newRoom.extrabed_price,
      contract_limit: newRoom.contract_limit,
    };

    try {
      const res = await apiPostHotelRooms(createdRoom);
      if (res.status == 201) {
        toast(toastConfig("Sukses", "Tipe Kamar Berhasil Dibuat", "success"));
        await getRoomTypeSelect(props.id_hotel);
      } else {
        toast(toastConfig("Gagal", "Tipe Kamar Gagal Dibuat", "error"));
      }
    } catch (error) {
      console.log(error);
      toast(toastConfig("Gagal", "Tipe Kamar Gagal Dibuat", "error"));
    }
  };

  return (
    <Box bg="gray.700" p={4} rounded="md" mb={4}>
      <Text fontWeight={"bold"} fontSize={"18px"}>
        Room Type
      </Text>
      <Box mt={2}>
        <Input
          placeholder="Nama tipe kamar"
          size="sm"
          mb={2}
          value={newRoom.name}
          onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
        />
        <NumberInput
          size="sm"
          mb={2}
          value={newRoom.extrabed_price}
          onChange={(val) =>
            setNewRoom({ ...newRoom, extrabed_price: parseInt(val) })
          }
        >
          <NumberInputField placeholder="Harga extrabed" />
        </NumberInput>
        <Input
          type="date"
          size="sm"
          mb={2}
          value={newRoom.dateValue}
          onChange={(e) => {
            setNewRoom({
              ...newRoom,
              contract_limit: new Date(e.target.value).toISOString(),
              dateValue: e.target.value,
            });
          }}
        />
        <Button
          size="sm"
          mt={10}
          w={"full"}
          colorScheme="green"
          onClick={handleCreateRoom}
        >
          Simpan Tipe Kamar
        </Button>
      </Box>
    </Box>
  );
};

export default AddRoomTypeCard;
