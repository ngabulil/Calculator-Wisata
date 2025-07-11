import {
  Box,
  HStack,
  Text,
  IconButton,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useMemo } from "react";
import {
  apiDeleteAdditionalMobil,
  apiPostAdditionalMobil,
} from "../../../services/transport";
import { MainSelectCreatableWithDelete } from "../../MainSelect";
import { useTransportContext } from "../../../context/TransportContext";

const InfoCard = ({ index, onDelete, data, onChange, dayIndex }) => {
  const { additional, setAdditional } = useTransportContext();

  const infoOptions = useMemo(
    () =>
      additional.map((item) => ({
        value: item.id,
        label: item.name,
        defaultPrice: item.price || 0,
      })),
    [additional]
  );

  const inputBg = useColorModeValue("gray.700", "gray.700");
  const borderColor = useColorModeValue("gray.600", "gray.600");
  const textColor = useColorModeValue("white", "white");

  const selectedInfo = useMemo(() => {
    return (
      data.selectedInfo ||
      infoOptions.find((opt) => opt.value === data.id_additional) ||
      null
    );
  }, [data.selectedInfo, data.id_additional, infoOptions]);

  const harga = data.harga ?? 0;
  const jumlah = data.jumlah ?? 1;
  const total = harga * jumlah;

  const handleUpdate = (fields) => {
    const updated = { ...data, ...fields };
    if (fields.selectedInfo) {
      updated.nama = fields.selectedInfo.label;
      updated.id_additional = fields.selectedInfo.value;
      if ((data.harga === undefined || data.harga === 0) && fields.selectedInfo.defaultPrice) {
        updated.harga = fields.selectedInfo.defaultPrice;
      }
    }
    onChange(updated);
  };

  useEffect(() => {
    if (!data.selectedInfo && data.id_additional) {
      const found = infoOptions.find((opt) => opt.value === data.id_additional);
      if (found) {
        handleUpdate({
          selectedInfo: found,
          id_additional: found.value,
          nama: found.label,
          harga: data.harga > 0 ? data.harga : found.defaultPrice || 0,
        });
      }
    }
  }, [data.selectedInfo, data.id_additional, infoOptions, dayIndex]);

  useEffect(() => {
    if (
      selectedInfo &&
      data.id_additional &&
      (data.harga === undefined || data.harga === 0)
    ) {
      handleUpdate({
        harga: selectedInfo.defaultPrice || 0,
      });
    }
  }, [selectedInfo, dayIndex]);

  const handleCreate = async (inputValue) => {
    try {
      const created = await apiPostAdditionalMobil({ name: inputValue });
      setAdditional((prev) => [
        ...prev,
        { id: created.result.id, name: created.result.name },
      ]);

      handleUpdate({
        selectedInfo: { value: created.result.id, label: created.result.name },
        id_additional: created.result.id,
        nama: created.result.name,
      });
    } catch (err) {
      console.error("Gagal menambah Additional:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiDeleteAdditionalMobil(id);
      setAdditional((prev) => prev.filter((item) => item.id !== id));

      if (selectedInfo?.value === id) {
        handleUpdate({ selectedInfo: null, id_additional: null, nama: "" });
      }
    } catch (err) {
      console.error("Gagal hapus:", err);
    }
  };

  return (
    <Box bg="gray.600" p={4} rounded="md">
      <HStack justify="space-between" mb={3}>
        <Text fontWeight="bold" color={textColor}>
          Additional {index + 1}
        </Text>
        <IconButton
          size="xs"
          icon={<DeleteIcon />}
          colorScheme="red"
          variant="ghost"
          aria-label="Hapus Info"
          onClick={onDelete}
        />
      </HStack>

      <HStack spacing={4} mb={3}>
        <Box w="50%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Nama Additional
          </Text>
          <MainSelectCreatableWithDelete
            options={infoOptions}
            value={selectedInfo}
            onChange={(val) =>
              handleUpdate({ selectedInfo: val, id_additional: val?.value })
            }
            placeholder="Pilih atau ketik"
            onCreateOption={handleCreate}
            onDeleteOption={handleDelete}
          />
        </Box>

        <Box w="25%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Harga
          </Text>
          <Input
            value={harga}
            onChange={(e) => handleUpdate({ harga: Number(e.target.value) })}
            bg={inputBg}
            color={textColor}
            borderColor={borderColor}
          />
        </Box>

        <Box w="25%">
          <Text mb={1} fontSize="sm" color="gray.300">
            Jumlah
          </Text>
          <Input
            value={jumlah}
            onChange={(e) => handleUpdate({ jumlah: Number(e.target.value) })}
            bg={inputBg}
            color={textColor}
            borderColor={borderColor}
          />
        </Box>
      </HStack>

      <Box mt={2}>
        <Text fontWeight="semibold" color="green.300">
          Total Harga: Rp {total.toLocaleString("id-ID")}
        </Text>
      </Box>
    </Box>
  );
};

export default InfoCard;
