import {
  Box,
  HStack,
  Text,
  IconButton,
  Input,
  NumberInput,
  NumberInputField,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { useEffect, useState, useMemo } from "react";
import { MainSelectCreatableWithDelete } from "../../../MainSelect";
import { useAdminPackageContext } from "../../../../context/Admin/AdminPackageContext";

const RoomCard = ({ index, data, onChange, onDelete }) => {
  const { roomTypeSelect, setRoomTypeSelect } = useAdminPackageContext();

  const [selectedRoom, setSelectedRoom] = useState(data.selectedRoom || null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: "",
    extrabed_price: "",
    contract_limit: "",
    id_hotel: 1, // Bisa kamu ganti jadi dropdown jika diperlukan
  });

  const textColor = useColorModeValue("white", "white");

  const roomOptions = useMemo(() => {
    return roomTypeSelect.map((room) => ({
      value: room.idRoom,
      label: room.label,
    }));
  }, [roomTypeSelect]);

  useEffect(() => {
    onChange({
      ...data,
      selectedRoom,
      idRoom: selectedRoom?.value,
    });
  }, [selectedRoom]);

  const handleCreateRoom = () => {
    const newId = Date.now(); // Atau kamu bisa pakai ID dari backend nantinya
    const createdRoom = {
      idRoom: newId,
      label: newRoom.name,
      ...newRoom,
    };

    // Tambahkan ke context
    setRoomTypeSelect((prev) => [...prev, createdRoom]);

    // Pilih room baru sebagai selected
    setSelectedRoom({ value: newId, label: newRoom.name });

    // Reset form dan tutup
    setNewRoom({
      name: "",
      extrabed_price: "",
      contract_limit: "",
      id_hotel: 1,
    });
    setShowCreateForm(false);
  };

  return (
    <Box bg="gray.600" p={4} rounded="md">
      <HStack justify="space-between" mb={3}>
        <Text fontWeight="bold" color={textColor}>
          Tipe Kamar {index + 1}
        </Text>
        <HStack spacing={2}>
          <IconButton
            size="xs"
            icon={<AddIcon />}
            colorScheme="green"
            variant="ghost"
            aria-label="Tambah Room"
            onClick={() => setShowCreateForm((prev) => !prev)}
          />
          <IconButton
            size="xs"
            icon={<DeleteIcon />}
            colorScheme="red"
            variant="ghost"
            aria-label="Hapus Tipe Kamar"
            onClick={onDelete}
          />
        </HStack>
      </HStack>

      {/* Form Create Room */}
      {showCreateForm && (
        <Box mb={4} p={3} bg="gray.700" rounded="md">
          <Text fontSize="sm" color="gray.300" mb={2}>
            Tambah Tipe Kamar Baru
          </Text>
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
            value={newRoom.contract_limit}
            onChange={(e) =>
              setNewRoom({ ...newRoom, contract_limit: e.target.value })
            }
          />
          <Button size="sm" colorScheme="green" onClick={handleCreateRoom}>
            Simpan Tipe Kamar
          </Button>
        </Box>
      )}

      {/* Pilih Tipe Kamar */}
      <Box mb={3}>
        <Text fontSize="sm" color="gray.300" mb={1}>
          Pilih Tipe Kamar
        </Text>
        <MainSelectCreatableWithDelete
          options={roomOptions}
          value={selectedRoom}
          onChange={setSelectedRoom}
          placeholder="Pilih tipe kamar"
        />
      </Box>
    </Box>
  );
};

export default RoomCard;
