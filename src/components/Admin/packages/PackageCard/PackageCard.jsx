import { Box, Flex, Text } from "@chakra-ui/react";
import { PopoverButton } from "../../../PopoverButton";
import { useNavigate } from "react-router-dom";
import formatDateTime from "../../../../utils/formatDateTime";

const PackageCard = (props) => {
  const {
    flexGrow,
    title,
    bgIcon,
    description,
    days = [],
    date,
    updater,
    onDuplicateButton,
    onEditButton,
    onDeleteButton,
    onOpenButton,
  } = props;

  return (
    <Box
      bg="gray.800"
      borderColor="gray.800"
      p={3}
      my={4}
      shadow="xl"
      w="full"
      flexGrow={flexGrow}
      borderWidth={2}
      rounded={8}
      display="flex"
      _hover={{
        borderColor: props.bgIcon,
        borderWidth: 2,
        bg: "gray.900",
      }}
    >
      <AppTitleDescription
        title={title}
        bgIcon={bgIcon}
        description={description}
        days={days}
        date={date}
        updater={updater}
        onDuplicateButton={onDuplicateButton}
        onEditButton={onEditButton}
        onDeleteButton={onDeleteButton}
        onOpenButton={onOpenButton}
      />
    </Box>
  );
};

export default PackageCard;

const AppTitleDescription = ({
  title = "",
  bgIcon,
  description,
  days = [],
  date,
  updater,
  onDuplicateButton,
  onEditButton,
  onDeleteButton,
  onOpenButton,
}) => {
  const navigate = useNavigate();
  const iconText = title
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Flex
      direction="row"
      gap={4}
      w="full"
      alignItems="start"
      justifyContent="space-between"
      flexWrap={{ base: "wrap", md: "nowrap" }}
      position="relative"
    >
      {/* Kiri: Icon, Judul, Updater, Deskripsi */}
      <Flex direction="column" gap={2} flex="1">
        <Flex alignItems="center" gap={4} w="full">
          <Box
            w="60px"
            h="50px"
            bg={bgIcon || "gray.900"}
            rounded={5}
            display="flex"
            justifyContent="center"
            alignItems="center"
            fontSize="18px"
            fontWeight="bold"
            flexShrink={0}
          >
            {iconText || "PK"}
          </Box>

          <Flex direction="column" gap="2px">
            <Text
              fontSize={{ base: "18px", md: "20px" }}
              fontWeight="bold"
              noOfLines={2}
              maxW={{ base: "100%", md: "700px" }}
            >
              {title || "Paket Tanpa Judul"}
            </Text>
            <Flex
              alignItems="center"
              fontSize={{ base: "8px", md: "10px" }}
              gap="1px"
            >
              <Text color="gray.500">Terakhir diupdate oleh</Text>
              <Text color="blue.500" fontWeight="semibold" ml={1}>
                {updater || "Tidak diketahui"}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Text
          my={2}
          fontSize={{ base: "10px", md: "12px" }}
          color="gray.400"
          noOfLines={{ base: 2, md: 4 }}
          maxW="700px"
        >
          {description || "Tidak ada deskripsi paket"}
        </Text>
      </Flex>

      {/* Kanan: Jumlah Hari, Tanggal, Action */}
      <Flex alignItems="center" flexShrink={0} gap={2} mt={{ base: 2, md: 0 }}>
        <Text
          fontSize="10px"
          fontWeight="bold"
          bg={bgIcon || "green.600"}
          color="white"
          py={1}
          px={4}
          rounded="full"
          minW="max"
        >
          {days.length} Hari
        </Text>

        {date && (
          <Text
            fontSize="10px"
            fontWeight="bold"
            bg="black"
            color="gray.200"
            py={1}
            px={4}
            rounded="full"
            minW="max"
          >
            {formatDateTime(date)}
          </Text>
        )}

        <PopoverButton
          isDuplicated
          isOpenButton
          onEditButton={() => {
            navigate(`/admin/paket/edit`);
            onEditButton?.();
          }}
          onDuplicateButton={onDuplicateButton}
          onDeleteButton={onDeleteButton}
          onOpenButton={onOpenButton}
        />
      </Flex>
    </Flex>
  );
};
