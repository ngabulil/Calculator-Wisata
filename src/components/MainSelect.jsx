import Select from "react-select";
import SelectCreatable from "react-select/creatable";
import { Flex, Text, IconButton } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

const customSelectStyles = (isError) => ({
  control: (base, state) => ({
    ...base,
    backgroundColor: "#2D3748",
    borderColor: isError ? "#F56565" : state.isFocused ? "#3182ce" : "#4A5568",
    color: "white",
    boxShadow: isError
      ? "0 0 0 1px #F56565"
      : state.isFocused
      ? "0 0 0 1px #3182ce"
      : "none",
    "&:hover": {
      borderColor: isError ? "#F56565" : "#3182ce",
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#2D3748",
    color: "white",
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected ? "#2B6CB0" : isFocused ? "#4A5568" : "#2D3748",
    color: "white",
  }),
  singleValue: (base) => ({
    ...base,
    color: "white",
  }),
  input: (base) => ({
    ...base,
    color: "white",
  }),
});

const CustomOption = (props) => {
  const { data, innerRef, innerProps, selectProps } = props;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (selectProps.onDeleteOption) {
      selectProps.onDeleteOption(data.value);
    }
  };

  const isNewOption = data.__isNew__ === true;

  return (
    <div ref={innerRef} {...innerProps}>
      <Flex
        justify="space-between"
        align="center"
        px={3}
        py={2}
        _hover={{ bg: "gray.600" }}
      >
        <Text color="white">{data.label}</Text>

        {!isNewOption && (
          <IconButton
            icon={<DeleteIcon />}
            size="sm"
            colorScheme="red"
            variant="ghost"
            aria-label={`Hapus ${data.label}`}
            onClick={handleDelete}
          />
        )}
      </Flex>
    </div>
  );
};

export const MainSelectCreatableWithDelete = ({
  options = [],
  value,
  onChange,
  placeholder,
  onCreateOption, // ← dari parent (misal API post)
  onDeleteOption, // ← dari parent (misal API delete)
  isError = false,
}) => {
  return (
    <SelectCreatable
      isSearchable
      styles={customSelectStyles(isError)}
      value={value || null}
      onChange={onChange}
      onCreateOption={onCreateOption}
      placeholder={placeholder}
      options={options}
      components={{ Option: CustomOption }}
      onDeleteOption={onDeleteOption}
    />
  );
};

const MainSelect = ({
  options = [],
  value,
  onChange,
  placeholder,
  isError = false,
}) => {
  return (
    <Select
      options={options}
      value={value || null}
      onChange={onChange}
      placeholder={placeholder}
      styles={customSelectStyles(isError)}
      isClearable
      isSearchable
    />
  );
};

export const MainSelectCreatable = ({
  options = [],
  value,
  onChange,
  placeholder,
  isError = false,
}) => {
  return (
    <SelectCreatable
      options={options}
      value={value || null}
      onChange={onChange}
      placeholder={placeholder}
      styles={customSelectStyles(isError)}
      isSearchable
    />
  );
};

export default MainSelect;
