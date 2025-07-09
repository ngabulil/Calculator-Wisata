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
import { Icon } from "@iconify/react";
import { PopoverButton } from "../../../PopoverButton";
import { useNavigate } from "react-router-dom";

const PackageCard = (props) => {
  return (
    <Box
      bg={"gray.800"}
      p={3}
      shadow={"xl"}
      w={"23.4%"}
      flexGrow={props.flexGrow}
      rounded={8}
      display={"flex"}
    >
      <AppTitleDescription
        title={props.title}
        description={props.description}
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
    <Flex direction={"column"} gap={2} w={"full"}>
      <img
        alt="photo-detail"
        src="https://picsum.photos/200/300"
        className="w-full h-[180px] rounded-[8px] object-cover"
      />
      <Flex direction={"column"} gap={2}>
        <Flex
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text fontSize={"24px"} fontWeight={"bold"} noOfLines={1}>
            {props.title || "Bali Paket"}
          </Text>
          <PopoverButton
            isOpenButton={true}
            onEditButton={() => {
              navigate(`/admin/edit`);
              props.onEditButton();
            }}
            onDeleteButton={props.onDeleteButton}
            onOpenButton={props.onOpenButton}
          />
        </Flex>
        <Text fontSize={"12px"} noOfLines={4}>
          {props.description}
        </Text>
      </Flex>
    </Flex>
  );
};
