import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Box,
  Flex,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminAuthContext } from "../context/AuthContext";

const MotionBox = motion(Box);

export const PopoverButton = (props) => {
  const { userData } = useAdminAuthContext();
  const { isOpen, onToggle, onClose } = useDisclosure();

  const MenuItem = ({ icon, label, onClick, color }) => (
    <Flex
      align="center"
      gap={2}
      px={3}
      py={2}
      borderRadius="md"
      cursor="pointer"
      transition="background 0.2s"
      _hover={{ bg: "gray.100", color: "gray.800", fontWeight: "bold" }}
      onClick={() => {
        onClick?.();
        onClose();
      }}
    >
      <Icon icon={icon} className="text-[18px]" color={color || "#1A202C"} />
      <Text fontSize="14px">{label}</Text>
    </Flex>
  );

  return (
    <Popover
      placement="bottom-end"
      isLazy
      isOpen={isOpen}
      onClose={onClose}
      closeOnBlur={true}
    >
      <PopoverTrigger>
        <Box as="span" onClick={onToggle}>
          <Icon
            icon="mage:dots"
            className="text-white text-[24px] p-[4px] cursor-pointer"
            style={{
              background: "#1A202C",
              borderRadius: "6px",
            }}
          />
        </Box>
      </PopoverTrigger>

      <AnimatePresence>
        {isOpen && (
          <PopoverContent
            as={MotionBox}
            w="180px"
            border="none"
            boxShadow="lg"
            borderRadius="md"
            overflow="hidden"
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {props.isOpenButton && (
              <PopoverBody p={0}>
                <MenuItem
                  icon="mdi:eye-outline"
                  label="Open"
                  onClick={props.onOpenButton}
                />
              </PopoverBody>
            )}
            {props.isDuplicated && (
              <PopoverBody p={0}>
                <MenuItem
                  icon="mdi:content-copy"
                  label="Duplicate"
                  onClick={props.onDuplicateButton}
                />
              </PopoverBody>
            )}
            {(userData.role === "super_admin" || props.isOwner) && (
              <>
                <PopoverBody p={0}>
                  <MenuItem
                    icon="mdi:pencil-outline"
                    label="Edit"
                    onClick={props.onEditButton}
                    color="#3182ce"
                  />
                </PopoverBody>
                <PopoverBody p={0}>
                  <MenuItem
                    icon="mdi:trash-can-outline"
                    label="Delete"
                    onClick={props.onDeleteButton}
                    color="#e53e3e"
                  />
                </PopoverBody>
              </>
            )}
          </PopoverContent>
        )}
      </AnimatePresence>
    </Popover>
  );
};
