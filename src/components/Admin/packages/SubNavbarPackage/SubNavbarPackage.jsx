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

const SubNavbarPackage = () => {
  return (
    <Popover placement="bottom-start" trigger="hover" isLazy>
      <PopoverTrigger>
        <Button rightIcon={<ChevronDownIcon />} variant="ghost" p="2">
          Packages
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
