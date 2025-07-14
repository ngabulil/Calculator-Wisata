import {
  Box,
  Button,
  HStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useAdminAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AccountCard = () => {
  const { userData, updateToken, updateRole } = useAdminAuthContext();
  const { onOpen, onClose, isOpen } = useDisclosure();

  const navigate = useNavigate();

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="bottom-end"
    >
      <PopoverTrigger>
        <Button color={"teal.900"} p={3} _hover={{ bg: "gray.600" }}>
          <HStack spacing={2}>
            <Icon
              icon="icon-park-solid:people"
              className="text-[24px]"
              color="white"
            />
          </HStack>
        </Button>
      </PopoverTrigger>

      <PopoverContent w="150px">
        <PopoverArrow />
        <PopoverBody display={"flex"} flexDirection={"column"} gap={4}>
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" fontWeight={"bold"} color={"white"}>
              {userData.name || "Admin"}
            </Text>
            <Text fontSize="xs" color="gray.400" textTransform="capitalize">
              {userData.role == "super_admin" ? "Super Admin" : "Admin"}
            </Text>
          </VStack>
          <Button
            colorScheme="red"
            variant="outline"
            size="sm"
            width="100%"
            onClick={() => {
              updateToken(null);
              updateRole(null);

              onClose();
              navigate("/auth/login", { replace: true });
            }}
          >
            Logout
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default AccountCard;
