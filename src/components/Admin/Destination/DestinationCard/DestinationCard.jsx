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

import { useState } from "react";
import formatRupiah from "../../../../utils/rupiahFormat";

const DestinationCard = (props) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const formattedPrices = [
    {
      tourist_type: "Asing",
      category: "Adult",
      price: props.destination.price_foreign_adult,
    },
    {
      tourist_type: "Asing",
      category: "Child",
      price: props.destination.price_foreign_child,
    },
    {
      tourist_type: "Domestik",
      category: "Adult",
      price: props.destination.price_domestic_adult,
    },
    {
      tourist_type: "Domestik",
      category: "Child",
      price: props.destination.price_domestic_child,
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
        justifyContent={"space-between"}
        w={"full"}
      >
        <Flex gap={3}>
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
              {props.name || "  Garuda Wisnu Kencana"}
            </Text>
            <Text fontSize={"14px"}>
              {props.note || "Sudah termasuk tiket"}
            </Text>
          </Flex>
        </Flex>
        <Flex
          zIndex={10}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <PopoverButton
            isOpenButton={false}
            onEditButton={() => {
              navigate(`/admin/destination/edit`);
              props.onEditButton();
            }}
            onDeleteButton={props.onDeleteButton}
          />
        </Flex>
      </Flex>
      {open && <AppPriceList data={formattedPrices} />}
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
              <Td isNumeric>{formatRupiah(item.price)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default DestinationCard;
