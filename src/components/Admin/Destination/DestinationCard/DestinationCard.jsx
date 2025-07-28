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
import formatDateOnly from "../../../../utils/formatDate";
import { useState } from "react";
import formatRupiah from "../../../../utils/rupiahFormat";
import { useAdminAuthContext } from "../../../../context/AuthContext";

const DestinationCard = (props) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { userData } = useAdminAuthContext();

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
      direction="column"
      align="start"
      bg="gray.800"
      p={4}
      w="full"
      gap={3}
      flexGrow={1}
      borderRadius="lg"
      boxShadow="md"
      transition="all 0.2s"
      _hover={{ boxShadow: "lg", bg: "gray.700", cursor: "pointer" }}
      onClick={() => setOpen(!open)}
    >
      <Flex gap={4} align="start" justify="space-between" w="full">
        <Flex gap={4} align="center">
          <Box
            w="60px"
            h="60px"
            bg="gray.900"
            borderRadius="md"
            display="flex"
            justifyContent="center"
            alignItems="center"
            fontSize="20px"
            fontWeight="bold"
            color="whiteAlpha.900"
            flexShrink={0}
          >
            {props.name?.slice(0, 2).toUpperCase()}
          </Box>

          <Flex direction="column">
            <Text fontSize="lg" fontWeight="bold" color="whiteAlpha.900">
              {props.name || "Garuda Wisnu Kencana"}
            </Text>
            <Text fontSize="sm" color="whiteAlpha.700">
              {props.note || "Sudah termasuk tiket"}
            </Text>
          </Flex>
        </Flex>

        <Flex alignItems={"center"} gap={2}>
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
          <Box
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {userData.role === "super_admin" && (
              <PopoverButton
                isOpenButton={false}
                onEditButton={() => {
                  navigate(`/admin/destination/edit`);
                  props.onEditButton();
                }}
                onDeleteButton={props.onDeleteButton}
              />
            )}
          </Box>
        </Flex>
      </Flex>

      {open && (
        <Box pt={2} w="full">
          <AppPriceList data={formattedPrices} />
        </Box>
      )}
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
          <Tr bg="gray.900">
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
              <Td color="whiteAlpha.900" px={4} py={3} fontWeight="medium">
                {item.tourist_type}
              </Td>
              <Td
                color="whiteAlpha.800"
                px={4}
                py={3}
                textTransform="capitalize"
              >
                {item.category}
              </Td>
              <Td
                isNumeric
                color="green.300"
                px={4}
                py={3}
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

export default DestinationCard;
