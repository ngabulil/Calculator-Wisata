import {
  Box,
  Flex,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  Text,
  TabPanel,
  Container,
} from "@chakra-ui/react";
import { useAdminHotelContext } from "../../../../context/Admin/AdminHotelContext";

const HotelRead = () => {
  const { hotelData } = useAdminHotelContext();
  return (
    <Container
      bg={"gray.800"}
      p={4}
      flexGrow="1"
      rounded={12}
      maxW="7xl"
      display={"flex"}
    >
      {" "}
      <Flex direction={"column"} gap={4} w={"full"}>
        <AppTitleDescription
          title={hotelData.name}
          description={hotelData.description}
        />
      </Flex>
    </Container>
  );
};

const AppTitleDescription = (props) => {
  return (
    <Flex direction={"column"} gap={2}>
      <Flex direction={"row"} gap={5}>
        <img
          alt="photo-detail"
          src="https://picsum.photos/200/300"
          className="w-[40%] h-[300px] rounded-[12px] object-cover"
        />
        <Flex direction={"column"} gap={"15px"} w={"60%"} flexShrink={"1"}>
          <Text fontSize={"32px"} fontWeight={"bold"}>
            {props.title || "Bali Paket"}
          </Text>
          <Text fontSize={"14px"}>{props.description}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default HotelRead;
