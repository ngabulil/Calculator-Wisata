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
  Link,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import { PopoverButton } from "../../../PopoverButton";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useAdminAuthContext } from "../../../../context/AuthContext";

const TransportCard = (props) => {
  const { userData } = useAdminAuthContext();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Flex
      direction="column"
      alignItems="start"
      bg="gray.800"
      p={3}
      w="50%"
      gap={2}
      flexGrow="1"
      _hover={{ bg: "gray.700", transition: "all 0.2s" }}
      rounded="8"
      onClick={() => setOpen(!open)}
    >
      <Flex
        gap={4}
        p={2}
        alignItems="start"
        justifyContent="space-between"
        w="full"
      >
        <Flex gap={4} alignItems="center" flex="1">
          <Box
            w="60px"
            h="50px"
            bg={props.bgIcon || "gray.900"}
            rounded="md"
            display="flex"
            justifyContent="center"
            alignItems="center"
            fontSize="18px"
            fontWeight="bold"
            flexShrink="0"
          >
            {(props.jenisKendaraan || "MO").slice(0, 2).toUpperCase()}
          </Box>

          <Flex direction="column" gap={1}>
            <Text fontSize="18px" fontWeight="bold">
              {props.jenisKendaraan || "Nama Tidak Tersedia"}
            </Text>
            <Text fontSize="14px" color="gray.300">
              {props.vendor || "Vendor Tidak tersedia"}
            </Text>
          </Flex>
        </Flex>

        <Flex gap={2} alignItems="center" zIndex={10}>
          <AppIconText
            icon="mdi:ticket"
            bg={props.bgIcon || "blue.700"}
            link={props.vendorLink}
            text="Vendor"
          />
          <Box
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {userData?.role === "super_admin" && (
              <PopoverButton
                isOpenButton={false}
                onEditButton={() => {
                  navigate(`/admin/transport/edit`);
                  props.onEditButton();
                }}
                onDeleteButton={props.onDeleteButton}
              />
            )}
          </Box>
        </Flex>
      </Flex>

      {open && <AppInformationTable keterangan={props.keterangan} />}
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
      <Text fontSize="10px" color={"white"}>
        <Link
          href={props.link}
          isExternal
          color="white"
          _hover={{ textDecoration: "none", color: "white" }}
        >
          {props.text}
        </Link>
      </Text>
    </Flex>
  );
};

const AppInformationTable = ({ keterangan }) => {
  const layananTypes = ["fullDay", "halfDay", "inOut", "menginap"];

  return (
    <Box w={"full"}>
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
                Kategori
              </Th>
              <Th color="white" px={4} py={3}>
                Nama Area
              </Th>
              <Th
                isNumeric
                color="white"
                borderTopRightRadius="lg"
                px={4}
                py={3}
              >
                Harga
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {layananTypes.map((key) =>
              keterangan[key]?.map((item, idx) => (
                <Tr
                  key={`${key}-${idx}`}
                  _hover={{ bg: "gray.600" }}
                  transition="background-color 0.2s ease"
                >
                  <Td
                    px={4}
                    py={3}
                    color="whiteAlpha.900"
                    textTransform="capitalize"
                  >
                    {key}
                  </Td>
                  <Td px={4} py={3} color="whiteAlpha.800">
                    {item.area}
                  </Td>
                  <Td
                    isNumeric
                    px={4}
                    py={3}
                    color="green.300"
                    fontWeight="semibold"
                  >
                    Rp{" "}
                    {Number(item.price == null ? 0 : item.price).toLocaleString(
                      "id-ID"
                    )}
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TransportCard;
