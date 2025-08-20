import {
  Box,
  Text,
  Input,
  NumberInput,
  NumberInputField,
  Button,
  useToast,
  HStack,
  IconButton,
  Flex,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon, DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useState, useRef } from "react";
import { useAdminHotelContext } from "../../../../context/Admin/AdminHotelContext";
import {
  apiPostHotelRooms,
  apiPutHotelRooms,
  apiDeleteHotelRooms,
} from "../../../../services/hotelService";
import toastConfig from "../../../../utils/toastConfig";

const AddRoomTypeCard = (props) => {
  const toast = useToast();
  const { getRoomTypeSelect } = useAdminHotelContext();

  const [showError, setShowError] = useState(false);

  const roomRef = useRef(null);
  const nameRef = useRef(null);
  const validRef = useRef(null);

  const isEdit = props.isEdit;
  const id_hotel = props.id_hotel;

  const handleGetRoomTypeSelect = async () => {
    const res = await getRoomTypeSelect(id_hotel);
    setRoomList(res.filter((room) => room.id_hotel === id_hotel));
  };

  const [roomList, setRoomList] = useState(
    isEdit && props.roomType?.length
      ? props.roomType.map((room) => ({
          idRoom: room.id,
          name: room.label,
          extrabed_price: room.extrabed_price || "",
          contract_limit: room.contract_limit || "",
          id_hotel,
        }))
      : [
          {
            name: "",
            extrabed_price: "",
            contract_limit: "",
            id_hotel,
          },
        ]
  );

  const handleAddNewForm = () => {
    setRoomList((prev) => [
      ...prev,
      {
        name: "",
        extrabed_price: "",
        contract_limit: "",
        id_hotel,
      },
    ]);
  };

  const handleFieldChange = (index, field, value) => {
    const newList = [...roomList];
    newList[index][field] = value;
    setRoomList(newList);
  };

  const handleSaveRoom = async (room) => {
    setShowError(true);

    if (!room.name) {
      nameRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      nameRef.current?.focus();
      return;
    }
    if (!room.extrabed_price) {
      roomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      vendorRef.current?.focus();
      return;
    }
    if (!room.contract_limit) {
      validRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      validRef.current?.focus();
      return;
    }

    try {
      let res;
      if (isEdit && room.id) {
        res = await apiPutHotelRooms(room.id, room);
      } else {
        res = await apiPostHotelRooms(room);
      }

      if (res.status === 201 || res.status === 200) {
        toast(
          toastConfig(
            "Sukses",
            isEdit
              ? "Tipe kamar berhasil diperbarui"
              : "Tipe kamar berhasil dibuat",
            "success"
          )
        );
        await handleGetRoomTypeSelect(); // refresh
      } else {
        toast(toastConfig("Gagal", "Gagal menyimpan tipe kamar", "error"));
      }
    } catch (error) {
      console.error(error);
      toast(toastConfig("Error", "Terjadi kesalahan server", "error"));
    }
  };

  const handleDeleteRoom = async (room, index) => {
    if (isEdit && room.id) {
      try {
        const res = await apiDeleteHotelRooms(room.id);
        if (res.status === 200) {
          toast(
            toastConfig("Sukses", "Tipe kamar berhasil dihapus", "success")
          );
          await handleGetRoomTypeSelect();
        } else {
          toast(toastConfig("Gagal", "Gagal menghapus tipe kamar", "error"));
        }
      } catch (error) {
        console.error(error);
        toast(toastConfig("Error", "Terjadi kesalahan saat hapus", "error"));
      }
    } else {
      const newList = [...roomList];
      newList.splice(index, 1);
      setRoomList(newList);
    }
  };

  useEffect(() => {
    if (isEdit) {
      handleGetRoomTypeSelect();
    }
  }, [isEdit]);

  return (
    <Box bg="gray.700" p={4} rounded="md" mb={4}>
      <HStack justify="space-between" mb={2}>
        <Text fontWeight="bold" fontSize="18px" color="white">
          {isEdit ? "Edit Tipe Kamar" : "Tambah Tipe Kamar"}
        </Text>
        <IconButton
          icon={<AddIcon />}
          aria-label="Tambah Tipe Kamar"
          size="sm"
          colorScheme="green"
          onClick={handleAddNewForm}
        />
      </HStack>

      {roomList.map((room, index) => (
        <Box
          key={index}
          bg="gray.600"
          p={3}
          rounded="md"
          mb={4}
          display={"flex"}
          gap={2}
          flexDirection={"column"}
        >
          <Flex p={"0.2"} w={"full"} justifyContent={"space-between"}>
            <Text fontWeight={"bold"}>Room Type</Text>
            {
              <IconButton
                icon={isEdit ? <DeleteIcon /> : <CloseIcon />}
                aria-label="Hapus"
                size="sm"
                color="white"
                variant={"unstyled"}
                background={"red.300"}
                onClick={() => handleDeleteRoom(room, index)}
              />
            }
          </Flex>

          <FormControl isRequired isInvalid={showError && !room.name}>
            <Input
              ref={nameRef}
              placeholder="Nama tipe kamar"
              size="sm"
              mb={2}
              value={room.name}
              onChange={(e) => handleFieldChange(index, "name", e.target.value)}
            />
            {showError && !room.name && (
              <FormErrorMessage>Nama tipe kamar wajib diisi</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={showError && !room.extrabed_price}>
            <NumberInput
              ref={roomRef}
              size="sm"
              mb={2}
              value={room.extrabed_price}
              onChange={(val) =>
                handleFieldChange(index, "extrabed_price", parseInt(val))
              }
            >
              <NumberInputField placeholder="Harga extrabed" />
            </NumberInput>
            {showError && !room.extrabed_price && (
              <FormErrorMessage>Harga extrabed wajib diisi</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={showError && !room.contract_limit}>
            <Input
              type="date"
              size="sm"
              mb={2}
              value={room.contract_limit}
              onChange={(e) =>
                handleFieldChange(index, "contract_limit", e.target.value)
              }
            />
            {showError && !room.contract_limit && (
              <FormErrorMessage>Batas kontrak wajib diisi</FormErrorMessage>
            )}
          </FormControl>

          <Button
            size="sm"
            mt={2}
            w="full"
            colorScheme="teal"
            onClick={() => handleSaveRoom(room, index)}
          >
            {isEdit ? "Simpan Perubahan" : "Simpan Tipe Kamar"}
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default AddRoomTypeCard;
