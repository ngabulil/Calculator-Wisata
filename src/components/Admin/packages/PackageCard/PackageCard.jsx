import {
  Box,
  Flex,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  Text,
  TabPanel,
} from "@chakra-ui/react";

import { PopoverButton } from "../../../PopoverButton";
import { useNavigate } from "react-router-dom";
import formatDateOnly from "../../../../utils/formatDate";

const PackageCard = (props) => {
  return (
    <Box
      bg={"gray.800"}
      p={3}
      shadow={"xl"}
      w={"full"}
      flexGrow={props.flexGrow}
      rounded={8}
      display={"flex"}
    >
      <AppTitleDescription
        title={props.title}
        description={props.description}
        days={props.days}
        date={props.date}
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
      direction={"row"}
      gap={4}
      w={"full"}
      alignItems={"start"}
      justifyContent={"space-between"}
    >
      <Flex direction={"column"} gap={2} w="max">
        <Flex direction={"row"} alignItems={"center"} gap={4} w={"full"}>
          <Box
            w={"60px"}
            h={"50px"}
            bg={"gray.900"}
            rounded={5}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            fontSize={"18px"}
            fontWeight={"bold"}
            flexShrink={"0"}
          >
            {props.title.slice(0, 2).toUpperCase()}
          </Box>
          <Text fontSize="24px" fontWeight="bold" w="full" noOfLines={2}>
            {props.title || "Bali Paket"}
          </Text>
        </Flex>
        <Text fontSize={"14px"} color={"gray.500"} noOfLines={4} w={"70%"}>
          {props.description}
        </Text>
      </Flex>
      <Flex direction={"row"} alignItems={"center"} w={"max"} gap={2}>
        <Text
          minW={"max"}
          fontSize={"12px"}
          fontWeight={"bold"}
          bg={"green.600"}
          color={"green.200"}
          py={1}
          px={4}
          rounded={"full"}
        >
          {props.days.length} Hari
        </Text>
        <Text
          minW={"max"}
          fontSize={"12px"}
          fontWeight={"bold"}
          bg={"purple.600"}
          color={"purple.200"}
          py={1}
          px={4}
          rounded={"full"}
        >
          {formatDateOnly(props.date)}
        </Text>
        <PopoverButton
          isOpenButton={true}
          onEditButton={() => {
            navigate(`/admin/paket/edit`);
            props.onEditButton();
          }}
          onDeleteButton={props.onDeleteButton}
          onOpenButton={props.onOpenButton}
        />
      </Flex>
    </Flex>
  );
};
