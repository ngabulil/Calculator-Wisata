import {
  Box,
  Select,
  Input,
  NumberInput,
  NumberInputField,
  Button,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import toastConfig from "../../../../utils/toastConfig";

import {
  apiPostHighSeasons,
  apiPostNormalSeasons,
  apiPostPeakSeasons,
} from "../../../../services/hotelService";
import { useAdminHotelContext } from "../../../../context/Admin/AdminHotelContext";

const AddSeasonCard = (props) => {
  const toast = useToast();

  const { roomTypeSelect } = useAdminHotelContext();

  const [seasonData, setSeasonData] = useState({
    normal: [],
    high: [],
    peak: [],
  });

  const [form, setForm] = useState({
    season: "normal", // normal | high | peak
    id: "",
    label: "",
    price: "",
  });

  const handleAddSeasonPrice = async () => {
    const { season, id, label, price } = form;

    const room = roomTypeSelect.find((r) => r.id === parseInt(id));

    const normalPayload = {
      id_hotel: props.id_hotel,
      id_tipe_room: room.id,
      price: parseInt(price),
    };
    const wLabelPayload = {
      id_hotel: props.id_hotel,
      id_tipe_room: room.id,
      name: label,
      price: parseInt(price),
    };

    try {
      let res;

      if (season == "normal") res = await apiPostNormalSeasons(normalPayload);
      if (season == "high") res = await apiPostHighSeasons(wLabelPayload);
      if (season == "peak") res = await apiPostPeakSeasons(wLabelPayload);

      if (res.status == 201) {
        toast(
          toastConfig(
            "Sukses",
            "Harga per Musim Berhasil Ditambahkan",
            "success"
          )
        );
      } else {
        toast(
          toastConfig("Gagal", "Harga per Musim Gagal Ditambahkan", "error")
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box bg="gray.700" p={4} rounded="md">
      <Text mb={3} fontWeight="bold" color="white">
        Tambah Harga per Musim
      </Text>
      <VStack spacing={3} align="stretch">
        <Select
          value={form.season}
          onChange={(e) => setForm({ ...form, season: e.target.value })}
        >
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="peak">Peak</option>
        </Select>

        <Select
          placeholder="Pilih Room Type"
          value={form.id}
          onChange={(e) => setForm({ ...form, id: e.target.value })}
        >
          {roomTypeSelect.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </Select>

        <Input
          placeholder="Label musim (cth: Lebaran, New Year)"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
        />

        <NumberInput
          value={form.price}
          onChange={(val) => setForm({ ...form, price: val })}
        >
          <NumberInputField placeholder="Harga" />
        </NumberInput>

        <Button colorScheme="teal" onClick={handleAddSeasonPrice}>
          Tambah ke Musim
        </Button>
      </VStack>
    </Box>
  );
};

export default AddSeasonCard;
