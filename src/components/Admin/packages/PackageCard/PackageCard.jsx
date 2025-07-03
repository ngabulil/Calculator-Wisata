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

const PackageCard = (props) => {
  return (
    <Box
      bg={"gray.700"}
      p={3}
      w={"20%"}
      flexGrow="1"
      rounded={8}
      display={"flex"}
    >
      <AppTitleDescription
        title={"Paket Bali"}
        description={
          " Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s"
        }
        onEditButton={props.onEditButton}
        onDeleteButton={props.onDeleteButton}
        onOpenButton={props.onOpenButton}
      />
    </Box>
  );
};

export default PackageCard;

const AppTitleDescription = (props) => {
  return (
    <Flex direction={"column"} gap={2}>
      <img
        alt="photo-detail"
        src="https://picsum.photos/200/300"
        className="w-full h-[180px] rounded-[8px] object-center"
      />
      <Flex direction={"column"} gap={2}>
        <Flex
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Text fontSize={"24px"} fontWeight={"bold"}>
            {props.title || "Bali Paket"}
          </Text>
          <PopoverButton
            isOpenButton={true}
            onEditButton={props.onEditButton}
            onDeleteButton={props.onDeleteButton}
            onOpenButton={props.onOpenButton}
          />
        </Flex>
        <Text fontSize={"10px"} noOfLines={3}>
          {props.description}
        </Text>
      </Flex>
    </Flex>
  );
};
