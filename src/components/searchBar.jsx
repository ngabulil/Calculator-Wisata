import { Box, Input } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

const SearchBar = (props) => {
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      gap={2}
      className="relative"
      w={"30%"}
    >
      <Input
        className="relative"
        placeholder={props.placeholder}
        onChange={(e) => {
          props.onChange(e);
        }}
      />
      <Icon
        style={{
          right: 5,
        }}
        icon="ic:baseline-search"
        className="text-gray-200 text-[24px] absolute"
      />
    </Box>
  );
};

export default SearchBar;
