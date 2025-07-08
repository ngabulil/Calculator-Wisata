import {
  Box,
  HStack,
  Text,
  IconButton,
  Input,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useState, useEffect, useMemo } from "react";
import { useAkomodasiContext } from "../../context/AkomodasiContext";
import {
  apiDeleteAdditionalAkomodasi,
  apiPostAdditionalAkomodasi,
} from "../../services/akomodasiService";
import { MainSelectCreatableWithDelete } from "../MainSelect";

const InfoCard = ({ index, onDelete, data, onChange, isAdmin }) => {
  const { additional, setAdditional } = useAkomodasiContext();

  const infoOptions = useMemo(
    () =>
      additional.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [additional]
  );

  const inputBg = useColorModeValue("gray.700", "gray.700");
  const borderColor = useColorModeValue("gray.600", "gray.600");
  const textColor = useColorModeValue("white", "white");

  const [selectedInfo, setSelectedInfo] = useState(data.selectedInfo || null);
  const [harga, setHarga] = useState(data.harga || 0);
  const [jumlah, setJumlah] = useState(data.jumlah || 1);

  const total = (isNaN(harga) ? 0 : harga) * (isNaN(jumlah) ? 0 : jumlah);

  useEffect(() => {
    onChange({
      ...data,
      selectedInfo,
      nama: selectedInfo?.label || "",
      harga,
      jumlah,
    });
  }, [selectedInfo, harga, jumlah]);

  // ➕ Handler untuk buat opsi baru (POST ke backend)
  const handleCreate = async (inputValue) => {
    try {
      const created = await apiPostAdditionalAkomodasi({ name: inputValue });
      console.log("Additional baru:", created);

      // Update context
      setAdditional((prev) => [
        ...prev,
        { id: created.result.id, name: created.result.name },
      ]);

      // Pilih langsung
      setSelectedInfo({ value: created.result.id, label: created.result.name });
    } catch (err) {
      console.error("Gagal menambah Additional:", err);
    }
  };

  // ❌ Handler hapus opsi
  const handleDelete = async (id) => {
    try {
      await apiDeleteAdditionalAkomodasi(id);

      setAdditional((prev) => prev.filter((item) => item.id !== id));

      if (selectedInfo?.value === id) {
        setSelectedInfo(null);
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
        {/* Nama Additional */}
        <Box w={isAdmin ? "full" : "50%"}>
          <Text mb={1} fontSize="sm" color="gray.300">
            Nama Additional
          </Text>
          <MainSelectCreatableWithDelete
            options={infoOptions}
            value={selectedInfo}
            onChange={setSelectedInfo}
            placeholder="Pilih atau ketik"
            onCreateOption={handleCreate}
            onDeleteOption={handleDelete}
          />
        </Box>

        {/* Harga */}
        {!isAdmin && (
          <Box w="25%">
            <Text mb={1} fontSize="sm" color="gray.300">
              Harga
            </Text>
            <Input
              value={harga}
              onChange={(e) => setHarga(Number(e.target.value))}
              bg={inputBg}
              color={textColor}
              borderColor={borderColor}
            />
          </Box>
        )}

        {/* Jumlah */}
        {!isAdmin && (
          <Box w={"25%"}>
            <Text mb={1} fontSize="sm" color="gray.300">
              Jumlah
            </Text>
            <Input
              value={jumlah}
              onChange={(e) => setJumlah(Number(e.target.value))}
              bg={inputBg}
              color={textColor}
              borderColor={borderColor}
            />
          </Box>
        )}
      </HStack>

      {/* Total */}
      {!isAdmin && (
        <Box mt={2}>
          <Text fontWeight="semibold" color="green.300">
            Total Harga: Rp {total.toLocaleString("id-ID")}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default InfoCard;
