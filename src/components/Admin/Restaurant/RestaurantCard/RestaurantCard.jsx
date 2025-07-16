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

const RestaurantCard = (props) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

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
            bg={"gray.700"}
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
        <Flex
          zIndex={10}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <PopoverButton
            isOpenButton={false}
            onEditButton={() => {
              navigate(`/admin/restaurant/edit`);
              props.onEditButton();
            }}
            onDeleteButton={props.onDeleteButton}
          />
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
      p={2}
      gap={2}
      rounded={4}
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
      <Flex direction={"column"}>
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

export default RestaurantCard;
