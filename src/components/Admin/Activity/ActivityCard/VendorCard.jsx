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

const VendorCard = (props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

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
        <Flex direction={"row"} alignItems={"center"} gap={3}>
          <Box
            w={"60px"}
            h={"50px"}
            bg={"gray.700"}
            rounded={5}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            fontSize={"24px"}
            fontWeight={"bold"}
            flexShrink={"0"}
          >
            {props.name.slice(0, 2).toUpperCase()}
          </Box>
          <Text fontSize={"18px"} fontWeight={"bold"}>
            {props.name || "  ATV Adventure"}
          </Text>
        </Flex>
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
  );
};

export default VendorCard;
