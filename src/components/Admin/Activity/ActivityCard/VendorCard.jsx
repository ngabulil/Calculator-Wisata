import { Flex, Box, Text } from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import { PopoverButton } from "../../../PopoverButton";
import formatDateOnly from "../../../../utils/formatDate";
import { useState } from "react";
import { useAdminAuthContext } from "../../../../context/AuthContext";

const VendorCard = (props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { userData } = useAdminAuthContext();

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
            bg={props.bgIcon || "gray.700"}
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
        <Flex alignItems={"center"} gap={2}>
          <Text
            minW={"max"}
            fontSize={"12px"}
            fontWeight={"bold"}
            bg={props.bgIcon || "purple.600"}
            color={"white"}
            py={1}
            px={4}
            rounded={"full"}
          >
            {formatDateOnly(props.date)}
          </Text>
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
  );
};

export default VendorCard;
