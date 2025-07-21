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
import { useAdminAuthContext } from "../../../../context/AuthContext";

const RestaurantCard = (props) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { userData } = useAdminAuthContext();

  return (
    <Flex
      direction={"column"}
      bg={"gray.800"}
      p={2}
      w={"full"}
      gap={2}
      flexGrow={"1"}
      rounded={"8"}
      cursor={"pointer"}
      _hover={{ bg: "gray.700", transition: "all 0.2s" }}
      onClick={() => setOpen(!open)}
    >
      <Flex
        gap={4}
        p={2}
        alignItems={"start"}
        justifyContent={"start"}
        w={"full"}
        direction={"col"}
      >
        <Flex
          direction={"row"}
          gap={4}
          w={"full"}
          alignItems={"center"}
          justifyContent={"start"}
        >
          <Box
            w={"40px"}
            h={"40px"}
            bg={"gray.900"}
            rounded={5}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            fontSize={"13px"}
            fontWeight={"bold"}
            flexShrink={"0"}
          >
            {props.name.slice(0, 2).toUpperCase() || "RS"}
          </Box>
          <Text fontSize={"18px"} fontWeight={"bold"}>
            {props.name || "  ATV Adventure"}
          </Text>
        </Flex>
        <Flex alignItems={"center"} gap={2}>
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
            {props.packages.length} Paket
          </Text>
          <Flex
            zIndex={10}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            {userData?.role === "super_admin" && (
              <PopoverButton
                isOpenButton={false}
                onEditButton={() => {
                  navigate(`/admin/restaurant/edit`);
                  props.onEditButton();
                }}
                onDeleteButton={props.onDeleteButton}
              />
            )}
          </Flex>
        </Flex>
      </Flex>
      {open && (
        <Flex direction={"column"} gap={3} rounded={4}>
          {props.packages.map((pack) => {
            return <AppPackageList package={pack} />;
          })}
        </Flex>
      )}
    </Flex>
  );
};

const AppPackageList = (props) => {
  const formattedPrices = [
    {
      tourist_type: "Asing",
      category: "Adult",
      price: props.package.price_foreign_adult,
    },
    {
      tourist_type: "Asing",
      category: "Child",
      price: props.package.price_foreign_child,
    },
    {
      tourist_type: "Domestik",
      category: "Adult",
      price: props.package.price_domestic_adult,
    },
    {
      tourist_type: "Domestik",
      category: "Child",
      price: props.package.price_domestic_child,
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <Flex
      direction={"column"}
      bg={"gray.900"}
      shadow={"xl"}
      p={4}
      gap={2}
      rounded={8}
      cursor={"pointer"}
      onClick={(event) => {
        event.stopPropagation();
        setOpen(!open);
      }}
    >
      <Flex direction={"row"} gap={2}>
        <Text fontSize={"14px"} fontWeight={"bold"}>
          {props.package.package_name || "Package Name"}
        </Text>
        <AppIconText icon={"mdi:restaurant"} text="1 Pax" bg={"gray.600"} />
      </Flex>
      {/*  */}
      <Flex direction={"column"} gap={2}>
        <Flex gap={2} w={"full"} justifyContent={"space-between"}>
          <Text fontSize={"12px"} color={"gray.400"}>
            {props.package.note || "note minimal pax"}
          </Text>
          {/* <AppIconText icon={"mdi:download"} text={"Contract"} /> */}
        </Flex>

        {open && <AppPriceList data={formattedPrices} />}
      </Flex>
      {/*  */}
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
      <Icon icon={props.icon} className="text-[10px]" color={"gray.400"} />
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
          <Tr bg="gray.800">
            <Th color="white" borderTopLeftRadius="lg" px={4} py={3}>
              Type
            </Th>
            <Th color="white" px={4} py={3}>
              Kategori
            </Th>
            <Th isNumeric color="white" borderTopRightRadius="lg" px={4} py={3}>
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
              <Td px={4} py={3} color="whiteAlpha.900" fontWeight="medium">
                {item.tourist_type}
              </Td>
              <Td
                px={4}
                py={3}
                color="whiteAlpha.800"
                textTransform="capitalize"
              >
                {item.category}
              </Td>
              <Td
                isNumeric
                px={4}
                py={3}
                color="green.300"
                fontWeight="semibold"
              >
                {formatRupiah(item.price)}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default RestaurantCard;
