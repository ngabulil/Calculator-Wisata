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
  IconButton,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, CloseIcon } from "@chakra-ui/icons";
import { useEffect, useState, useRef } from "react";
import toastConfig from "../../../../utils/toastConfig";

import {
  apiPostHighSeasons,
  apiPostNormalSeasons,
  apiPostPeakSeasons,
  apiPutHighSeasons,
  apiPutNormalSeasons,
  apiPutPeakSeasons,
  apiDeleteNormalSeasons,
  apiDeleteHighSeasons,
  apiDeletePeakSeasons,
} from "../../../../services/hotelService";
import { useAdminHotelContext } from "../../../../context/Admin/AdminHotelContext";

const AddSeasonCard = (props) => {
  const toast = useToast();
  const { roomTypeSelect, hotelData, getHotel } = useAdminHotelContext();
  const [seasonData, setSeasonData] = useState(hotelData.seasons);
  const [openCreateForm, setOpenCreateForm] = useState(
    props.isEdit ? false : true
  );

  const [form, setForm] = useState({
    season: "normal",
    id: "",
    label: "",
    price: "",
  });
  const [showError, setShowError] = useState(false);

  const seasonRef = useRef(null);
  const priceRef = useRef(null);
  const roomRef = useRef(null);
  const labelRef = useRef(null);

  const handleAddSeasonPrice = async () => {
    const { season, id, label, price } = form;

    setShowError(true);
    if (!season) {
      seasonRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      nameRef.current?.focus();
      return;
    }
    if (!id) {
      roomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      roomRef.current?.focus();
      return;
    }
    if (season != "normal" && !label) {
      labelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      labelRef.current?.focus();
      return;
    }

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
        getHotel(props.id_hotel);
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

  useEffect(() => {
    setSeasonData(hotelData.seasons);
  }, [hotelData]);

  return (
    <Box
      bg="gray.700"
      p={4}
      rounded="md"
      display={"flex"}
      flexDirection={"column"}
      gap={4}
    >
      <Box display={"flex"} justifyContent={"space-between"} w={"full"}>
        <Text mb={3} fontWeight="bold" color="white">
          {props.isEdit ? "Edit Musim" : "Tambah Musim"}
        </Text>
        {
          <IconButton
            icon={<AddIcon />}
            aria-label="Tambah Musim"
            size="sm"
            colorScheme="red"
            onClick={() => setOpenCreateForm(!openCreateForm)}
          />
        }
      </Box>
      {openCreateForm && (
        <VStack spacing={3} align="stretch" bg="gray.600" p={3} rounded="md">
          <Box display={"flex"} justifyContent={"space-between"}>
            <Text fontWeight="bold" color="white">
              Tambah
            </Text>
            {props.isEdit && (
              <IconButton
                icon={<CloseIcon />}
                aria-label="Hapus"
                size="sm"
                color="white"
                variant={"unstyled"}
                background={"red.300"}
                onClick={() => setOpenCreateForm(!openCreateForm)}
              />
            )}
          </Box>
          <FormControl isRequired isInvalid={showError && !form.season}>
            <Select
              ref={seasonRef}
              value={form.season}
              onChange={(e) => setForm({ ...form, season: e.target.value })}
            >
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="peak">Peak</option>
            </Select>
            {showError && !form.season && (
              <FormErrorMessage>Musim wajib dipilih</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={showError && !form.id}>
            <Select
              ref={roomRef}
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
            {showError && !form.id && (
              <FormErrorMessage>Room Type wajib dipilih</FormErrorMessage>
            )}
          </FormControl>

          {form.season != "normal" && (
            <FormControl
              isInvalid={showError && form.season != "normal" && !form.label}
            >
              <Input
                ref={labelRef}
                placeholder="Label musim (cth: Lebaran, New Year)"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
              />
              {showError && form.season != "normal" && !form.label && (
                <FormErrorMessage>Label musim wajib diisi</FormErrorMessage>
              )}
            </FormControl>
          )}

          <FormControl isRequired isInvalid={showError && !form.price}>
            <NumberInput
              ref={priceRef}
              value={form.price}
              onChange={(val) => setForm({ ...form, price: val })}
            >
              <NumberInputField placeholder="Harga" />
            </NumberInput>
            {showError && !form.price && (
              <FormErrorMessage>Harga wajib diisi</FormErrorMessage>
            )}
          </FormControl>

          <Button colorScheme="yellow" onClick={handleAddSeasonPrice}>
            Tambah ke Musim
          </Button>
        </VStack>
      )}
      {props.isEdit &&
        seasonData.normal.map((data) => {
          return (
            <FormEditSeasons
              id_hotel={props.id_hotel}
              roomTypeSelect={roomTypeSelect}
              typeSeason={"normal"}
              seasonData={data}
              onChange={() => getHotel(props.id_hotel)}
            />
          );
        })}
      {props.isEdit &&
        seasonData.high.map((data) => {
          return (
            <FormEditSeasons
              id_hotel={props.id_hotel}
              roomTypeSelect={roomTypeSelect}
              typeSeason={"high"}
              seasonData={data}
              onChange={() => getHotel(props.id_hotel)}
            />
          );
        })}
      {props.isEdit &&
        seasonData.peak.map((data) => {
          return (
            <FormEditSeasons
              id_hotel={props.id_hotel}
              roomTypeSelect={roomTypeSelect}
              typeSeason={"peak"}
              seasonData={data}
              onChange={() => getHotel(props.id_hotel)}
            />
          );
        })}
    </Box>
  );
};

const FormEditSeasons = ({
  id_hotel,
  roomTypeSelect,
  typeSeason = "normal",
  seasonData,
  onChange,
}) => {
  const [form, setForm] = useState({
    season: typeSeason,
    idRoom: seasonData.idRoom,
    label: seasonData.label || "",
    price: seasonData.price,
  });

  const [showError, setShowError] = useState(false);
  const seasonRef = useRef(null);
  const priceRef = useRef(null);
  const roomRef = useRef(null);
  const labelRef = useRef(null);
  const toast = useToast();

  const handleEditForm = async () => {
    const { season, idRoom, label, price } = form;

    setShowError(true);
    if (!season) {
      seasonRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      nameRef.current?.focus();
      return;
    }
    if (!id) {
      roomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      roomRef.current?.focus();
      return;
    }
    if (season != "normal" && !label) {
      labelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      labelRef.current?.focus();
      return;
    }

    const room = roomTypeSelect.find((r) => r.id === parseInt(idRoom));

    const normalPayload = {
      id_hotel: id_hotel,
      id_tipe_room: room.id,
      price: parseInt(price),
    };
    const wLabelPayload = {
      id_hotel: id_hotel,
      id_tipe_room: room.id,
      name: label,
      price: parseInt(price),
    };

    try {
      let res;

      if (season == "normal")
        res = await apiPutNormalSeasons(seasonData.idMusim, normalPayload);
      if (season == "high")
        res = await apiPutHighSeasons(seasonData.idMusim, wLabelPayload);
      if (season == "peak")
        res = await apiPutPeakSeasons(seasonData.idMusim, wLabelPayload);

      if (res.status == 200) {
        toast(
          toastConfig("Sukses", "Harga per Musim Berhasil Dirubah", "success")
        );
        onChange();
      } else {
        toast(toastConfig("Gagal", "Harga per Musim Gagal Dirubah", "error"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteForm = async () => {
    try {
      let res;

      if (typeSeason == "normal")
        res = await apiDeleteNormalSeasons(seasonData.idMusim);
      if (typeSeason == "high")
        res = await apiDeleteHighSeasons(seasonData.idMusim);
      if (typeSeason == "peak")
        res = await apiDeletePeakSeasons(seasonData.idMusim);

      if (res.status == 200) {
        toast(
          toastConfig("Sukses", "Harga per Musim Berhasil Dihapus", "success")
        );
        onChange();
      } else {
        toast(toastConfig("Gagal", "Harga per Musim Gagal Dihapus", "error"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <VStack spacing={3} align="stretch" bg={"gray.600"} p={3} rounded={"12px"}>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Text fontWeight="bold" color="white">
          Edit
        </Text>
        <IconButton
          icon={<DeleteIcon />}
          aria-label="Hapus"
          size="sm"
          color="white"
          variant={"unstyled"}
          background={"red.300"}
          onClick={handleDeleteForm}
        />
      </Box>
      <FormControl isRequired isInvalid={showError && !form.season}>
        <Select
          ref={seasonRef}
          value={form.season}
          isDisabled
          onChange={(e) => setForm({ ...form, season: e.target.value })}
        >
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="peak">Peak</option>
        </Select>
        {showError && !form.season && (
          <FormErrorMessage>Musim wajib dipilih</FormErrorMessage>
        )}
      </FormControl>

      <FormControl isRequired isInvalid={showError && !form.idRoom}>
        <Select
          ref={roomRef}
          placeholder="Pilih Room Type"
          value={form.idRoom}
          onChange={(e) => setForm({ ...form, idRoom: e.target.value })}
        >
          {roomTypeSelect.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </Select>
        {showError && !form.idRoom && (
          <FormErrorMessage>Room Type wajib dipilih</FormErrorMessage>
        )}
      </FormControl>

      {form.season != "normal" && (
        <FormControl
          ref={labelRef}
          isInvalid={showError && form.season != "normal" && !form.label}
        >
          <Input
            placeholder="Label musim (cth: Lebaran, New Year)"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
          />
          {showError && form.season != "normal" && !form.label && (
            <FormErrorMessage>Label musim wajib diisi</FormErrorMessage>
          )}
        </FormControl>
      )}

      <FormControl isRequired isInvalid={showError && !form.price}>
        <NumberInput
          ref={priceRef}
          value={form.price}
          onChange={(val) => setForm({ ...form, price: val })}
        >
          <NumberInputField placeholder="Harga" />
        </NumberInput>
        {showError && !form.price && (
          <FormErrorMessage>Harga wajib diisi</FormErrorMessage>
        )}
      </FormControl>

      <Button colorScheme="red" onClick={handleEditForm}>
        Edit Musim
      </Button>
    </VStack>
  );
};

export default AddSeasonCard;
