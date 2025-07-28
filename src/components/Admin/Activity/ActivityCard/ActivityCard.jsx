import {
  Flex,
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import { PopoverButton } from "../../../PopoverButton";
import { Icon } from "@iconify/react";
import { useState } from "react";
import formatRupiah from "../../../../utils/rupiahFormat";
import formatDateOnly from "../../../../utils/formatDate";
import { useAdminAuthContext } from "../../../../context/AuthContext";

const ActivityCard = (props) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { userData } = useAdminAuthContext();

  const formattedPrices = [
    {
      tourist_type: "Asing",
      category: "Adult",
      price: props.act.price_foreign_adult,
    },
    {
      tourist_type: "Asing",
      category: "Child",
      price: props.act.price_foreign_child,
    },
    {
      tourist_type: "Domestik",
      category: "Adult",
      price: props.act.price_domestic_adult,
    },
    {
      tourist_type: "Domestik",
      category: "Child",
      price: props.act.price_domestic_child,
    },
  ];
  return (
    <Flex
      direction={"column"}
      alignItems={"start"}
      bg={"gray.800"}
      p={2}
      w={"full"}
      gap={2}
      flexGrow={"1"}
      rounded={"8"}
      _hover={{ bg: "gray.700", transition: "all 0.2s" }}
      onClick={() => setOpen(!open)}
    >
      <Flex
        gap={4}
        p={2}
        alignItems={"start"}
        justifyContent={"start"}
        w={"full"}
      >
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
          {props.name.slice(0, 2).toUpperCase()}
        </Box>
        <Flex direction={"column"} w={"full"} gap={1}>
          <Flex alignItems={"center"} gap={2}>
            {" "}
            <Text fontSize={"18px"} fontWeight={"bold"}>
              {props.name || "Nama tidak tersedia"}
            </Text>
            <Text
              minW={"max"}
              fontSize={"10px"}
              fontWeight={"bold"}
              bg={"purple.600"}
              color={"purple.200"}
              py={1}
              px={4}
              rounded={"full"}
            >
              {formatDateOnly(props.date)}
            </Text>
          </Flex>
          <Flex gap={2} direction={"column"} alignItems={"start"} w={"80%"}>
            <Text fontSize={"14px"} color={"gray.500"}>
              {props.keterangan || "Keterangan tidak tersedia"}
            </Text>
            <Text
              fontSize={"12px"}
              color={"gray.400"}
              bg={"gray.900"}
              py={1}
              px={2}
              rounded={"4px"}
            >
              {props.note || "Tidak ada catatan"}
            </Text>
          </Flex>
        </Flex>
        <Flex direction={"row"} gap={1} w={"max"} justifyContent={"end"}>
          <AppIconText
            icon={"mdi:ticket"}
            bg={"blue.700"}
            text={props.vendorName}
          />
          <Flex
            zIndex={10}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            {userData.role === "super_admin" && (
              <PopoverButton
                isOpenButton={false}
                onEditButton={() => {
                  navigate(`/admin/activity/edit`);
                  props.onEditButton();
                }}
                onDeleteButton={props.onDeleteButton}
              />
            )}
          </Flex>
        </Flex>
      </Flex>
      {open && <AppPriceList data={formattedPrices} />}
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
      flexShrink={"0"}
    >
      <Icon icon={props.icon} className="text-[14px]" color={"gray.400"} />
      <Text fontSize={"10px"}>{props.text}</Text>
    </Flex>
  );
};

const AppPriceList = ({ data }) => {
  return (
    <TableContainer
      w="full"
      bg="gray.700"
      borderRadius="lg"
      boxShadow="md"
      border={"2px solid"}
      borderColor={"gray.900"}
    >
      <Table variant="simple" size="sm">
        <Thead>
          <Tr bg="gray.900" p={"8px"}>
            <Th color="white" borderTopLeftRadius="lg" bg="gray.900" p={"8px"}>
              Type
            </Th>
            <Th color="white" bg="gray.900" p={"8px"}>
              Kategori
            </Th>
            <Th
              isNumeric
              color="white"
              borderTopRightRadius="lg"
              bg="gray.900"
              p={"8px"}
            >
              Harga
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, index) => (
            <Tr
              key={index}
              _hover={{ bg: "gray.600" }}
              transition="background-color 0.2s ease"
            >
              <Td color="whiteAlpha.900" fontWeight="medium">
                {item.tourist_type}
              </Td>
              <Td color="whiteAlpha.800" textTransform="capitalize">
                {item.category}
              </Td>
              <Td isNumeric color="green.300" fontWeight="semibold">
                {formatRupiah(item.price)}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ActivityCard;
