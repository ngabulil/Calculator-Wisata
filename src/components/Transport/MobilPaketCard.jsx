import {
  Box,
  HStack,
  Text,
  IconButton,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  useMemo,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import MainSelect, { MainSelectCreatable } from "../MainSelect";
import { useTransportContext } from "../../context/TransportContext";
import TransportFormModal from "./TransportModal/MobilModal";
import { useAdminTransportContext } from "../../context/Admin/AdminTransportContext";

const MobilCard = forwardRef(
  ({ index, onDelete, data, onChange, isAdmin, onModalClose }, ref) => {
    const { mobils } = useTransportContext();
    const { updateMobilModalData } = useAdminTransportContext();
    const [jumlah, setJumlah] = useState(data.jumlah || 1);
    const [openModal, setOpenModal] = useState(false);

    const wrapperRef = useRef(null);

    const [errors, setErrors] = useState({});

    const validateAll = () => {
      const newErrors = {};

      if (index != null) {
        if (!data.mobil) newErrors.mobil = "Mobil harus dipilih";
        if (!data.kategori) newErrors.category = "Kategori harus dipilih";
        if (!data.area) newErrors.area = "Area harus dipilih";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    // expose fungsi ke parent
    useImperativeHandle(ref, () => ({
      validate: validateAll,
      scroll: () => {
        wrapperRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      },
    }));

    const inputBg = useColorModeValue("gray.700", "gray.700");
    const borderColor = useColorModeValue("gray.600", "gray.600");
    const textColor = useColorModeValue("white", "white");

    const selectedMobil = useMemo(() => {
      return mobils.find((m) => m.id === data.mobil?.value);
    }, [data.mobil, mobils]);

    const kategoriOptions = useMemo(() => {
      if (!selectedMobil) return [];

      const kategoriLabelMap = {
        fullDay: "Full Day",
        halfDay: "Half Day",
        inOut: "In Out",
        menginap: "Menginap",
      };

      return Object.keys(selectedMobil.keterangan).map((kategori) => ({
        value: kategori,
        label: kategoriLabelMap[kategori] || kategori,
      }));
    }, [selectedMobil]);

    const areaOptions = useMemo(() => {
      if (!selectedMobil || !data.kategori) return [];

      return (
        selectedMobil.keterangan[data.kategori]?.map((area) => ({
          value: area.area,
          label: area.area,
          id: area.id_area,
        })) || []
      );
    }, [selectedMobil, data.kategori]);

    const harga = useMemo(() => {
      if (!selectedMobil || !data.kategori || !data.area) return 0;
      const found = selectedMobil.keterangan[data.kategori]?.find(
        (a) => a.area === data.area
      );
      return found?.price || 0;
    }, [selectedMobil, data.kategori, data.area]);

    useEffect(() => {
      const timer = setTimeout(() => {
        onChange({
          ...data,
          jumlah,
          harga,
        });
      }, 500);

      return () => clearTimeout(timer);
    }, [jumlah, harga]);

    return (
      <Box bg="gray.600" p={4} rounded="md" ref={wrapperRef}>
        <HStack justify="space-between" mb={3}>
          <Text fontWeight="bold" color={textColor}>
            Mobil {index + 1}
          </Text>
          <IconButton
            size="xs"
            icon={<DeleteIcon />}
            colorScheme="red"
            variant="ghost"
            aria-label="Hapus Mobil"
            onClick={onDelete}
          />
        </HStack>

        <HStack spacing={4} mb={3}>
          <Box w="50%">
            <Text mb={1} fontSize="sm" color="gray.300">
              Pilih Mobil
            </Text>
            <MainSelectCreatable
              options={mobils.map((m) => ({
                value: m.id,
                label: m.jenisKendaraan,
              }))}
              value={data.mobil}
              onChange={(val) => {
                onChange({
                  mobil: val,
                  kategori: null,
                  area: null,
                  harga: 0,
                  jumlah: 1,
                  id_area: null,
                });

                setJumlah(1);

                if (val.__isNew__) {
                  setOpenModal(true);
                  updateMobilModalData({ name: val.value });
                }
              }}
              placeholder="Pilih Mobil"
              isError={errors.mobil}
            />
            {errors.mobil && (
              <Text fontSize="xs" color="red.300" mt={1}>
                {errors.mobil}
              </Text>
            )}
          </Box>

          <Box w="50%">
            <Text mb={1} fontSize="sm" color="gray.300">
              Kategori
            </Text>
            <MainSelect
              options={kategoriOptions}
              value={kategoriOptions.find((k) => k.value === data.kategori)}
              onChange={(val) => {
                onChange({
                  ...data,
                  kategori: val?.value,
                  area: null,
                  id_area: null,
                });
              }}
              isDisabled={!data.mobil}
              placeholder="Pilih Kategori"
              isError={errors.category}
            />
            {errors.category && (
              <Text fontSize="xs" color="red.300" mt={1}>
                {errors.category}
              </Text>
            )}
          </Box>
        </HStack>

        <HStack spacing={4} mb={3}>
          <Box w="50%">
            <Text mb={1} fontSize="sm" color="gray.300">
              Area Tujuan
            </Text>
            <MainSelect
              options={areaOptions}
              value={areaOptions.find((a) => a.id === data.id_area)}
              onChange={(val) => {
                onChange({
                  ...data,
                  area: val?.value,
                  id_area: val?.id,
                });
              }}
              isDisabled={!data.kategori}
              placeholder="Pilih Area"
              isError={errors.area}
            />
            {errors.area && (
              <Text fontSize="xs" color="red.300" mt={1}>
                {errors.area}
              </Text>
            )}
          </Box>

          {!isAdmin && (
            <Box w="50%">
              <Text mb={1} fontSize="sm" color="gray.300">
                Jumlah Unit
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

          {!isAdmin && (
            <Box w="50%">
              <Text mb={1} fontSize="sm" color="gray.300">
                Harga Per Unit
              </Text>
              <Input
                value={harga}
                isReadOnly
                bg={inputBg}
                color={textColor}
                borderColor={borderColor}
              />
            </Box>
          )}
        </HStack>
        {!isAdmin && (
          <HStack spacing={4} mb={3}>
            <Box w="50%">
              <Text mb={1} fontSize="sm" color="gray.300">
                Jumlah Unit
              </Text>
              <Input
                value={jumlah}
                onChange={(e) => setJumlah(Number(e.target.value))}
                bg={inputBg}
                color={textColor}
                borderColor={borderColor}
              />
            </Box>
          </HStack>
        )}

        <TransportFormModal
          isOpen={openModal}
          onClose={() => {
            onModalClose(false);
            setOpenModal(false);
          }}
        />
      </Box>
    );
  }
);

export default MobilCard;
