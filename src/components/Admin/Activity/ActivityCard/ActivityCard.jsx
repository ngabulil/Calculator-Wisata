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

const ActivityCard = (props) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

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
      w={"50%"}
      gap={2}
      flexGrow={"1"}
      rounded={"8"}
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
          bg={"gray.700"}
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
        <Flex direction={"column"} flexShrink={"0"} gap={0}>
          <Text fontSize={"18px"} fontWeight={"bold"}>
            {props.name || "  ATV Adventure"}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"14px"}>
              {props.keterangan || "2 jam keliling desa"}
            </Text>
            <Text
              fontSize={"12px"}
              color={"gray.400"}
              bg={"gray.900"}
              p={2}
              rounded={"10px"}
            >
              {props.note || "Sepatu tertutup wajib"}
            </Text>
          </Flex>
        </Flex>
        <Flex direction={"row"} gap={1} w={"full"} justifyContent={"end"}>
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
            <PopoverButton
              isOpenButton={false}
              onEditButton={() => {
                navigate(`/admin/activity/edit`);
                props.onEditButton();
              }}
              onDeleteButton={props.onDeleteButton}
            />
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
    <TableContainer w={"full"}>
      <Table variant="simple" size="sm">
        <Thead bg="gray.700">
          <Tr>
            <Th>Type</Th>
            <Th>KategorI</Th>
            <Th isNumeric>Harga</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, index) => (
            <Tr key={index}>
              <Td>{item.tourist_type}</Td>
              <Td>{item.category}</Td>
              <Td isNumeric>{item.price}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ActivityCard;
