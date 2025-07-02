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
import { Icon } from "@iconify/react";

export const PopoverButton = (props) => {
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Icon icon={"mage:dots"} className="text-white text-[20px]" />
      </PopoverTrigger>
      <PopoverContent w={"100%"}>
        <PopoverHeader>Settings</PopoverHeader>
        <PopoverBody onClick={props.onEditButton}>Edit</PopoverBody>
        <PopoverBody onClick={props.onDeleteButton}>Delete</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
