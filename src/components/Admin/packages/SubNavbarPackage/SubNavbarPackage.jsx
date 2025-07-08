import {
  Box,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Button,
  VStack,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useLocation } from "react-router-dom";

const SubNavbarPackage = () => {
  const location = useLocation();

  const buttonLabel = location.pathname.includes("hotel")
    ? "Hotel"
    : location.pathname.includes("villa")
    ? "Villa"
    : "Package";

  return (
    <Popover placement="bottom-start" trigger="hover" isLazy>
      <PopoverTrigger>
        <Button variant="ghost" p="2">
          {buttonLabel}
        </Button>
      </PopoverTrigger>

      <PopoverContent width="200px" p={0}>
        <PopoverArrow />
        <PopoverBody>
          <VStack align="start" spacing={2}>
            <Link href="/admin">Package</Link>
            <Link href="/admin/packages/hotel">Hotel</Link>
            <Link href="/admin/packages/villa">Villa</Link>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default SubNavbarPackage;
