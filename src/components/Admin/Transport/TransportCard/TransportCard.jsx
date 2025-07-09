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

const TransportCard = (props) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

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
          {props.jenisKendaraan.slice(0, 2).toUpperCase() || "MO"}
        </Box>
        <Flex direction={"column"} flexShrink={"0"} gap={0}>
          <Text fontSize={"18px"} fontWeight={"bold"}>
            {props.jenisKendaraan || "  Mobil"}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"14px"}>
              {props.vendor || "2 jam keliling desa"}
            </Text>
          </Flex>
        </Flex>
        <Flex direction={"row"} gap={1} w={"full"} justifyContent={"end"}>
          <AppIconText icon={"mdi:ticket"} bg={"blue.700"} text={"Vendor"} />
          <Flex
            zIndex={10}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <PopoverButton
              isOpenButton={false}
              onEditButton={() => {
                navigate(`/admin/transport/edit`);
                props.onEditButton();
              }}
              onDeleteButton={props.onDeleteButton}
            />
          </Flex>
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
      <Text fontSize={"10px"}>{props.text}</Text>
    </Flex>
  );
};

const AppInformationTable = ({ keterangan }) => {
  const layananTypes = ["fullDay", "halfDay", "inOut", "menginap"];

  return (
    <Box w={"full"}>
      <Table variant="simple" size="sm">
        <Thead bg="gray.700">
          <Tr>
            <Th>Kategori</Th>
            <Th>Nama Area</Th>
            <Th isNumeric>Harga</Th>
          </Tr>
        </Thead>
        <Tbody>
          {layananTypes.map((key) =>
            keterangan[key]?.map((item, idx) => (
              <Tr key={`${key}-${idx}`}>
                <Td textTransform="capitalize">{key}</Td>
                <Td>{item.area}</Td>
                <Td isNumeric>
                  Rp {Number(item.price).toLocaleString("id-ID")}
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TransportCard;
