import {
  Box,
  Flex,
  Table,
  Thead,
  Tbody,
  TableContainer,
  Tr,
  Th,
  Td,
  Heading,
  Text,
  Divider,
  Container,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useAdminVillaContext } from "../../../../context/Admin/AdminVillaContext";
import formatRupiah from "../../../../utils/rupiahFormat";

import { useEffect, useState } from "react";

const VillaRead = () => {
  const { villaData } = useAdminVillaContext();
  const [villasData, setVillasData] = useState([]);

  const handleParsevillaData = () => {
    const parseDataSeasons = Object.entries(villaData.seasons).flatMap(
      ([namaMusim, items]) =>
        items.map((item) => ({
          ...item,
          namaMusim,
        }))
    );

    const merged = villaData.roomType.map((room) => ({
      ...room,
      seasons: parseDataSeasons.filter(
        (season) => season.idRoom === room.idRoom
      ),
    }));

    const updatedVillaSeason = {
      ...villaData,
      roomType: merged,
    };

    const mergedRoomTypes = updatedVillaSeason.roomType.map((room) => {
      const extra = updatedVillaSeason.extrabed?.find(
        (e) => e.idRoom === room.idRoom
      );
      const contract = updatedVillaSeason.contractUntil?.find(
        (c) => c.idRoom === room.idRoom
      );

      return {
        ...room,
        extrabed: extra?.price ?? null,
        contractUntil: contract?.valid ?? null,
      };
    });
    const updatedVilla = {
      ...villaData,
      roomType: mergedRoomTypes,
    };

    setVillasData(updatedVilla);
  };

  useEffect(() => {
    handleParsevillaData();
  }, []);

  return (
    <Container
      bg={"gray.800"}
      p={4}
      flexGrow="1"
      rounded={12}
      maxW="5xl"
      display={"flex"}
    >
      {" "}
      <Flex direction={"column"} gap={4} w={"full"}>
        <AppTitleDescription
          title={villasData.villaName}
          img={villasData.photoLink}
          stars={villasData.stars}
        />

        <Flex
          gap={4}
          alignItems={"start"}
          justifyContent={"start"}
          flexWrap={"wrap"}
        >
          {Object.keys(villasData).length != 0 &&
            villasData?.roomType.map((room, index) => {
              return (
                <AppRoomCard
                  key={index}
                  flexGrow={villasData?.roomType.length % 2 != 0 ? 0 : 1}
                  label={room.label}
                  extrabed={room.extrabed}
                  contractUntil={room.contractUntil}
                  seasons={room.seasons}
                />
              );
            })}
        </Flex>
      </Flex>
    </Container>
  );
};

const AppTitleDescription = (props) => {
  return (
    <Flex direction={"column"} gap={3} w={"full"}>
      <img
        alt="photo-detail"
        src={props.img || "https://picsum.photos/200/300"}
        className="w-full h-[300px] rounded-[12px] object-cover"
      />
      <Flex direction={"column"} gap={5}>
        <Flex direction={"column"} gap={"15px"} w={"60%"} flexShrink={"1"}>
          <Text fontSize={"28px"} fontWeight={"bold"}>
            {props.title || "Bali Paket"}
          </Text>
          <Flex>
            {Array.from({ length: parseInt(props.stars) }, (_, i) => {
              return (
                <Icon
                  key={i}
                  icon="mdi:star"
                  color="orange"
                  className="text-[14px]"
                />
              );
            })}
          </Flex>
        </Flex>

        {/*  */}
      </Flex>
    </Flex>
  );
};

const AppIconText = (props) => {
  return (
    <Flex
      direction={"row"}
      alignItems={"center"}
      gap={2}
      py={1}
      px={3}
      rounded={"full"}
      bg={props.bg}
    >
      <Icon icon={props.icon} className="text-[14px]" color={"gray.400"} />
      <Text fontSize={"10px"}>{props.text}</Text>
    </Flex>
  );
};

const AppRoomCard = (props) => {
  return (
    <Flex
      direction={"column"}
      gap={3}
      p={3}
      bg={"gray.700"}
      rounded={12}
      w={"49.1%"}
      flexGrow={props.flexGrow}
    >
      <Flex gap={2} alignItems={"center"}>
        <Box
          w={"50px"}
          h={"50px"}
          bg={"gray.900"}
          p={2}
          rounded={5}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          fontSize={"18px"}
          fontWeight={"bold"}
        >
          {props.label.slice(0, 2).toUpperCase()}
        </Box>
        <Flex direction={"column"} gap={1} w={"full"}>
          <Flex gap={2} w={"full"} justifyContent={"space-between"}>
            <Text fontSize={"20px"} fontWeight={"bold"}>
              {props.label}
            </Text>
            <AppIconText
              icon={"material-symbols:bed"}
              bg={"blue.700"}
              text={formatRupiah(props.extrabed) || "Rp. 0"}
            />
          </Flex>
          <Text fontSize={"12px"} color={"gray.400"}>
            Contract Limit: {props.contractUntil}
          </Text>
        </Flex>
      </Flex>

      <Box key={props.idRoom}>
        <TableContainer
          w="full"
          bg="gray.700"
          borderRadius="lg"
          boxShadow="md"
          border="1px solid"
          borderColor="gray.900"
        >
          <Table variant="simple" size="sm">
            <Thead>
              <Tr bg="gray.800">
                <Th
                  color="white"
                  borderTopLeftRadius="lg"
                  px={4}
                  py={3}
                  fontSize="12px"
                >
                  Nama Musim
                </Th>
                <Th color="white" px={4} py={3} fontSize="12px">
                  Label
                </Th>
                <Th
                  color="white"
                  borderTopRightRadius="lg"
                  px={4}
                  py={3}
                  fontSize="12px"
                >
                  Harga
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {props.seasons.map((season, idx) => (
                <Tr
                  key={idx}
                  _hover={{ bg: "gray.600" }}
                  transition="background-color 0.2s ease"
                >
                  <Td
                    px={4}
                    py={3}
                    fontSize="12px"
                    color="whiteAlpha.900"
                    fontWeight="medium"
                  >
                    {season.namaMusim.charAt(0).toUpperCase() +
                      season.namaMusim.slice(1)}
                  </Td>
                  <Td px={4} py={3} fontSize="12px" color="whiteAlpha.800">
                    {season.label}
                  </Td>
                  <Td
                    px={4}
                    py={3}
                    fontSize="12px"
                    color="green.300"
                    fontWeight="semibold"
                  >
                    {formatRupiah(season.price) || "Rp. 0"}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Flex>
  );
};

export default VillaRead;
