import { Box, Flex, Text } from "@chakra-ui/react";
import { PopoverButton } from "../../../PopoverButton";
import { useNavigate } from "react-router-dom";
import formatDateTime from "../../../../utils/formatDateTime";

const PackageCard = (props) => {
  return (
    <Box
      bg="gray.800"
      p={3}
      my={2}
      shadow="xl"
      w="full"
      flexGrow={props.flexGrow}
      rounded={8}
      display="flex"
    >
      <AppTitleDescription
        title={props.title}
        bgIcon={props.bgIcon}
        description={props.description}
        days={props.days}
        date={props.date}
        updater={props.updater}
        onDuplicateButton={props.onDuplicateButton}
        onEditButton={props.onEditButton}
        onDeleteButton={props.onDeleteButton}
        onOpenButton={props.onOpenButton}
      />
    </Box>
  );
};

export default PackageCard;

const AppTitleDescription = (props) => {
  const navigate = useNavigate();

  return (
    <Flex
      direction="row"
      gap={4}
      w="full"
      alignItems="start"
      justifyContent="space-between"
      flexWrap={{ base: "wrap", md: "nowrap" }}
      position={"relative"}
    >
      <Flex direction="column" gap={2} flex="1">
        <Flex direction="row" alignItems="center" gap={4} w="full">
          <Box
            w="60px"
            h="50px"
            bg={props.bgIcon || "gray.900"}
            rounded={5}
            display="flex"
            justifyContent="center"
            alignItems="center"
            fontSize="18px"
            fontWeight="bold"
            flexShrink={0}
          >
            {props.title
              .replace(/[^a-zA-Z]/g, "")
              .slice(0, 2)
              .toUpperCase()}
          </Box>
          <Flex direction={"column"} gap={"2px"}>
            <Text
              fontSize={{ base: "18px", md: "20px" }}
              fontWeight="bold"
              wordBreak="break-word"
              noOfLines={2}
              maxW={{ base: "100%", md: "700px" }}
            >
              {props.title || "Bali Paket"}
            </Text>
            <Flex
              alignItems={"center"}
              fontSize={{ base: "8px", md: "10px" }}
              gap={"1px"}
              // position={"absolute"}
              // right={0}
              // bottom={0}
            >
              {/* <Box
                w={"10px"}
                h="10px"
                borderRadius={"full"}
                bg={"gray.500"}
              ></Box> */}
              <Text color="gray.500">Terakhir di update oleh</Text>
              <Text color="blue.500" fontWeight="semibold" ml={1}>
                {props.updater || "Tidak diketahui"}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Text
          my={2}
          fontSize={{ base: "12px", md: "14px" }}
          color="gray.400"
          noOfLines={{ base: 2, md: 4 }}
          textOverflow="ellipsis"
          w="100%"
          maxW="500px"
          overflow="hidden"
        >
          {props.description}
        </Text>
      </Flex>

      <Flex
        direction="row"
        alignItems="center"
        flexShrink={0}
        gap={2}
        mt={{ base: 2, md: 0 }}
      >
        <Text
          fontSize="12px"
          fontWeight="bold"
          bg={props.bgIcon || "green.600"}
          color="white"
          py={1}
          px={4}
          rounded="full"
          minW="max"
        >
          {props.days.length} Hari
        </Text>
        {props.data && (
          <Text
            fontSize="12px"
            fontWeight="bold"
            bg="gray.900"
            color="gray.200"
            py={1}
            px={4}
            rounded="full"
            minW="max"
          >
            {formatDateTime(props.date)}
          </Text>
        )}

        <PopoverButton
          isDuplicated
          isOpenButton={true}
          onEditButton={() => {
            navigate(`/admin/paket/edit`);
            props.onEditButton();
          }}
          onDuplicateButton={props.onDuplicateButton}
          onDeleteButton={props.onDeleteButton}
          onOpenButton={props.onOpenButton}
        />
      </Flex>
    </Flex>
  );
};
