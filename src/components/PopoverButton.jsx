import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Button,
} from "@chakra-ui/react";
import { useAdminAuthContext } from "../context/AuthContext";
import { Icon } from "@iconify/react";

export const PopoverButton = (props) => {
  const { userData } = useAdminAuthContext();
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Icon
          icon={"mage:dots"}
          className="text-white text-[24px] p-[4px] cursor-pointer "
          style={{
            background: "#1A202C",
            borderRadius: "6px",
          }}
        />
      </PopoverTrigger>
      <PopoverContent w={"100%"}>
        {props.isOpenButton && (
          <PopoverBody className="cursor-pointer" onClick={props.onOpenButton}>
            Open
          </PopoverBody>
        )}
        {props.isDuplicated && (
          <PopoverBody
            className="cursor-pointer"
            onClick={props.onDuplicateButton}
          >
            Duplicate
          </PopoverBody>
        )}
        {userData.role === "super_admin" && (
          <PopoverBody className="cursor-pointer" onClick={props.onEditButton}>
            Edit
          </PopoverBody>
        )}
        {userData.role === "super_admin" && (
          <PopoverBody
            className="cursor-pointer"
            onClick={props.onDeleteButton}
          >
            Delete
          </PopoverBody>
        )}
      </PopoverContent>
    </Popover>
  );
};
